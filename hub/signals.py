"""Сигналы Django для автоматического логирования"""
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.contrib.admin.models import LogEntry
from .models import Project, ProjectParticipant, Achievement, EventLog
from .utils import log_event


@receiver(post_save, sender=Project)
def log_project_created(sender, instance, created, **kwargs):
    """Логирование создания/обновления проекта"""
    if created:
        log_event(
            user=None,  # Будет установлен в admin.py через request.user
            action='project_created',
            entity_type='Project',
            entity_id=instance.id,
            details={'title': instance.title, 'lab': str(instance.lab)}
        )
    else:
        log_event(
            user=None,
            action='project_updated',
            entity_type='Project',
            entity_id=instance.id,
            details={'title': instance.title}
        )

