from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

from MyWebPage.models import Skills, Projects, Experience, Education, ContactInfo
from MyWebPage.serializers import (
    SkillsSerializer, ProjectsSerializer,
    ExperienceSerializer, EducationSerializer,
    ContactInfoSerializer
)

from django.core.files.storage import default_storage


def normalize_data(request_data, mappings):
    """Return a mutable copy of request_data with common frontend keys remapped to model fields.
    mappings is a dict of target_field -> list of candidate keys to look for (case-insensitive).
    """
    data = request_data.copy() if hasattr(request_data, 'copy') else dict(request_data)
    # build a lowercase lookup for keys to support case-insensitive matching
    lower_keys = {k.lower(): k for k in data.keys()}
    for target, candidates in mappings.items():
        for cand in candidates:
            if cand in data:
                data[target] = data.pop(cand)
                break
            if cand.lower() in lower_keys:
                old_key = lower_keys[cand.lower()]
                data[target] = data.pop(old_key)
                break
    return data

# ==========================
# Skills Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def skills_list(request):
    if request.method == 'GET':
        skills = Skills.objects.all()
        serializer = SkillsSerializer(skills, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        mappings = {
            'name': ['SkillName', 'skillName', 'skill_name', 'name'],
            'whereSkillLearned': ['Where Learned', 'whereLearned', 'where_skill_learned', 'whereSkillLearned']
        }
        data = normalize_data(request.data, mappings)
        serializer = SkillsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'PUT':
        # accept multiple possible id keys from frontend
        skill_id = request.data.get('id') or request.data.get('skillId') or request.data.get('SkillID') or request.data.get('skill_id')
        if not skill_id:
            return Response({'error': 'ID is required'}, status=400)
        skill = get_object_or_404(Skills, id=skill_id)
        mappings = {
            'name': ['SkillName', 'skillName', 'skill_name', 'name'],
            'whereSkillLearned': ['Where Learned', 'whereLearned', 'where_skill_learned', 'whereSkillLearned']
        }
        data = normalize_data(request.data, mappings)
        serializer = SkillsSerializer(skill, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'DELETE':
        skill_id = request.GET.get('id')
        if not skill_id:
            return Response({'error': 'ID is required'}, status=400)
        skill = get_object_or_404(Skills, id=skill_id)
        skill.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# Projects Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def projects_list(request):
    if request.method == 'GET':
        projects = Projects.objects.all()
        serializer = ProjectsSerializer(projects, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        mappings = {
            'projectName': ['ProjectName', 'projectName', 'project_name', 'name'],
            'projectDescription': ['ProjectDescription', 'projectDescription', 'project_description', 'description'],
            'projectLink': ['ProjectLink', 'projectLink', 'project_link', 'link', 'projectURL', 'projectUrl']
        }
        data = normalize_data(request.data, mappings)
        serializer = ProjectsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'PUT':
        project_id = request.data.get('id') or request.data.get('projectId') or request.data.get('ProjectID') or request.data.get('project_id')
        if not project_id:
            return Response({'error': 'ID is required'}, status=400)
        project = get_object_or_404(Projects, id=project_id)
        mappings = {
            'projectName': ['ProjectName', 'projectName', 'project_name', 'name'],
            'projectDescription': ['ProjectDescription', 'projectDescription', 'project_description', 'description'],
            'projectLink': ['ProjectLink', 'projectLink', 'project_link', 'link', 'projectURL', 'projectUrl']
        }
        data = normalize_data(request.data, mappings)
        serializer = ProjectsSerializer(project, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'DELETE':
        project_id = request.GET.get('id')
        if not project_id:
            return Response({'error': 'ID is required'}, status=400)
        project = get_object_or_404(Projects, id=project_id)
        project.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# Experience Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def experience_list(request):
    if request.method == 'GET':
        experiences = Experience.objects.all()
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        mappings = {
            'jobTitle': ['JobTitle', 'jobTitle', 'job_title', 'title'],
            'companyName': ['CompanyName', 'companyName', 'company_name'],
            'duration': ['Duration', 'duration', 'time', 'period'],
            'description': ['Description', 'description', 'details']
        }
        data = normalize_data(request.data, mappings)
        serializer = ExperienceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'PUT':
        exp_id = request.data.get('id') or request.data.get('expId') or request.data.get('experienceId') or request.data.get('exp_id')
        if not exp_id:
            return Response({'error': 'ID is required'}, status=400)
        experience = get_object_or_404(Experience, id=exp_id)
        mappings = {
            'jobTitle': ['JobTitle', 'jobTitle', 'job_title', 'title'],
            'companyName': ['CompanyName', 'companyName', 'company_name'],
            'duration': ['Duration', 'duration', 'time', 'period'],
            'description': ['Description', 'description', 'details']
        }
        data = normalize_data(request.data, mappings)
        serializer = ExperienceSerializer(experience, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'DELETE':
        exp_id = request.GET.get('id')
        if not exp_id:
            return Response({'error': 'ID is required'}, status=400)
        experience = get_object_or_404(Experience, id=exp_id)
        experience.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# Education Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def education_list(request):
    if request.method == 'GET':
        educations = Education.objects.all()
        serializer = EducationSerializer(educations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        mappings = {
            'degree': ['Degree', 'degree', 'degreeName', 'degree_name'],
            'degreeImage': ['degreeImage', 'degree_image', 'image'],
            'institution': ['Institution', 'institution', 'school', 'college'],
            'yearOfCompletion': ['YearOfCompletion', 'yearOfCompletion', 'year', 'year_of_completion']
        }
        data = normalize_data(request.data, mappings)
        serializer = EducationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'PUT':
        edu_id = request.data.get('id') or request.data.get('eduId') or request.data.get('educationId') or request.data.get('edu_id')
        if not edu_id:
            return Response({'error': 'ID is required'}, status=400)
        education = get_object_or_404(Education, id=edu_id)
        mappings = {
            'degree': ['Degree', 'degree', 'degreeName', 'degree_name'],
            'degreeImage': ['degreeImage', 'degree_image', 'image'],
            'institution': ['Institution', 'institution', 'school', 'college'],
            'yearOfCompletion': ['YearOfCompletion', 'yearOfCompletion', 'year', 'year_of_completion']
        }
        data = normalize_data(request.data, mappings)
        serializer = EducationSerializer(education, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'DELETE':
        edu_id = request.GET.get('id')
        if not edu_id:
            return Response({'error': 'ID is required'}, status=400)
        education = get_object_or_404(Education, id=edu_id)
        education.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# ContactInfo Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def contactinfo_list(request):
    if request.method == 'GET':
        contactinfos = ContactInfo.objects.all()
        serializer = ContactInfoSerializer(contactinfos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        mappings = {
            'email': ['Email', 'email', 'emailAddress', 'email_address'],
            'phoneNumber': ['Phone', 'phone', 'phoneNumber', 'phone_number', 'phoneNo'],
            'address': ['Address', 'address', 'addr']
        }
        data = normalize_data(request.data, mappings)
        serializer = ContactInfoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'PUT':
        ci_id = request.data.get('id') or request.data.get('ciId') or request.data.get('contactId') or request.data.get('contact_id')
        if not ci_id:
            return Response({'error': 'ID is required'}, status=400)
        contactinfo = get_object_or_404(ContactInfo, id=ci_id)
        mappings = {
            'email': ['Email', 'email', 'emailAddress', 'email_address'],
            'phoneNumber': ['Phone', 'phone', 'phoneNumber', 'phone_number', 'phoneNo'],
            'address': ['Address', 'address', 'addr']
        }
        data = normalize_data(request.data, mappings)
        serializer = ContactInfoSerializer(contactinfo, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response({'errors': serializer.errors}, status=400)

    elif request.method == 'DELETE':
        ci_id = request.GET.get('id') or request.GET.get('ciId') or request.GET.get('contactId') or request.GET.get('contact_id')
        if not ci_id:
            return Response({'error': 'ID is required'}, status=400)
        contactinfo = get_object_or_404(ContactInfo, id=ci_id)
        contactinfo.delete()
        return Response({'message': 'Deleted Successfully'})
    
@csrf_exempt
def SaveFile(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file provided'}, status=400)
    file_name = default_storage.save(file.name, file)
    return Response({'file_name': file_name})