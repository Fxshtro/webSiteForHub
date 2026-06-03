#!/usr/bin/env python3
"""
Seed script: заполняет БД тестовыми данными для всех 5 лабораторий.
Запускать внутри контейнера: python seed_data.py
"""
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'hub_backend.settings'

import django
django.setup()

from django.db import connection
from hub.models import (
    Laboratory, Direction, Guide, LaboratoryGuide,
    Role, Project, ProjectLaboratory, ProjectRole, StudentProjectRole,
    Student, HubLeader,
    Achievement, StudentLaboratory, StudentDirection, LaboratoryDirection,
    RoleManagerFlag,
)

print('=== SEED START ===\n')

# ─── HELPERS ────────────────────────────────────────────────────────

def safe_get(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except model.DoesNotExist:
        return None

def safe_create(model, defaults=None, **kwargs):
    obj = safe_get(model, **kwargs)
    if obj:
        return obj
    return model.objects.create(**kwargs) if defaults is None else model.objects.create(defaults=defaults, **kwargs)

bug_log = []

# ─── 1. LABORATORIES ────────────────────────────────────────────────

labs_data = [
    {'title': 'ИТ-Лаборатория',         'slug': 'it-lab',       'short_description': 'Разработка веб- и мобильных приложений, искусственный интеллект', 'active': True},
    {'title': 'Лаборатория робототехники','slug': 'robotics-lab','short_description': 'Промышленная и сервисная робототехника, автономные системы',        'active': True},
    {'title': 'Лаборатория дизайна',     'slug': 'design-lab',   'short_description': 'UX/UI дизайн, 3D-моделирование, моушн-дизайн',                   'active': True},
    {'title': 'Лаборатория кибербезопасности','slug': 'cyber-lab','short_description': 'Сетевая безопасность, криптография, пентест',                       'active': True},
    {'title': 'Лаборатория цифровых медиа','slug': 'media-lab',  'short_description': 'Цифровое телевидение, подкасты, мультимедийный контент',            'active': False},
]

labs = {}
for ld in labs_data:
    lab = safe_get(Laboratory, slug=ld['slug'])
    if not lab:
        lab = Laboratory.objects.create(**ld)
        print(f'  + Lab: {lab.title}')
    else:
        for k, v in ld.items():
            setattr(lab, k, v)
        lab.save()
        print(f'  ~ Lab: {lab.title} (updated)')
    labs[ld['slug']] = lab

# ─── 2. DIRECTIONS ──────────────────────────────────────────────────

directions_data = [
    'Web-разработка', 'Мобильная разработка', 'Искусственный интеллект',
    'Промышленная робототехника', 'Сервисная робототехника',
    'UX/UI Дизайн', '3D-моделирование', 'Моушн-дизайн',
    'Сетевая безопасность', 'Криптография', 'Пентест',
    'Цифровые медиа', 'Data Science',
]

directions = {}
for title in directions_data:
    d = safe_get(Direction, title=title)
    if not d:
        d = Direction.objects.create(title=title)
        print(f'  + Direction: {d.title}')
    else:
        print(f'  ~ Direction: {d.title}')
    directions[title] = d

# Link directions to labs
lab_direction_map = {
    'it-lab':      ['Web-разработка', 'Мобильная разработка', 'Искусственный интеллект', 'Data Science'],
    'robotics-lab':['Промышленная робототехника', 'Сервисная робототехника', 'Искусственный интеллект'],
    'design-lab':  ['UX/UI Дизайн', '3D-моделирование', 'Моушн-дизайн'],
    'cyber-lab':   ['Сетевая безопасность', 'Криптография', 'Пентест'],
    'media-lab':   ['Цифровые медиа', 'UX/UI Дизайн'],
}

for slug, dir_titles in lab_direction_map.items():
    lab = labs[slug]
    for dt in dir_titles:
        d = directions[dt]
        _, created = LaboratoryDirection.objects.get_or_create(laboratory=lab, direction=d)
        if created:
            print(f'  + LabDir: {lab.title} <- {dt}')

# ─── 3. GUIDES (Leaders) ────────────────────────────────────────────

guides_data = [
    {'surname': 'Соколов', 'name': 'Андрей', 'patronymic': 'Викторович', 'position': 'Старший преподаватель',        'description': 'Эксперт в веб-технологиях'},
    {'surname': 'Белова',  'name': 'Елена',  'patronymic': 'Сергеевна',   'position': 'Доцент кафедры ИТ',           'description': 'Специалист по AI'},
    {'surname': 'Кузнецов','name': 'Дмитрий','patronymic': 'Алексеевич',  'position': 'Заведующий лабораторией',     'description': 'Специалист по робототехнике'},
    {'surname': 'Морозова','name': 'Анна',   'patronymic': 'Игоревна',    'position': 'Старший дизайнер',            'description': 'UX/UI эксперт'},
    {'surname': 'Волков',  'name': 'Иван',   'patronymic': 'Петрович',    'position': 'Профессор кафедры безопасности','description': 'Криптограф'},
    {'surname': 'Новикова','name': 'Ольга',  'patronymic': 'Дмитриевна',  'position': 'Руководитель медиа-направления','description': 'Медиа-продюсер'},
]

guides = []
for gd in guides_data:
    g = safe_get(Guide, surname=gd['surname'], name=gd['name'])
    if not g:
        g = Guide.objects.create(**gd)
        print(f'  + Guide: {g.surname} {g.name}')
    else:
        print(f'  ~ Guide: {g.surname} {g.name}')
    guides.append(g)

# Link guides to labs
guide_lab_map = [
    (0, 'it-lab'), (1, 'it-lab'),
    (2, 'robotics-lab'),
    (3, 'design-lab'),
    (4, 'cyber-lab'),
    (5, 'media-lab'),
]
for gi, slug in guide_lab_map:
    g = guides[gi]
    lab = labs[slug]
    _, created = LaboratoryGuide.objects.get_or_create(laboratory=lab, guide=g)
    if created:
        print(f'  + LabGuide: {lab.title} <- {g.surname} {g.name}')

# ─── 4. ROLES ───────────────────────────────────────────────────────

roles_data = [
    'Разработчик', 'Дизайнер', 'Проектный менеджер', 'Тестировщик',
    'Аналитик', 'Data Scientist', 'DevOps', 'Team Lead',
    'Технический писатель', 'Наставник', 'Scrum Master', 'Исследователь',
]

roles = {}
for title in roles_data:
    r = safe_get(Role, title=title)
    if not r:
        r = Role.objects.create(title=title)
        print(f'  + Role: {r.title}')
    else:
        print(f'  ~ Role: {r.title}')
    roles[title] = r

# Set manager flags for specific roles
for mgr_title in ['Проектный менеджер', 'Scrum Master', 'Наставник', 'Team Lead']:
    r = roles[mgr_title]
    flag, created = RoleManagerFlag.objects.get_or_create(role=r, defaults={'is_manager': True})
    if not flag.is_manager:
        flag.is_manager = True
        flag.save()
    print(f'  {"+" if created else "~"} ManagerFlag: {mgr_title}')

# ─── 5. STUDENTS ────────────────────────────────────────────────────

students_data = [
    # Lab 1: IT-lab (8 students)
    {'surname':'Алексеев','name':'Алексей','patronymic':'Алексеевич',    'study_group':'ИС-201','phone_number':'+79001001001','email':'alekseev@test.ru'},
    {'surname':'Петров',  'name':'Пётр','patronymic':'Петрович',         'study_group':'ИС-201','phone_number':'+79001001002','email':'petrov@test.ru'},
    {'surname':'Сидорова','name':'Мария','patronymic':'Ивановна',        'study_group':'ИС-202','phone_number':'+79001001003','email':'sidorova@test.ru'},
    {'surname':'Козлов',  'name':'Денис','patronymic':'Сергеевич',       'study_group':'ИС-202','phone_number':'+79001001004','email':'kozlov@test.ru'},
    {'surname':'Мороз',   'name':'Анна','patronymic':'Викторовна',       'study_group':'ИС-203','phone_number':'+79001001005','email':'moroz@test.ru'},
    {'surname':'Зайцев',  'name':'Игорь','patronymic':'Дмитриевич',      'study_group':'ИС-203','phone_number':'+79001001006','email':'zaytsev@test.ru'},
    {'surname':'Павлова', 'name':'Екатерина','patronymic':'Алексеевна',  'study_group':'ИС-201','phone_number':'+79001001007','email':'pavlova@test.ru'},
    {'surname':'Титов',   'name':'Максим','patronymic':'Олегович',       'study_group':'ИС-204','phone_number':'+79001001008','email':'titov@test.ru'},

    # Lab 2: Robotics (7 students)
    {'surname':'Григорьев','name':'Кирилл','patronymic':'Павлович',     'study_group':'РО-101','phone_number':'+79002002001','email':'grig@test.ru'},
    {'surname':'Фёдорова','name':'Наталья','patronymic':'Сергеевна',    'study_group':'РО-101','phone_number':'+79002002002','email':'fedorova@test.ru'},
    {'surname':'Артёмов', 'name':'Артём','patronymic':'Андреевич',       'study_group':'РО-102','phone_number':'+79002002003','email':'artemov@test.ru'},
    {'surname':'Васильев','name':'Павел','patronymic':'Николаевич',      'study_group':'РО-102','phone_number':'+79002002004','email':'vasiliev@test.ru'},
    {'surname':'Борисова','name':'Татьяна','patronymic':'Викторовна',    'study_group':'РО-103','phone_number':'+79002002005','email':'borisova@test.ru'},
    {'surname':'Романов', 'name':'Глеб','patronymic':'Максимович',       'study_group':'РО-103','phone_number':'+79002002006','email':'romanov@test.ru'},
    {'surname':'Дмитриев','name':'Сергей','patronymic':'Алексеевич',     'study_group':'РО-101','phone_number':'+79002002007','email':'dmitriev@test.ru'},

    # Lab 3: Design (6 students)
    {'surname':'Кравцова','name':'Виктория','patronymic':'Андреевна',    'study_group':'ДЗ-201','phone_number':'+79003003001','email':'kravcova@test.ru'},
    {'surname':'Лебедев', 'name':'Арсений','patronymic':'Владимирович',  'study_group':'ДЗ-201','phone_number':'+79003003002','email':'lebedev@test.ru'},
    {'surname':'Соловьёва','name':'Дарья','patronymic':'Игоревна',       'study_group':'ДЗ-202','phone_number':'+79003003003','email':'solovyeva@test.ru'},
    {'surname':'Громов',  'name':'Никита','patronymic':'Олегович',       'study_group':'ДЗ-202','phone_number':'+79003003004','email':'gromov@test.ru'},
    {'surname':'Кириллова','name':'Алина','patronymic':'Максимовна',     'study_group':'ДЗ-203','phone_number':'+79003003005','email':'kirillova@test.ru'},

    # Lab 4: Cyber (5 students)
    {'surname':'Орлов',   'name':'Владимир','patronymic':'Сергеевич',    'study_group':'КБ-301','phone_number':'+79004004001','email':'orlov@test.ru'},
    {'surname':'Гусева',  'name':'Надежда','patronymic':'Петровна',      'study_group':'КБ-301','phone_number':'+79004004002','email':'guseva@test.ru'},
    {'surname':'Медведев','name':'Константин','patronymic':'Иванович',   'study_group':'КБ-302','phone_number':'+79004004003','email':'medvedev@test.ru'},
    {'surname':'Щукина',  'name':'Елизавета','patronymic':'Денисовна',   'study_group':'КБ-302','phone_number':'+79004004004','email':'schukina@test.ru'},

    # Lab 5: Media (4 students)
    {'surname':'Яковлев', 'name':'Георгий','patronymic':'Витальевич',    'study_group':'МД-401','phone_number':'+79005005001','email':'yakovlev@test.ru'},
    {'surname':'Тимофеева','name':'София','patronymic':'Алексеевна',     'study_group':'МД-401','phone_number':'+79005005002','email':'timofeeva@test.ru'},
    {'surname':'Захаров',  'name':'Матвей','patronymic':'Романович',     'study_group':'МД-402','phone_number':'+79005005003','email':'zakharov@test.ru'},
]

students = {}
for sd in students_data:
    s = safe_get(Student, surname=sd['surname'], name=sd['name'])
    if not s:
        s = Student.objects.create(**sd)
        print(f'  + Student: {s.surname} {s.name}')
    else:
        print(f'  ~ Student: {s.surname} {s.name}')
    key = f'{sd["surname"]} {sd["name"]}'
    students[key] = s

# Link students to labs
student_lab_map = [
    # IT-lab (8)
    ('Алексеев Алексей', 'it-lab'), ('Петров Пётр', 'it-lab'), ('Сидорова Мария', 'it-lab'),
    ('Козлов Денис', 'it-lab'), ('Мороз Анна', 'it-lab'), ('Зайцев Игорь', 'it-lab'),
    ('Павлова Екатерина', 'it-lab'), ('Титов Максим', 'it-lab'),
    # Robotics (7)
    ('Григорьев Кирилл', 'robotics-lab'), ('Фёдорова Наталья', 'robotics-lab'),
    ('Артёмов Артём', 'robotics-lab'), ('Васильев Павел', 'robotics-lab'),
    ('Борисова Татьяна', 'robotics-lab'), ('Романов Глеб', 'robotics-lab'),
    ('Дмитриев Сергей', 'robotics-lab'),
    # Design (5)
    ('Кравцова Виктория', 'design-lab'), ('Лебедев Арсений', 'design-lab'),
    ('Соловьёва Дарья', 'design-lab'), ('Громов Никита', 'design-lab'),
    ('Кириллова Алина', 'design-lab'),
    # Cyber (4)
    ('Орлов Владимир', 'cyber-lab'), ('Гусева Надежда', 'cyber-lab'),
    ('Медведев Константин', 'cyber-lab'), ('Щукина Елизавета', 'cyber-lab'),
    # Media (4)
    ('Яковлев Георгий', 'media-lab'), ('Тимофеева София', 'media-lab'),
    ('Захаров Матвей', 'media-lab'),
]

for sname, slug in student_lab_map:
    s = students.get(sname)
    if not s:
        bug_log.append(f'STUDENT NOT FOUND: {sname}')
        continue
    lab = labs[slug]
    _, created = StudentLaboratory.objects.get_or_create(student=s, laboratory=lab)
    if created:
        print(f'  + StudLab: {s.surname} -> {lab.title}')

# Direction for students
for sname, slug in student_lab_map:
    s = students.get(sname)
    if not s:
        continue
    lab = labs[slug]
    lab_dirs = LaboratoryDirection.objects.filter(laboratory=lab).select_related('direction')
    if lab_dirs.exists():
        d = lab_dirs.first().direction
        _, created = StudentDirection.objects.get_or_create(student=s, direction=d)
        if created:
            print(f'  + StudDir: {s.surname} -> {d.title}')

# ─── 6. PROJECTS ───────────────────────────────────────────────────

projects_data = {
    'it-lab': [
        {'title': 'Веб-платформа хаба', 'description': 'Основной портал университетского IT-хаба', 'goal': 'Разработка платформы'},
        {'title': 'Мобильное приложение для студентов', 'description': 'Приложение для расписания и событий', 'goal': 'Flutter / React Native'},
        {'title': 'Система аналитики данных', 'description': 'Анализ успеваемости студентов', 'goal': 'Python + ML'},
    ],
    'robotics-lab': [
        {'title': 'Автономный дрон', 'description': 'Дрон для мониторинга территории', 'goal': 'Разработка системы управления'},
        {'title': 'Робот-манипулятор', 'description': 'Промышленный манипулятор', 'goal': 'Управление + CV'},
        {'title': 'Умная теплица', 'description': 'Автоматизированная теплица с IoT', 'goal': 'Arduino + MQTT'},
    ],
    'design-lab': [
        {'title': 'Ребрендинг университета', 'description': 'Новый визуальный стиль', 'goal': 'UX/UI + айдентика'},
        {'title': '3D-модель кампуса', 'description': 'Виртуальный тур по университету', 'goal': 'Blender + WebGL'},
    ],
    'cyber-lab': [
        {'title': 'Система обнаружения вторжений', 'description': 'IDS для учебной сети', 'goal': 'Snort + ML'},
        {'title': 'Крипто-мессенджер', 'description': 'Защищённый мессенджер', 'goal': 'E2E шифрование'},
    ],
    'media-lab': [
        {'title': 'Университетский подкаст', 'description': 'Серия подкастов о науке', 'goal': 'Запись + монтаж'},
        {'title': 'Цифровая фотовыставка', 'description': 'Виртуальная галерея работ студентов', 'goal': 'Веб-галерея'},
    ],
}

project_objs = {}
for slug, projs in projects_data.items():
    lab = labs[slug]
    for pd in projs:
        p = safe_get(Project, title=pd['title'])
        if not p:
            p = Project.objects.create(**pd)
            print(f'  + Project: {p.title}')
        else:
            for k, v in pd.items():
                setattr(p, k, v)
            p.save()
            print(f'  ~ Project: {p.title}')

        project_objs[pd['title']] = p

        # Link project to lab
        _, created = ProjectLaboratory.objects.get_or_create(project=p, laboratory=lab)
        if created:
            print(f'  + ProjLab: {p.title} -> {lab.title}')

        # Add roles to project (2-5 roles each)
        import random
        role_titles = list(roles.keys())
        n_roles = random.randint(2, 5)
        selected_roles = random.sample(role_titles, min(n_roles, len(role_titles)))
        for rt in selected_roles:
            r = roles[rt]
            pr, created = ProjectRole.objects.get_or_create(project=p, role=r)
            if created:
                print(f'  + ProjRole: {p.title} <- {r.title}')

# ─── 7. ASSIGN STUDENTS TO PROJECTS ────────────────────────────────

# Each project gets 2-5 students from its lab
for slug, projs in projects_data.items():
    lab = labs[slug]
    lab_students = list(StudentLaboratory.objects.filter(laboratory=lab).select_related('student'))
    if not lab_students:
        continue

    import random
    for pd in projs:
        p = project_objs[pd['title']]
        project_roles = list(ProjectRole.objects.filter(project=p).select_related('role'))

        # Pick 2-5 students
        n_students = random.randint(2, min(5, len(lab_students)))
        selected = random.sample(lab_students, n_students)

        for sl in selected:
            if not project_roles:
                continue
            pr = random.choice(project_roles)
            _, created = StudentProjectRole.objects.get_or_create(
                student=sl.student,
                project_role=pr,
                defaults={'present': True}
            )
            if created:
                print(f'  + SPR: {sl.student.surname} -> {p.title} [{pr.role.title}]')

# ─── 8. HUBLEADERS ─────────────────────────────────────────────────

hubleaders_data = [
    {'full_name': 'Марков Илья Сергеевич',  'position': 'Наставник',  'degree': 'Канд. тех. наук', 'phone': '+79006006001', 'email': 'il.markov@univ.ru'},
    {'full_name': 'Дмитриева Ольга Павловна','position': 'Наставник','degree': 'Канд. физ.-мат. наук', 'phone': '+79006006002', 'email': 'o.dmitrieva@univ.ru'},
    {'full_name': 'Александров Пётр Игоревич','position': 'Наставник','degree': 'Доктор тех. наук', 'phone': '+79006006003', 'email': 'p.alexandrov@univ.ru'},
]

for hd in hubleaders_data:
    hl = safe_get(HubLeader, full_name=hd['full_name'])
    if not hl:
        HubLeader.objects.create(**hd)
        print(f'  + HubLeader: {hd["full_name"]}')
    else:
        print(f'  ~ HubLeader: {hd["full_name"]}')

# ─── 9. ACHIEVEMENTS ───────────────────────────────────────────────

import datetime
achievements_data = [
    {'title': 'Победа на хакатоне', 'description': 'Команда IT-лаборатории заняла 1 место на всероссийском хакатоне', 'laboratory': labs['it-lab']},
    {'title': 'Патент на робота', 'description': 'Разработан и запатентован новый тип манипулятора', 'laboratory': labs['robotics-lab']},
    {'title': 'Лучший дизайн-проект', 'description': 'Проект ребрендинга признан лучшим на конференции', 'laboratory': labs['design-lab']},
    {'title': 'CTF 2025', 'description': 'Команда Cyber-lab вышла в финал соревнований', 'laboratory': labs['cyber-lab']},
]

for ad in achievements_data:
    a = safe_get(Achievement, title=ad['title'])
    if not a:
        Achievement.objects.create(**ad)
        print(f'  + Achievement: {ad["title"]}')
    else:
        print(f'  ~ Achievement: {ad["title"]}')

# ─── VERIFICATION ──────────────────────────────────────────────────

print('\n=== VERIFICATION ===')
with connection.cursor() as c:
    for t in ['laboratories', 'projects', 'students', 'roles', 'guide', 'hub_leaders',
              'hub_laboratory_guides', 'project_laboratory', 'project_roles',
              'student_project_roles', 'students_laboratory', 'student_direction',
              'laboratory_direction', 'hub_role_manager_flags']:
        try:
            c.execute(f'SELECT COUNT(*) FROM {t}')
            cnt = c.fetchone()[0]
            print(f'  {t}: {cnt}')
        except Exception as e:
            msg = f'{t}: ERROR - {e}'
            bug_log.append(msg)
            print(f'  {msg}')

# Test serializer
from hub.serializers import LaboratorySerializer
for lab in Laboratory.objects.filter(active=True):
    s = LaboratorySerializer(lab)
    data = s.data
    mgrs = [l for l in data['leaders_list'] if 'manager-' in str(l.get('id', ''))]
    guides = [l for l in data['leaders_list'] if 'manager-' not in str(l.get('id', ''))]
    print(f'  API lab "{lab.title}": {len(data["leaders_list"])} leaders ({len(guides)} guides, {len(mgrs)} managers)')

# Test projects endpoint
from hub.serializers import ProjectSerializer
for lab in Laboratory.objects.filter(active=True):
    projects_qs = Project.objects.filter(laboratory_links__laboratory=lab)
    for p in projects_qs:
        s = ProjectSerializer(p)
        part = s.data.get('participants', [])
        roles = s.data.get('roles', [])
        print(f'  API project "{p.title}": {len(part)} participants, {len(roles)} roles')

# Test members endpoint
from hub.serializers import StudentSerializer
for lab in Laboratory.objects.filter(active=True):
    students_qs = Student.objects.filter(laboratory_links__laboratory=lab)
    for s in students_qs[:3]:  # first 3
        ser = StudentSerializer(s)
        projs = ser.data.get('projects', [])
        print(f'  API student "{s.surname} {s.name}": {len(projs)} projects')

# ─── BUG REPORT ────────────────────────────────────────────────────

print('\n=== BUGS FOUND ===')
if bug_log:
    for b in bug_log:
        print(f'  🐛 {b}')
else:
    print('  ✅ No bugs found')

print('\n=== SEED DONE ===')
