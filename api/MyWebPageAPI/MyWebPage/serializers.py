from rest_framework import serializers
from MyWebPage.models import Skills, Projects, Experience, Education, ContactInfo

class SkillsSerializer(serializers.ModelSerializer):
    SkillId = serializers.IntegerField(source='id', read_only=True)
    SkillName = serializers.CharField(source='name')
    SkillLearned = serializers.CharField(source='whereSkillLearned')

    class Meta:
        model = Skills
        fields = ('SkillId', 'SkillName', 'SkillLearned')

class ProjectsSerializer(serializers.ModelSerializer):
    ProjectId = serializers.IntegerField(source='id', read_only=True)
    ProjectName = serializers.CharField(source='projectName')
    ProjectDescription = serializers.CharField(source='projectDescription')
    ProjectLink = serializers.URLField(source='projectLink')

    class Meta:
        model = Projects
        fields = ('ProjectId', 'ProjectName', 'ProjectDescription', 'ProjectLink')

class ExperienceSerializer(serializers.ModelSerializer):
    ExperienceId = serializers.IntegerField(source='id', read_only=True)
    JobTitle = serializers.CharField(source='jobTitle')
    CompanyName = serializers.CharField(source='companyName')
    Duration = serializers.CharField(source='duration')
    Description = serializers.CharField(source='description')

    class Meta:
        model = Experience
        fields = ('ExperienceId', 'JobTitle', 'CompanyName', 'Duration', 'Description')

class EducationSerializer(serializers.ModelSerializer):
    EducationId = serializers.IntegerField(source='id', read_only=True)
    Degree = serializers.CharField(source='degree')
    DegreeImage = serializers.FileField(source='degreeImage', required=False)
    Institution = serializers.CharField(source='institution')
    YearOfCompletion = serializers.CharField(source='yearOfCompletion')

    def validate_DegreeImage(self, file):
        content_type = getattr(file, 'content_type', '')
        if content_type == 'application/pdf' or content_type.startswith('image/'):
            return file
        raise serializers.ValidationError('Upload a PDF or an image file.')

    class Meta:
        model = Education
        fields = ('EducationId', 'Degree', 'DegreeImage', 'Institution', 'YearOfCompletion')

class ContactInfoSerializer(serializers.ModelSerializer):
    ContactId = serializers.IntegerField(source='id', read_only=True)
    Email = serializers.EmailField(source='email')
    PhoneNumber = serializers.CharField(source='phoneNumber')
    Address = serializers.CharField(source='address')

    class Meta:
        model = ContactInfo
        fields = ('ContactId', 'Email', 'PhoneNumber', 'Address')
