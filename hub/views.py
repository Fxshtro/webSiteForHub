"""Views для приложения hub"""
from django.http import FileResponse, Http404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from .models import Project
from .utils import log_event

# API views можно добавить позже при необходимости


@login_required
@require_http_methods(["GET"])
def download_concept_file(request, project_id):
    """Скачивание файла концепции проекта с логированием"""
    try:
        project = Project.objects.get(id=project_id)
        
        # Проверка прав доступа
        user = request.user
        if not user.is_admin():
            if user.is_lab_lead() and project.lab != user.managed_lab:
                raise Http404("У вас нет доступа к этому файлу")
            elif user.is_project_manager():
                from .models import ProjectParticipant
                if not ProjectParticipant.objects.filter(
                    user=user,
                    project=project,
                    role='manager',
                    left_at__isnull=True
                ).exists():
                    raise Http404("У вас нет доступа к этому файлу")
        
        if not project.concept_file:
            raise Http404("Файл не найден")
        
        # Логирование
        log_event(
            user=user,
            action='file_download',
            entity_type='Project',
            entity_id=project.id,
            details={
                'filename': project.concept_file.name,
                'project': project.title
            }
        )
        
        return FileResponse(
            project.concept_file.open(),
            as_attachment=True,
            filename=project.concept_file.name.split('/')[-1]
        )
    except Project.DoesNotExist:
        raise Http404("Проект не найден")

