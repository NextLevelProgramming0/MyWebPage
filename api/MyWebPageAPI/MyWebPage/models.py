from django.db import models

# Create your models here.

class Skills(models.Model):
    name = models.CharField(max_length=100)
    whereSkillLearned = models.CharField(max_length=100)

class Projects(models.Model):
    projectName = models.CharField(max_length=100)
    projectDescription = models.TextField()
    projectLink = models.URLField()

class Experience(models.Model):
    jobTitle = models.CharField(max_length=100)
    companyName = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    description = models.TextField()

class Education(models.Model):
    degree = models.CharField(max_length=100)
    degreeImage = models.ImageField(upload_to='Photos/')
    institution = models.CharField(max_length=100)
    yearOfCompletion = models.CharField(max_length=4)

class ContactInfo(models.Model):
    email = models.EmailField()
    phoneNumber = models.CharField(max_length=15)
    address = models.TextField()
