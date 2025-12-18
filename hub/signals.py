from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from django.contrib.admin.models import LogEntry
from django.contrib.auth import get_user_model
from .models import Project, Lab, EventLog
from .utils import log_event

User = get_user_model()


def get_user_from_request():
    try:
        from django.utils import timezone
        latest_log = LogEntry.objects.filter(
            content_type__model__in=['project', 'lab'],
            action_time__gte=timezone.now() - timezone.timedelta(seconds=5)
        ).order_by('-action_time').first()
        
        if latest_log:
            return latest_log.user
    except Exception:
        pass
    return None


@receiver(post_save, sender=Project)
def log_project_changes(sender, instance, created, **kwargs):
    user = get_user_from_request()
    if created:
        log_event(
            user=user,
            action='project_created',
            entity_type='Project',
            entity_id=instance.id,
            details={'title': instance.title, 'lab': str(instance.lab)}
        )
    else:
        if 'update_fields' not in kwargs or kwargs['update_fields']:
            log_event(
                user=user,
                action='project_updated',
                entity_type='Project',
                entity_id=instance.id,
                details={'title': instance.title}
            )


@receiver(post_save, sender=Lab)
def log_lab_changes(sender, instance, created, **kwargs):
    user = get_user_from_request()
    
    if created:
        log_event(
            user=user,
            action='lab_created',
            entity_type='Lab',
            entity_id=instance.id,
            details={'name': instance.name}
        )
    else:
        if 'update_fields' not in kwargs or kwargs['update_fields']:
            log_event(
                user=user,
                action='lab_updated',
                entity_type='Lab',
                entity_id=instance.id,
                details={'name': instance.name}
            )

