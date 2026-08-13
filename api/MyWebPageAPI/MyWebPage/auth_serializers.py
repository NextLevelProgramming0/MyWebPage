from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    username_field = 'identifier'
    identifier = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('identifier', '').strip()
        password = attrs.get('password', '')
        User = get_user_model()
        username = identifier
        if '@' in identifier:
            matches = User.objects.filter(email__iexact=identifier, is_active=True)
            if matches.count() != 1:
                raise serializers.ValidationError('Invalid email/username or password.')
            username = matches.first().get_username()

        user = authenticate(request=self.context.get('request'), username=username, password=password)
        if not user or not user.is_active:
            raise serializers.ValidationError('Invalid email/username or password.')

        refresh = self.get_token(user)
        return {'refresh': str(refresh), 'access': str(refresh.access_token)}
