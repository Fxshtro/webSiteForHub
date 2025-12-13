"""Вспомогательные утилиты"""
from .models import EventLog


def log_event(user, action, entity_type, entity_id, details=None):
    """Создать запись в журнале событий"""
    EventLog.objects.create(
        user=user,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details or {}
    )

