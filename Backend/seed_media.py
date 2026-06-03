#!/usr/bin/env python3
"""
Seed: lab photos, site content, achievements, reports, files.
"""
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'hub_backend.settings'

import django
django.setup()

from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile
from django.db import connection

from hub.models import (
    Laboratory, LabPhoto, LaboratoryImage,
    SiteContent, SiteStat,
    Achievement, Project, File, FileAchievement,
    Report, FileReport, FileProject,
    EventLog, Guide, FileGuide,
)

bug_log = []
print('=== SEED MEDIA START ===\n')

def make_image(prefix, w=1200, h=900):
    """Create a simple placeholder image with text."""
    img = Image.new('RGB', (w, h), color=(30, 40, 60))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    draw.text((50, h//2 - 20), prefix, fill=(200, 200, 255))
    buf = BytesIO()
    img.save(buf, format='JPEG', quality=85)
    buf.seek(0)
    return ContentFile(buf.read(), name=f'{prefix.lower().replace(" ","_")}.jpg')

# ─── 1. LAB PHOTOS ────────────────────────────────────────────────

lab_theme_colors = {
    'it-lab':       (41, 98, 255),
    'robotics-lab': (220, 80, 40),
    'design-lab':   (180, 50, 180),
    'cyber-lab':    (0, 180, 80),
    'media-lab':    (255, 180, 0),
}

for lab in Laboratory.objects.all():
    slug = lab.slug or ''
    color = lab_theme_colors.get(slug, (80, 80, 80))

    # Create card image
    card_img = Image.new('RGB', (1200, 900), color=color)
    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(card_img)
    draw.text((100, 400), lab.title, fill=(255, 255, 255))
    draw.text((100, 460), 'Карточка лаборатории', fill=(200, 200, 200))
    card_file = BytesIO()
    card_img.save(card_file, format='JPEG', quality=85)
    card_file.seek(0)
    card_content = ContentFile(card_file.read(), name=f'lab_card_{slug}.jpg')

    # Create lab image (inside view)
    lab_img = Image.new('RGB', (1200, 900), color=(
        min(color[0]+40, 255), min(color[1]+40, 255), min(color[2]+40, 255)
    ))
    draw = ImageDraw.Draw(lab_img)
    draw.text((100, 400), lab.title, fill=(255, 255, 255))
    draw.text((100, 460), 'Внутренний вид лаборатории', fill=(200, 200, 200))
    lab_file = BytesIO()
    lab_img.save(lab_file, format='JPEG', quality=85)
    lab_file.seek(0)
    lab_content = ContentFile(lab_file.read(), name=f'lab_inside_{slug}.jpg')

    photo = LabPhoto.objects.create(card_image=card_content, lab_image=lab_content)
    LaboratoryImage.objects.get_or_create(laboratory=lab, lab_photo=photo)
    print(f'  + Photo: {lab.title} (card + inside)')

# ─── 2. SITE CONTENT ──────────────────────────────────────────────

sc = SiteContent.objects.first()
if sc:
    sc.about_title = 'О ХАБЕ'
    sc.about_intro = (
        'Наш хаб — это центр студенческих инициатив и технологического творчества. '
        'Мы объединяем 5 лабораторий по разным направлениям IT.\n\n'
        'Каждый студент может найти проект по душе, присоединиться к команде '
        'и получить опыт работы над реальными задачами под руководством наставников.'
    )
    sc.about_mission = (
        'Наша миссия — создать среду, в которой студенты могут реализовать '
        'свои идеи, получить практические навыки и стать востребованными специалистами.\n\n'
        'Мы верим, что лучший способ научиться — это делать.'
    )
    sc.labs_subtitle = (
        'Каждая лаборатория — это уникальная команда со своей экспертизой. '
        'Выбери направление, которое тебе близко, и погружайся в мир технологий.'
    )
    sc.hero_subtitle = 'Открытая площадка для студенческих лабораторий.'
    sc.hero_description = 'Исследуй, создавай, достигай вместе с нами!'
    sc.save()
    print('  + SiteContent: updated')

    # Ensure exactly 5 stats with meaningful data
    # Delete existing, re-create (admin will re-ensure on next visit)
    sc.stats.all().delete()
    stats_data = [
        ('5 лабораторий', 0),
        ('28 студентов', 1),
        ('12 проектов', 2),
        ('8 наставников', 3),
        ('13 направлений', 4),
    ]
    for label, order in stats_data:
        SiteStat.objects.create(site_content=sc, label=label, order=order)
        print(f'  + SiteStat: {label}')
else:
    bug_log.append('No SiteContent found - create via admin first')

# ─── 3. ACHIEVEMENTS ──────────────────────────────────────────────

# Helper to create achievement with optional file
def add_achievement(title, desc, lab=None, proj=None, file_link=None, image=None):
    ach = Achievement.objects.create(
        title=title,
        description=desc[:350],
        laboratory=lab,
        project=proj,
    )
    if image:
        ach.image.save(image.name, image)
        ach.save()
    if file_link:
        f = File.objects.create(link=file_link)
        FileAchievement.objects.create(file=f, achievements=ach)
    return ach

# Generate achievement images
def make_achievement_img(text):
    img = Image.new('RGB', (1200, 900), color=(50, 60, 80))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    draw.text((60, 400), text[:30], fill=(255, 255, 255))
    draw.text((60, 460), 'Достижение', fill=(180, 180, 180))
    buf = BytesIO()
    img.save(buf, format='JPEG', quality=85)
    buf.seek(0)
    return ContentFile(buf.read(), name='achievement.jpg')

# Hub-level achievements (no lab/project)
hub_achievements = [
    ('Хакатон 2025', 'Наши студенты заняли призовые места на всероссийском хакатоне по IT среди 50 команд'),
    ('Грант на развитие', 'Хаб получил грант на развитие инфраструктуры в размере 2 млн рублей'),
    ('Партнёрство с Яндексом', 'Заключено соглашение о партнёрстве с Яндекс.Образование для стажировок'),
]
for title, desc in hub_achievements:
    ach = add_achievement(title, desc, image=make_achievement_img(title))
    print(f'  + Achievement (hub): {title}')

# Lab achievements
lab_achievements = [
    ('Веб-платформа запущена', 'Запущена новая версия веб-платформы хаба с улучшенным функционалом', 'it-lab'),
    ('AI-модель для анализа', 'Разработана модель машинного обучения для анализа успеваемости', 'it-lab'),
    ('Дрон-доставщик', 'Прототип дрона для доставки малых грузов успешно прошёл испытания', 'robotics-lab'),
    ('Победа в RoboCup', 'Команда лаборатории заняла 2 место в соревнованиях по робототехнике', 'robotics-lab'),
    ('Дизайн-система', 'Разработана единая дизайн-система для всех цифровых продуктов хаба', 'design-lab'),
    ('Выставка 3D-моделей', 'Организована виртуальная выставка 3D-моделей кампуса', 'design-lab'),
    ('CTF 2025', 'Команда кибербезопасности вышла в финал международных соревнований CTF', 'cyber-lab'),
    ('Secure Messenger', 'Выпущена бета-версия защищённого мессенджера с E2E шифрованием', 'cyber-lab'),
    ('Подкаст-сезон', 'Записан первый сезон университетского подкаста (10 выпусков)', 'media-lab'),
    ('Фотовыставка', 'Открыта цифровая фотовыставка работ студентов', 'media-lab'),
]
for title, desc, slug in lab_achievements:
    lab = Laboratory.objects.filter(slug=slug).first()
    ach = add_achievement(title, desc, lab=lab, file_link='https://drive.google.com/results.pdf', image=make_achievement_img(title))
    print(f'  + Achievement (lab): {title}')

# Project achievements
project_achievements = [
    ('MVP платформы', 'Разработан MVP веб-платформы хаба с базовым функционалом', 'Веб-платформа хаба'),
    ('Релиз мобильного приложения', 'Мобильное приложение опубликовано в тестовом режиме', 'Мобильное приложение для студентов'),
    ('Дашборд аналитики', 'Создан интерактивный дашборд для отслеживания метрик', 'Система аналитики данных'),
    ('Первый полёт дрона', 'Автономный дрон совершил первый успешный полёт', 'Автономный дрон'),
    ('Манипулятор собран', 'Промышленный манипулятор собран и протестирован', 'Робот-манипулятор'),
    ('Теплица автоматизирована', 'Система автоматизации теплицы введена в эксплуатацию', 'Умная теплица'),
    ('Брендбук утверждён', 'Новый брендбук университета утверждён руководством', 'Ребрендинг университета'),
    ('3D-тур готов', 'Виртуальный 3D-тур по кампусу доступен онлайн', '3D-модель кампуса'),
    ('IDS протестирована', 'Система обнаружения вторжений показала 98% точности', 'Система обнаружения вторжений'),
    ('Мессенджер защищён', 'Крипто-мессенджер прошёл аудит безопасности', 'Крипто-мессенджер'),
    ('Подкасты записаны', 'Записано 10 выпусков подкаста с гостями из индустрии', 'Университетский подкаст'),
    ('Галерея открыта', 'Цифровая галерея доступна для всех желающих', 'Цифровая фотовыставка'),
]
for title, desc, proj_title in project_achievements:
    proj = Project.objects.filter(title=proj_title).first()
    ach = add_achievement(title, desc, proj=proj, file_link='https://drive.google.com/report.pdf')
    print(f'  + Achievement (project): {title}')

# ─── 4. REPORTS ────────────────────────────────────────────────────

projects_reports = [
    ('Веб-платформа хаба',
     'Отчёт о первом этапе разработки: создан бэкенд на Django, настроена админ-панель, '
     'реализована базовая авторизация. Команда: 4 разработчика, 2 дизайнера. Срок: 2 месяца.'),
    ('Мобильное приложение для студентов',
     'Отчёт о разработке мобильного приложения: реализованы экраны расписания, событий и профиля. '
     'Использован Flutter. Проведено UI/UX тестирование на 20 пользователях.'),
    ('Автономный дрон',
     'Технический отчёт: собран прототип дрона на базе Raspberry Pi. '
     'Написано ПО для автономного полёта по заданным координатам. Тестовые полёты прошли успешно.'),
    ('Ребрендинг университета',
     'Отчёт о дизайн-исследовании: проведён анализ конкурентов, разработаны 3 концепции логотипа. '
     'Выбран финальный вариант. Утверждена цветовая палитра и типографика.'),
    ('Крипто-мессенджер',
     'Отчёт о безопасности: проведён аудит кода, исправлены 12 уязвимостей. '
     'Реализовано сквозное шифрование на основе протокола Signal.'),
]

for proj_title, text in projects_reports:
    proj = Project.objects.filter(title=proj_title).first()
    if not proj:
        bug_log.append(f'Project not found for report: {proj_title}')
        continue
    lab_ids = list(proj.laboratory_links.values_list('laboratory_id', flat=True))
    lab = Laboratory.objects.filter(id__in=lab_ids[:1]).first() if lab_ids else None

    report = Report.objects.create(
        project=proj,
        laboratory=lab,
        report_text=text[:500],
        confirmation=True,
    )
    # Create a File + FileReport link
    f = File.objects.create(link=f'https://drive.google.com/report_{proj.title[:10].lower().replace(" ","_")}.pdf')
    FileReport.objects.create(file=f, report=report)
    print(f'  + Report: {proj.title}')

# ─── 5. EVENT LOG ──────────────────────────────────────────────────

events = [
    ('admin', 'lab_created', 'Laboratory', 0, '{"title": "5 лабораторий создано"}'),
    ('admin', 'project_created', 'Project', 0, '{"title": "Все проекты инициализированы"}'),
    ('admin', 'participant_joined', 'StudentProjectRole', 0, '{"count": 41}'),
    ('admin', 'report_created', 'Report', 0, '{"title": "Созданы отчёты"}'),
    ('admin', 'report_confirmed', 'Report', 0, '{"confirmed": 5}'),
]
for user, action, etype, eid, details in events:
    EventLog.objects.create(
        user_login=user, action=action,
        entity_type=etype, entity_id=eid, details=details
    )
    print(f'  + EventLog: {action}')

# ─── 6. FILES FOR GUIDES ──────────────────────────────────────────

guide_file_links = [
    ('Соколов Андрей', 'https://drive.google.com/sokolov_portfolio.pdf'),
    ('Белова Елена', 'https://drive.google.com/belova_publications.pdf'),
    ('Кузнецов Дмитрий', 'https://drive.google.com/kuznetsov_patents.pdf'),
    ('Морозова Анна', 'https://drive.google.com/morozova_works.pdf'),
    ('Волков Иван', 'https://drive.google.com/volkov_cert.pdf'),
    ('Новикова Ольга', 'https://drive.google.com/novikova_media.pdf'),
]
for fname, link in guide_file_links:
    parts = fname.split(' ', 1)
    guide = Guide.objects.filter(surname=parts[0], name__startswith=parts[1][0]).first()
    if guide:
        file_obj = File.objects.create(link=link)
        FileGuide.objects.create(file=file_obj, guide=guide)
        print(f'  + FileGuide: {fname}')

# ─── 7. VERIFICATION ──────────────────────────────────────────────

print('\n=== VERIFICATION ===')
with connection.cursor() as c:
    for t in ['hub_lab_photos', 'hub_laboratory_images', 'hub_site_content', 'hub_site_stats',
              'achievements', 'report', 'file', 'file_achievements', 'file_report', 'file_project',
              'file_guide', 'event_log']:
        try:
            c.execute(f'SELECT COUNT(*) FROM {t}')
            cnt = c.fetchone()[0]
            print(f'  {t}: {cnt}')
        except Exception as e:
            bug_log.append(f'{t}: ERROR - {e}')
            print(f'  {t}: ERROR - {e}')

# API tests
import requests

# Labs API - check images
r = requests.get('http://localhost:8000/api/labs/')
data = r.json()
results = data.get('results', data) if isinstance(data, dict) else data
print(f'\nLabs API: {len(results)} labs')
for lab in results:
    img_count = len(lab.get('images', []))
    print(f'  {lab["slug"]}: {img_count} images | leaders: {len(lab["leaders_list"])}')

# SiteContent API
r = requests.get('http://localhost:8000/api/site-content/')
data = r.json()
results = data.get('results', data) if isinstance(data, dict) else data
if isinstance(results, list) and len(results) > 0:
    sc_data = results[0]
    print(f'\nSiteContent: {len(sc_data.get("stats", []))} stats')
    for s in sc_data.get('stats', []):
        print(f'  Stat: {s["label"]}')

# Achievements API
r = requests.get('http://localhost:8000/api/achievements/')
data = r.json()
results = data.get('results', data) if isinstance(data, dict) else data
print(f'\nAchievements API: {len(results)}')
for a in results[:5]:
    lab_title = a.get('laboratory_title') or '—'
    proj_title = a.get('project_title') or '—'
    print(f'  {a["title"]} | lab: {lab_title} | proj: {proj_title}')

# Lab-specific achievements
for lab in Laboratory.objects.all():
    r = requests.get(f'http://localhost:8000/api/achievements/?laboratory={lab.id}')
    data = r.json()
    results = data.get('results', data) if isinstance(data, dict) else data
    if results:
        print(f'  Achievements for {lab.title}: {len(results)}')

# Project-specific achievements  
for p in Project.objects.all()[:3]:
    r = requests.get(f'http://localhost:8000/api/achievements/?project={p.id}')
    data = r.json()
    results = data.get('results', data) if isinstance(data, dict) else data
    if results:
        print(f'  Achievements for project {p.title}: {len(results)}')

# Reports API
r = requests.get('http://localhost:8000/api/reports/')
data = r.json()
results = data.get('results', data) if isinstance(data, dict) else data
print(f'\nReports API: {len(results)}')
for rep in results[:3]:
    print(f'  {rep.get("project_title","—")}: confirmed={rep.get("confirmation")}')

# ─── BUGS ──────────────────────────────────────────────────────────

print('\n=== BUGS FOUND ===')
if bug_log:
    for b in bug_log:
        print(f'  🐛 {b}')
else:
    print('  ✅ No bugs found')

print('\n=== SEED MEDIA DONE ===')
