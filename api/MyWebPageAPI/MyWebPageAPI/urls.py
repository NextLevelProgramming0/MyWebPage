"""
URL configuration for MyWebPageAPI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from MyWebPage import views

from django.contrib import admin
from django.urls import path

from django.conf.urls.static import static
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from MyWebPage import auth_views


def api_root(request):
    return JsonResponse({
        'message': 'MyWebPage API is running',
        'endpoints': ['skills/', 'projects/', 'experience/', 'education/', 'contactinfo/'],
    })


def favicon(request):
    return HttpResponse(status=204)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('favicon.ico', favicon, name='favicon'),
    path('auth/token/', auth_views.EmailOrUsernameTokenView.as_view(), name='token-obtain-pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/signup/', auth_views.request_signup, name='signup'),
    path('auth/signup/verify/', auth_views.verify_signup, name='verify-signup'),
    path('auth/password/forgot/', auth_views.forgot_password, name='forgot-password'),
    path('auth/password/reset/', auth_views.reset_password, name='reset-password'),
    path('home/professional-picture/', views.professional_picture),
    path('admin/', admin.site.urls),
    path('skills/', views.skills_list),
    path('projects/', views.projects_list),
    path('experience/', views.experience_list),
    path('education/', views.education_list),
    path('education/<int:education_id>/download/', views.download_education_file),
    path('education/<int:education_id>/file/', views.delete_education_file),
    path('contactinfo/', views.contactinfo_list),
]

# Serve media files in development only
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
