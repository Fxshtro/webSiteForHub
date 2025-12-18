from django.apps import AppConfig


class HubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hub'
    
    def ready(self):
        """Импортируем сигналы при запуске приложения"""
        import hub.signals  # noqa
    
    def ready(self):
        import hub.signals  # noqa
