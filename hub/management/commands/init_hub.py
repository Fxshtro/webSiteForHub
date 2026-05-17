"""Команда для инициализации начальных данных Хаба"""
from django.core.management.base import BaseCommand
from hub.models import SiteRole, Direction


MANAGER_ROLE_TITLE = 'Менеджер проекта'
LAB_LEAD_ROLE_TITLE = 'Лидер лаборатории'
ADMIN_ROLE_TITLE = 'Администратор'
STUDENT_ROLE_TITLE = 'Студент'


class Command(BaseCommand):
    help = 'Инициализация начальных данных для Хаба'

    def handle(self, *args, **options):
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