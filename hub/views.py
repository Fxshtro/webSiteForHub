from django.http import FileResponse, Http404
from django.urls import path


def api_root(request):
    from django.http import JsonResponse
    return JsonResponse({
        'message': 'API хаба',
        'admin': '/admin/',
    })


def download_concept_file(request, project_id):
    raise Http404("Функция загрузки файлов концепций не реализована")


urlpatterns = [
    path('', api_root, name='api_root'),
]