"""Команда для инициализации начальных данных Хаба"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from hub.models import SiteRole, Direction


MANAGER_ROLE_TITLE = 'Менеджер проекта'
LAB_LEAD_ROLE_TITLE = 'Лидер лаборатории'
ADMIN_ROLE_TITLE = 'Администратор'
STUDENT_ROLE_TITLE = 'Студент'

SUPERUSER_USERNAME = 'admin'
SUPERUSER_PASSWORD = 'admin'
SUPERUSER_EMAIL = 'admin@hub.local'


class Command(BaseCommand):
    help = 'Инициализация начальных данных для Хаба'

    def handle(self, *args, **options):
        User = get_user_model()

        if not User.objects.filter(username=SUPERUSER_USERNAME).exists():
            User.objects.create_superuser(
                username=SUPERUSER_USERNAME,
                password=SUPERUSER_PASSWORD,
                email=SUPERUSER_EMAIL,
            )
            self.stdout.write(self.style.SUCCESS(f'Суперпользователь "{SUPERUSER_USERNAME}" создан'))
        else:
            self.stdout.write(f'Суперпользователь "{SUPERUSER_USERNAME}" уже существует')

        roles = [ADMIN_ROLE_TITLE, LAB_LEAD_ROLE_TITLE, MANAGER_ROLE_TITLE, STUDENT_ROLE_TITLE]
        for role_title in roles:
            role, created = SiteRole.objects.get_or_create(title=role_title)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Роль "{role_title}" создана'))

        existing = Direction.objects.count()
        if existing == 0:
            self.stdout.write(self.style.WARNING('Направления пусты — заполните из SQL-дампа'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Направлений в базе: {existing}'))

        self.stdout.write(self.style.SUCCESS('Инициализация завершена!'))