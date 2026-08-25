from django.db import models
from django.conf import settings
import uuid

# Create your models here.

class Skills(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    whereSkillLearned = models.CharField(max_length=100)

class Projects(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    projectName = models.CharField(max_length=100)
    projectDescription = models.TextField()
    projectLink = models.URLField()

class Experience(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='experiences')
    jobTitle = models.CharField(max_length=100)
    companyName = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    description = models.TextField()

class Education(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='education_records')
    degree = models.CharField(max_length=100)
    degreeImage = models.FileField(
        upload_to='Photos/',
        blank=True,
    )
    institution = models.CharField(max_length=100)
    yearOfCompletion = models.CharField(max_length=4)

class ContactInfo(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contact_information')
    email = models.EmailField()
    phoneNumber = models.CharField(max_length=15)
    address = models.TextField()


class SignupRequest(models.Model):
    email = models.EmailField(unique=True)
    initial_password_hash = models.CharField(max_length=128)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    email_verified = models.BooleanField(default=False)
