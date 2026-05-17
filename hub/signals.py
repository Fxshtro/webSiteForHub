from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project, Laboratory, Report


@receiver(post_save, sender=Project)
def log_project_changes(sender, instance, created, **kwargs):
    from .utils import log_event
    from django.contrib.admin.models import LogEntry
    from django.utils import timezone

    try:
        latest_log = LogEntry.objects.filter(
            content_type__model='project',
            action_time__gte=timezone.now() - timezone.timedelta(seconds=5)
        ).order_by('-action_time').first()
        user_login = latest_log.user.login if latest_log and latest_log.user else None
    except Exception:
        user_login = None

    action = 'project_created' if created else 'project_updated'
    log_event(
        user_login=user_login,
        action=action,
        entity_type='Project',
        entity_id=instance.id,
        details={'title': instance.title}
    )


@receiver(post_save, sender=Laboratory)
def log_lab_changes(sender, instance, created, **kwargs):
    from .utils import log_event
    from django.contrib.admin.models import LogEntry
    from django.utils import timezone

    try:
        latest_log = LogEntry.objects.filter(
            content_type__model='laboratory',
            action_time__gte=timezone.now() - timezone.timedelta(seconds=5)
        ).order_by('-action_time').first()
        user_login = latest_log.user.login if latest_log and latest_log.user else None
    except Exception:
        user_login = None

    action = 'lab_created' if created else 'lab_updated'
    log_event(
        user_login=user_login,
        action=action,
        entity_type='Laboratory',
        entity_id=instance.id,
        details={'title': instance.title}
    )


@receiver(post_save, sender=Report)
def log_report_changes(sender, instance, created, **kwargs):
    if created:
        from .utils import log_event
        details = {
            'project': str(instance.project) if instance.project else None,
            'laboratory': str(instance.laboratory) if instance.laboratory else None,
        }
        log_event(
            user_login=None,
            action='report_created',
            entity_type='Report',
            entity_id=instance.id,
            details=details
        )