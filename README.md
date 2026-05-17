# Student Digital Hub - Backend

Django REST API backend для управления студенческими проектами, лабораториями и участниками Цифрового Хаба.

## Функционал

- **Ролевой доступ** — Администратор, Лидер лаборатории, Менеджер проекта, Студент
- **RESTful API** — Полный CRUD через Django REST Framework
- **Админ-панель** — Настроенная Django-admin с тёмно-фиолетовой темой и ролевой фильтрацией
- **Журнал событий** — Автоматическое отслеживание ключевых действий
- **Excel-экспорт** — Отчёты по проектам, лабам, участникам, достижениям
- **Файлы** — Загрузка концепций проектов и изображений достижений
- **Фильтрация** — Поиск, фильтры и пагинация на всех эндпоинтах
- **Email-пароли** — Генерация 8-симв. пароля при назначении Менеджер/Лидер лаборатории
- **Деактивация** — При снятии роли Менеджер/Лидер аккаунт становится неактивным

## Ограничения

- **Достижения**: описание до 350 символов, изображение 4:3, max 2МБ, 1 штука
- **Лаборатории**: несколько направлений (M2M), несколько фото (JSON), краткое и полное описание
- **Руководители хаба**: добавляются из пользователей сайта (User), без email-вкладки
- **Участники проектов**: сортировка по ID (1→203) и алфавиту, только редактирование, добавление через бот/форму

## Установка (Linux)

### Требования

- Python 3.8+
- pip
- MySQL 5.7+ (или SQLite для разработки)
- виртуальное окружение (рекомендуется)

### Шаг 1: Клонирование

```bash
git clone https://github.com/Fxshtro/webSiteForHub.git
cd webSiteForHub
git checkout Backend
```

### Шаг 2: Виртуальное окружение

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Шаг 3: Настройка окружения

Создайте `.env` в корне проекта:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_ENGINE=django.db.backends.mysql
DATABASE_NAME=appiub95_it_hub
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
DEFAULT_FROM_EMAIL=webmaster@localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

Для SQLite (разработка без MySQL):

```env
DATABASE_ENGINE=sqlite
```

### Шаг 4: Миграции

```bash
python manage.py makemigrations
python manage.py migrate
```

### Шаг 5: Инициализация

```bash
python manage.py init_hub
```

Создает роли сайта (Администратор, Лидер лаборатории, Менеджер проекта, Студент).

### Шаг 6: Суперпользователь

```bash
python manage.py createsuperuser
```

После создания зайдите в админ-панель и назначьте роль `Администратор`.

### Шаг 7: Сборка статики

```bash
python manage.py collectstatic --noinput
```

### Шаг 8: Запуск

```bash
python manage.py runserver
```

- Админ-панель: http://127.0.0.1:8000/admin/
- API: http://127.0.0.1:8000/api/

## Установка (Windows)

### Требования

- Python 3.8+ (https://python.org/downloads/)
- pip (входит в Python)
- MySQL 5.7+ (https://dev.mysql.com/downloads/) или SQLite
- Git (https://git-scm.com/downloads/)

### Шаг 1: Клонирование

```cmd
git clone https://github.com/Fxshtro/webSiteForHub.git
cd webSiteForHub
git checkout Backend
```

### Шаг 2: Виртуальное окружение

```cmd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Шаг 3: Настройка окружения

Создайте `.env` в корне проекта (см. пример выше).

### Шаг 4: Миграции

```cmd
python manage.py makemigrations
python manage.py migrate
```

### Шаг 5: Инициализация

```cmd
python manage.py init_hub
```

### Шаг 6: Суперпользователь

```cmd
python manage.py createsuperuser
```

### Шаг 7: Сборка статики

```cmd
python manage.py collectstatic --noinput
```

### Шаг 8: Запуск

```cmd
python manage.py runserver
```

## Структура проекта

```
hub_backend/
├── hub/                    # Основное приложение
│   ├── models.py           # Модели данных (MySQL + managed)
│   ├── admin.py            # Админ-панель с ролевым доступом
│   ├── serializers.py      # API сериализаторы
│   ├── viewsets.py         # API viewsets (DRF)
│   ├── permissions.py      # Кастомные разрешения
│   ├── urls.py             # API маршруты (router)
│   ├── signals.py          # Django сигналы (журнал)
│   ├── utils.py            # Утилиты (log_event)
│   ├── exceptions.py       # Обработчик исключений
│   ├── templates/          # Кастомные шаблоны админ-панели
│   │   └── admin/
│   │       └── base_site.html  # Подключение тёмно-фиолетовой темы
│   ├── static/             # Кастомная стилизация
│   │   └── admin/css/
│   │       └── dark_purple_theme.css  # Тёмно-фиолетовая тема
│   ├── management/
│   │   └── commands/
│   │       └── init_hub.py # Инициализация данных
│   └── migrations/         # Миграции БД
│       ├── 0001_initial.py
│       ├── 0002_*.py        # Переход к MySQL-моделям
│       ├── 0003_*.py        # HubLeader, goal, text_limited
│       ├── 0004_*.py        # ALTER TABLE (RunSQL)
│       └── 0005_*.py        # HubLeader: student→user
├── hub_backend/            # Настройки проекта
│   ├── settings.py         # Django settings
│   └── urls.py             # Root URL + media
├── media/                  # Загруженные файлы
│   ├── achievements/       # Изображения достижений
│   └── concepts/           # Файлы концепций проектов
├── logs/                   # Логи Django
├── staticfiles/            # Собранные статические файлы
├── manage.py               # Django management script
└── requirements.txt        # Python зависимости
```

## Роли пользователей

### Администратор
- Полный доступ ко всем данным и настройкам
- Управление лабораториями, проектами, участниками
- Журнал событий, системные настройки
- Экспорт отчётов

### Лидер лаборатории
- Редактирование только своей лаборатории
- Управление проектами внутри лаборатории
- Управление участниками проектов лаборатории
- Ограниченный доступ к остальным данным

### Менеджер проекта
- Редактирование проектов где назначен менеджером
- Отправка отчётов по своим проектам
- Просмотр участников управляемых проектов
- Read-only к остальным данным

### Студент
- Read-only доступ к доступным данным
- Нет доступа к админ-панели
- Просмотр проектов, лаб, достижений через API

## API-эндпоинты

### Базовый URL
```
http://127.0.0.1:8000/api/
```

### Аутентификация

- **Session Authentication** — для веб-интерфейса
- **Basic Authentication** — для API-клиентов

### Основные эндпоинты

| Endpoint | Методы | Описание |
|---|---|---|
| `/api/directions/` | CRUD | Направления деятельности |
| `/api/roles/` | CRUD | Роли в проектах |
| `/api/site-roles/` | CRUD | Роли доступа (админ только) |
| `/api/labs/` | CRUD | Лаборатории |
| `/api/labs/{id}/projects/` | GET | Проекты лаборатории |
| `/api/projects/` | CRUD | Проекты |
| `/api/projects/{id}/participants/` | GET | Участники проекта |
| `/api/projects/{id}/active_participants/` | GET | Активные участники |
| `/api/participants/` | CRUD | Участники проектов |
| `/api/participants/{id}/leave/` | POST | Покинуть проект |
| `/api/achievements/` | CRUD | Достижения |
| `/api/reports/` | CRUD | Отчёты |
| `/api/students/` | CRUD | Студенты |
| `/api/guides/` | READ | Руководители лабораторий |
| `/api/users/` | CRUD | Пользователи админки |
| `/api/users/me/` | GET | Текущий пользователь |
| `/api/hub-leaders/` | CRUD | Руководители хаба |
| `/api/events/` | READ | Журнал событий |

### Query-параметры

Все list-эндпоинты поддерживают:

- **Фильтрация**: `?field=value`
- **Поиск**: `?search=query`
- **Сортировка**: `?ordering=field` / `?ordering=-field`
- **Пагинация**: `?page=1` (20 на страницу)

### Примеры

```bash
# Все активные лаборатории
curl -u login:password http://127.0.0.1:8000/api/labs/?active=true

# Поиск проектов
curl -u login:password http://127.0.0.1:8000/api/projects/?search=web

# Текущий пользователь
curl -u login:password http://127.0.0.1:8000/api/users/me/

# Покинуть проект
curl -X POST -u login:password http://127.0.0.1:8000/api/participants/1/leave/
```

## Админ-панель — Тёмно-фиолетовая тема

Админ-панель использует кастомную тёмно-фиолетовую тему:
- Фон: `#1a0a2e`
- Акцент: `#7b2fbe`
- Текст: `#d4c0e8`
- Хедер/сайдбар: `#120620`

Файлы темы:
- `hub/static/admin/css/dark_purple_theme.css` — полная стилизация всех элементов
- `hub/templates/admin/base_site.html` — подключение CSS к админке

## Настройка БД

### MySQL (по умолчанию)

```env
DATABASE_ENGINE=django.db.backends.mysql
DATABASE_NAME=appiub95_it_hub
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

### PostgreSQL

```env
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=hub_db
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### SQLite (для разработки)

```env
DATABASE_ENGINE=sqlite
```

## CORS

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

## Media-файлы

- `media/achievements/` — Изображения достижений (4:3, max 2МБ)
- `media/concepts/` — Файлы концепций проектов

## Зависимости

| Пакет | Версия | Назначение |
|---|---|---|
| Django | >= 4.2.0 | Web framework |
| djangorestframework | >= 3.14.0 | REST API |
| django-filter | >= 23.0 | Фильтрация |
| django-cors-headers | >= 4.3.0 | CORS |
| openpyxl | >= 3.1.0 | Excel export |
| Pillow | >= 10.0.0 | Обработка изображений |
| python-decouple | >= 3.8 | env vars |
| mysqlclient | >= 2.2.0 | MySQL driver |

## На будущее

- **Статистика**: кто где был, какие команды, история участия
- **Telegram-бот**: автоматический сбор данных
- **Миграции на PostgreSQL**: для production