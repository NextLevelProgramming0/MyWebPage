from datetime import timedelta
import ipaddress
import socket
from urllib.parse import urlparse, urlunparse

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.mail import BadHeaderError
from smtplib import SMTPException
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .auth_serializers import EmailOrUsernameTokenSerializer
from .models import SignupRequest


def _local_network_ip():
    """Return the host's active LAN address without sending network traffic."""
    connection = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        connection.connect(('8.8.8.8', 80))
        return connection.getsockname()[0]
    except OSError:
        return '127.0.0.1'
    finally:
        connection.close()


def _frontend_url(request):
    """Choose a safe frontend origin and replace loopback with the current LAN IP."""
    supplied = request.data.get('frontend_url', '').strip()
    configured = settings.FRONTEND_URL.rstrip('/')
    candidate = supplied or configured
    parsed = urlparse(candidate)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname:
        parsed = urlparse(configured)

    hostname = parsed.hostname
    configured_host = urlparse(configured).hostname
    if hostname not in ('localhost', '127.0.0.1', '::1'):
        try:
            address = ipaddress.ip_address(hostname)
            if not (address.is_private or address.is_loopback):
                parsed = urlparse(configured)
                hostname = parsed.hostname
        except ValueError:
            if hostname != configured_host:
                parsed = urlparse(configured)
                hostname = parsed.hostname

    if hostname in ('localhost', '127.0.0.1', '::1'):
        hostname = _local_network_ip()
        port = parsed.port or 3000
        netloc = f'{hostname}:{port}'
        return urlunparse((parsed.scheme or 'http', netloc, '', '', '', '')).rstrip('/')

    return urlunparse((parsed.scheme, parsed.netloc, '', '', '', '')).rstrip('/')


class EmailOrUsernameTokenView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenSerializer


def _password_error(password, user=None):
    try:
        validate_password(password, user=user)
    except ValidationError as exc:
        return list(exc.messages)
    return None


@api_view(['POST'])
@permission_classes([AllowAny])
def request_signup(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    User = get_user_model()
    if not email or '@' not in email:
        return Response({'error': 'Enter a valid email address.'}, status=400)
    if User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'An account already uses this email address.'}, status=400)
    errors = _password_error(password)
    if errors:
        return Response({'error': ' '.join(errors)}, status=400)

    signup, _ = SignupRequest.objects.update_or_create(
        email=email,
        defaults={'initial_password_hash': make_password(password), 'created_at': timezone.now(), 'email_verified': False},
    )
    signup.token = __import__('uuid').uuid4()
    signup.save(update_fields=['token'])
    link = f"{_frontend_url(request)}/verify-email?token={signup.token}"
    try:
        send_mail(
            'Verify your MyWebPage account',
            f'Open this link within 24 hours to verify your email and finish creating your account:\n\n{link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
    except (SMTPException, OSError, BadHeaderError):
        return Response({'error': 'Verification email could not be sent. Please try again later.'}, status=503)
    return Response({'message': 'Verification email sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_signup(request):
    token = request.data.get('token', '')
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    try:
        signup = SignupRequest.objects.get(token=token)
    except (SignupRequest.DoesNotExist, ValueError):
        return Response({'error': 'This verification link is invalid.'}, status=400)
    if timezone.now() - signup.created_at > timedelta(hours=24):
        return Response({'error': 'This verification link has expired.'}, status=400)
    User = get_user_model()
    if not username or User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'Choose a different username.'}, status=400)
    if User.objects.filter(email__iexact=signup.email).exists():
        return Response({'error': 'This email address is already registered.'}, status=400)
    candidate = User(username=username, email=signup.email)
    errors = _password_error(password, candidate)
    if errors:
        return Response({'error': ' '.join(errors)}, status=400)
    candidate.set_password(password)
    candidate.save()
    signup.delete()
    return Response({'message': 'Account created. You can now log in.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email', '').strip().lower()
    User = get_user_model()
    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        link = f"{_frontend_url(request)}/reset-password?uid={uid}&token={token}"
        try:
            send_mail(
                'Reset your MyWebPage password',
                f'Open this link to reset your password:\n\n{link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except (SMTPException, OSError, BadHeaderError):
            return Response({'error': 'Reset email could not be sent. Please try again later.'}, status=503)
    return Response({'message': 'If that email is registered, a reset link has been sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    User = get_user_model()
    try:
        user = User.objects.get(pk=urlsafe_base64_decode(request.data.get('uid', '')).decode())
    except (User.DoesNotExist, ValueError, TypeError, OverflowError):
        return Response({'error': 'This reset link is invalid.'}, status=400)
    token = request.data.get('token', '')
    if not default_token_generator.check_token(user, token):
        return Response({'error': 'This reset link is invalid or expired.'}, status=400)
    password = request.data.get('password', '')
    errors = _password_error(password, user)
    if errors:
        return Response({'error': ' '.join(errors)}, status=400)
    user.set_password(password)
    user.save(update_fields=['password'])
    return Response({'message': 'Password reset. You can now log in.'})
