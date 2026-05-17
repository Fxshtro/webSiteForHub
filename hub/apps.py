from django.apps import AppConfig


class HubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hub'
    verbose_name = 'Студенческий Цифровой Хаб'

    def ready(self):
        import hub.signals
