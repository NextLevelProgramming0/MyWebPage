from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
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
from django.core.files.base import ContentFile
from django.http import FileResponse, Http404
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError

def public_portfolio_owner():
    User = get_user_model()
    owner = User.objects.filter(is_superuser=True).order_by('id').first()
    return owner or User.objects.order_by('id').first()


def professional_picture_path():
    return 'ProfessionalPicture/public/professional_picture.jpg'


@api_view(['GET', 'POST'])
def professional_picture(request):
    picture_path = professional_picture_path()
    if request.method == 'GET':
        if not default_storage.exists(picture_path):
            return Response({
                'url': None,
                'use_default': True,
            })
        return Response({
            'url': request.build_absolute_uri(default_storage.url(picture_path)),
            'use_default': False,
        })

    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return Response({'error': 'Select an image to upload.'}, status=400)

    try:
        with Image.open(uploaded_file) as source_image:
            source_image = ImageOps.exif_transpose(source_image)
            fitted_image = ImageOps.fit(
                source_image.convert('RGB'),
                (1080, 1440),
                method=Image.Resampling.LANCZOS,
            )
            output = BytesIO()
            fitted_image.save(output, format='JPEG', quality=88, optimize=True)
    except (UnidentifiedImageError, OSError, ValueError):
        return Response({'error': 'The selected file is not a supported image.'}, status=400)

    if default_storage.exists(picture_path):
        default_storage.delete(picture_path)
    saved_path = default_storage.save(picture_path, ContentFile(output.getvalue()))
    return Response({
        'url': request.build_absolute_uri(default_storage.url(saved_path)),
        'use_default': False,
    })

# ==========================
# Skills Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def skills_list(request):
    if request.method == 'GET':
        skills = Skills.objects.filter(owner=public_portfolio_owner())
        serializer = SkillsSerializer(skills, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SkillsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=public_portfolio_owner())
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        skill_id = request.data.get('SkillId')
        if not skill_id:
            return Response({'error': 'ID is required'}, status=400)
        skill = get_object_or_404(Skills, id=skill_id, owner=public_portfolio_owner())
        serializer = SkillsSerializer(skill, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        skill_id = request.GET.get('id')
        if not skill_id:
            return Response({'error': 'ID is required'}, status=400)
        skill = get_object_or_404(Skills, id=skill_id, owner=public_portfolio_owner())
        skill.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# Projects Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def projects_list(request):
    if request.method == 'GET':
        projects = Projects.objects.filter(owner=public_portfolio_owner())
        serializer = ProjectsSerializer(projects, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProjectsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=public_portfolio_owner())
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        project_id = request.data.get('ProjectId')
        if not project_id:
            return Response({'error': 'ID is required'}, status=400)
        project = get_object_or_404(Projects, id=project_id, owner=public_portfolio_owner())
        serializer = ProjectsSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        project_id = request.GET.get('id')
        if not project_id:
            return Response({'error': 'ID is required'}, status=400)
        project = get_object_or_404(Projects, id=project_id, owner=public_portfolio_owner())
        project.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# Experience Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def experience_list(request):
    if request.method == 'GET':
        experiences = Experience.objects.filter(owner=public_portfolio_owner())
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=public_portfolio_owner())
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        exp_id = request.data.get('ExperienceId')
        if not exp_id:
            return Response({'error': 'ID is required'}, status=400)
        experience = get_object_or_404(Experience, id=exp_id, owner=public_portfolio_owner())
        serializer = ExperienceSerializer(experience, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        exp_id = request.GET.get('id')
        if not exp_id:
            return Response({'error': 'ID is required'}, status=400)
        experience = get_object_or_404(Experience, id=exp_id, owner=public_portfolio_owner())
        experience.delete()
        return Response({'message': 'Deleted Successfully'})


# ==========================
# Education Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def education_list(request):
    if request.method == 'GET':
        educations = Education.objects.filter(owner=public_portfolio_owner())
        serializer = EducationSerializer(educations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=public_portfolio_owner())
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        edu_id = request.data.get('EducationId')
        if not edu_id:
            return Response({'error': 'ID is required'}, status=400)
        education = get_object_or_404(Education, id=edu_id, owner=public_portfolio_owner())
        serializer = EducationSerializer(education, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        edu_id = request.GET.get('id')
        if not edu_id:
            return Response({'error': 'ID is required'}, status=400)
        education = get_object_or_404(Education, id=edu_id, owner=public_portfolio_owner())
        education.delete()
        return Response({'message': 'Deleted Successfully'})


@api_view(['GET'])
def download_education_file(request, education_id):
    education = get_object_or_404(Education, id=education_id, owner=public_portfolio_owner())
    if not education.degreeImage:
        raise Http404('This education record has no attached file.')

    try:
        file_handle = education.degreeImage.open('rb')
    except FileNotFoundError as exc:
        raise Http404('The attached file could not be found.') from exc

    return FileResponse(
        file_handle,
        as_attachment=True,
        filename=education.degreeImage.name.rsplit('/', 1)[-1],
    )


@api_view(['DELETE'])
def delete_education_file(request, education_id):
    education = get_object_or_404(Education, id=education_id, owner=public_portfolio_owner())
    if not education.degreeImage:
        return Response({'error': 'This education record has no attached file.'}, status=404)

    education.degreeImage.delete(save=False)
    education.degreeImage = ''
    education.save(update_fields=['degreeImage'])
    return Response({'message': 'File deleted successfully'})


# ==========================
# ContactInfo Views
# ==========================
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@csrf_exempt
def contactinfo_list(request):
    if request.method == 'GET':
        contactinfos = ContactInfo.objects.filter(owner=public_portfolio_owner())
        serializer = ContactInfoSerializer(contactinfos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ContactInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=public_portfolio_owner())
            return Response({'message': 'Added Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'PUT':
        ci_id = request.data.get('ContactId')
        if not ci_id:
            return Response({'error': 'ID is required'}, status=400)
        contactinfo = get_object_or_404(ContactInfo, id=ci_id, owner=public_portfolio_owner())
        serializer = ContactInfoSerializer(contactinfo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Updated Successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        ci_id = request.GET.get('id')
        if not ci_id:
            return Response({'error': 'ID is required'}, status=400)
        contactinfo = get_object_or_404(ContactInfo, id=ci_id, owner=public_portfolio_owner())
        contactinfo.delete()
        return Response({'message': 'Deleted Successfully'})
