"""Команда для инициализации начальных данных Хаба"""
from django.core.management.base import BaseCommand
from hub.models import HubSettings, Direction


class Command(BaseCommand):
    help = 'Инициализация начальных данных для Хаба'

    def handle(self, *args, **options):
        # Создаем настройки Хаба
        settings, created = HubSettings.objects.get_or_create(pk=1)
        if created:
            settings.name = 'Студенческий Цифровой Хаб'
            settings.description = 'Платформа для управления студенческими проектами и лабораториями'
            settings.save()
            self.stdout.write(
                self.style.SUCCESS('Настройки Хаба созданы')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Настройки Хаба уже существуют')
            )
        
        # Создаем примерные направления
        directions = [
            'Искусственный интеллект',
            'Веб-разработка',
            'Мобильная разработка',
            'Кибербезопасность',
            'Data Science',
        ]
        
        created_count = 0
        for direction_name in directions:
            direction, created = Direction.objects.get_or_create(name=direction_name)
            if created:
                created_count += 1
        
        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Создано {created_count} направлений')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Направления уже существуют')
            )
        
        self.stdout.write(
            self.style.SUCCESS('Инициализация завершена!')
        )

