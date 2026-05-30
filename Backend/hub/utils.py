from .models import EventLog


def log_event(user_login=None, action=None, entity_type=None, entity_id=None, details=None):
    EventLog.objects.create(
        user_login=user_login,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details or ''
    )