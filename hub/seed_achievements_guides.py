import django, os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub_backend.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
django.setup()

from django.db import transaction
from hub.models import Laboratory, Guide, Achievement

achievements_data = {
    'legal-tech': [
        'Разработан шаблон договора для НКО — принят юрдепом региона',
        'Команда заняла 1 место на Legal Hackathon 2026',
        'Опубликована статья в журнале "Legal Tech Today"',
        'Проведён вебинар по Legal Design для 200+ участников',
        'Интеграция с Госуслугами для автоматизации документов',
        'Победа в конкурсе стартапов DIGITAL LAW 2026',
    ],
    'it-lab': [
        'Запущена платформа для онлайн-хакатонов с 5000+ пользователей',
        'Релиз мобильного приложения "IT Helper" для студентов',
        'Победа на Всероссийском чемпионате по программированию',
        'Внедрение CI/CD пайплайна для всех проектов лаборатории',
        'Проведён цикл мастер-классов по Kubernetes и Docker',
        'Создан open-source инструмент для автоматизации тестирования',
    ],
    'inno-travel': [
        'Разработан AR-гид по историческому центру города',
        'Приложение "InnoTravel" вышло в топ-10 App Store Travel',
        'Победа в хакатоне "Цифровой туризм 2026"',
        'Интеграция с картами 2GIS для пеших маршрутов',
        'Создан голосовой ассистент для туристов на базе ИИ',
        'Опубликовано исследование рынка цифрового туризма ЮФО',
    ],
    'finprocess-tech': [
        'Разработана BI-панель для финансового мониторинга города',
        'Победа в финтех-хакатоне от Сбера',
        'Внедрение скоринговой модели для МСП',
        'Создан симулятор инвестиционного портфеля для студентов',
        'Запуск чат-бота для финансовых консультаций',
        'Публикация в Journal of Financial Innovation',
    ],
    'psy-tech': [
        'Запущено мобильное приложение "MindCare" для студентов',
        'Разработан ИИ-трекер эмоционального состояния',
        'Проведено исследование психологического благополучия (N=1000)',
        'Создан VR-тренажёр для развития стрессоустойчивости',
        'Победа на конференции "Digital Psychology 2026"',
        'Интеграция с сервисами психологической помощи вузов',
    ],
}

guides_data = {
    'legal-tech': [
        ('Сергеев', 'Алексей', 'Владимирович'),
        ('Кузнецова', 'Мария', 'Игоревна'),
    ],
    'it-lab': [
        ('Попов', 'Дмитрий', 'Андреевич'),
    ],
    'inno-travel': [
        ('Васильева', 'Анна', 'Сергеевна'),
        ('Зайцев', 'Михаил', 'Олегович'),
    ],
    'finprocess-tech': [
        ('Смирнова', 'Елена', 'Павловна'),
    ],
    'psy-tech': [
        ('Козлова', 'Татьяна', 'Алексеевна'),
        ('Морозов', 'Артём', 'Валерьевич'),
    ],
}

with transaction.atomic():
    for slug, titles in achievements_data.items():
        lab = Laboratory.objects.filter(slug=slug).first()
        if not lab:
            print(f'WARNING: No lab found for slug={slug}')
            continue
        created = 0
        for title in titles:
            _, was_created = Achievement.objects.get_or_create(
                title=title,
                defaults={
                    'laboratory': lab,
                    'text_limited': title,
                }
            )
            if was_created:
                created += 1
        print(f'Achievements for {slug}: {created} created (total: {len(titles)})')

    for slug, guides in guides_data.items():
        lab = Laboratory.objects.filter(slug=slug).first()
        if not lab:
            continue
        created = 0
        for surname, name, patronymic in guides:
            full_name = f'{surname} {name} {patronymic}'
            _, was_created = Guide.objects.get_or_create(
                surname=surname, name=name, patronymic=patronymic,
                defaults={'laboratory': lab}
            )
            if was_created:
                created += 1
        print(f'Guides for {slug}: {created} created')

print('Done!')
