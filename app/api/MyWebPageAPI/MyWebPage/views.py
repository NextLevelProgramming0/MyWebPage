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
        # Accept either frontend naming (SkillName/SkillLearned) or backend naming (name/whereSkillLearned)
        data = {
            'name': request.data.get('SkillName') or request.data.get('name'),
            'whereSkillLearned': request.data.get('SkillLearned') or request.data.get('whereSkillLearned'),
        }
        serializer = SkillsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        # Accept 'id' or 'SkillId' from the frontend
        skill_id = request.data.get('id') or request.data.get('SkillId')
        if not skill_id:
            return Response({'error': 'ID is required'}, status=400)
        skill = get_object_or_404(Skills, id=skill_id)
        data = {
            'name': request.data.get('SkillName') or request.data.get('name'),
            'whereSkillLearned': request.data.get('SkillLearned') or request.data.get('whereSkillLearned'),
        }
        serializer = SkillsSerializer(skill, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        # Allow id via query param (?id=), request body, or as last path segment (e.g., /skills/3)
        skill_id = request.GET.get('id') or request.data.get('id') or request.path.rstrip('/').split('/')[-1]
        if not skill_id or (isinstance(skill_id, str) and not skill_id.isdigit()):
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
        serializer = ProjectsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        project_id = request.data.get('id')
        if not project_id:
            return Response({'error': 'ID is required'}, status=400)
        project = get_object_or_404(Projects, id=project_id)
        serializer = ProjectsSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

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
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        exp_id = request.data.get('id')
        if not exp_id:
            return Response({'error': 'ID is required'}, status=400)
        experience = get_object_or_404(Experience, id=exp_id)
        serializer = ExperienceSerializer(experience, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        exp_id = request.data.get('id')
        if not exp_id:
            return Response({'error': 'ID is required'}, status=400)
        experience = get_object_or_404(Experience, id=exp_id)
        serializer = ExperienceSerializer(experience, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

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
        try:
            # Select only existing columns to avoid ProgrammingError if migrations not applied
            educations = list(Education.objects.values('id', 'degree', 'institution', 'yearOfCompletion'))
            return Response(educations)
        except Exception as e:
            # Fallback: try full serializer and report error details if it still fails
            try:
                educations = Education.objects.all()
                serializer = EducationSerializer(educations, many=True)
                return Response(serializer.data)
            except Exception as e2:
                return Response({'error': 'Failed to fetch educations', 'details': str(e2)}, status=500)

    elif request.method == 'POST':
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        edu_id = request.data.get('id')
        if not edu_id:
            return Response({'error': 'ID is required'}, status=400)
        education = get_object_or_404(Education, id=edu_id)
        serializer = EducationSerializer(education, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

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
        serializer = ContactInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        ci_id = request.data.get('id')
        if not ci_id:
            return Response({'error': 'ID is required'}, status=400)
        contactinfo = get_object_or_404(ContactInfo, id=ci_id)
        serializer = ContactInfoSerializer(contactinfo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        ci_id = request.GET.get('id')
        if not ci_id:
            return Response({'error': 'ID is required'}, status=400)
        contactinfo = get_object_or_404(ContactInfo, id=ci_id)
        contactinfo.delete()
        return Response({'message': 'Deleted Successfully'})
    
@csrf_exempt
def SaveFile(request):
    file=request.FILES['file']
    file_name=default_storage.save(file.name,file)
    return Response(file_name, safe=False)