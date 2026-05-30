# IUBiP Hub — Backend

[![Django 6](https://img.shields.io/badge/Django-6.0-092E20.svg)](https://www.djangoproject.com/) [![DRF 3.17](https://img.shields.io/badge/DRF-3.17-red.svg)](https://www.django-rest-framework.org/) [![Python 3.14](https://img.shields.io/badge/python-3.14-blue.svg)](https://www.python.org/) [![MariaDB](https://img.shields.io/badge/MariaDB-11-brown.svg)](https://mariadb.org/)

**Django REST API** for managing student projects, laboratories and participants of the Digital Hub of Southern University (IUBiP).

Legacy database models (`managed = False`), DRF viewsets, custom admin panel with Excel export and event logging.

---

## ✨ Features

- **Legacy models** — all tables are `managed = False`, schema changes via `ALTER TABLE`
- **Admin panel** — /admin/ with custom inlines, filters, Excel export
- **API** — /api/ through DRF router with filtering, search, pagination
- **Event log** — automatic logging of actions on models
- **Media** — images stored in `media/`, served via Next.js proxy
- **ImageField** — `SerializerMethodField` returning relative `obj.image.url` (no `build_absolute_uri`)

---

## 🏗️ Architecture

```
┌─────────────┐     /api (rewrite)      ┌─────────────┐
│   Next.js   │ ──────────────────────► │   Django    │
│  :3000      │                         │  :8000      │
└─────────────┘                         └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   MariaDB   │
                                        │  podman:3306│
                                        └─────────────┘
```

## 📦 Models

| Model | Description |
|---|---|
| Laboratory | Labs with slug, description, status |
| Project | Projects with title, goal, description |
| Student | Students with contacts, group, experience |
| HubLeader / Guide | Hub and lab leaders |
| Achievement | Achievements linked to lab/project |
| Role / LabRole | Global and lab-specific roles |
| ProjectRole / StudentProjectRole | Project positions and assignments |
| EventLog | Action audit log |
| File + M2M tables | File attachments for entities |

Full list: `hub/models.py`

---

## 🚀 Run

### Prerequisites

- Python **3.14**, MariaDB **11** (podman container `hub-mysql:3306`)
- Virtual environment in `venv/`

### Start

```bash
cd Backend
source venv/bin/activate
nohup venv/bin/python manage.py runserver 0.0.0.0:8000 --noreload > /tmp/django.log 2>&1 &
```

> `--noreload` is required — reloader crashes on Python 3.14.

### Restart

```bash
kill $(pgrep -f runserver)
# then start again
```

---

## ⚙️ Configuration (`.env` from `.env.example`)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Debug mode |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `DATABASE_*` | MySQL/MariaDB connection settings |
| `CORS_ALLOWED_ORIGINS` | Origins for CORS |

---

## 🛠️ Troubleshooting

| Problem | What to try |
|---|---|
| **Django won't start** | Check `/tmp/django.log` for errors |
| **`Type` admin still shows** | Clear `__pycache__` and restart with `--noreload` |
| **Media files 404** | Check Next.js rewrites in `next.config.ts` |
| **Database connection** | Verify podman container: `podman ps` |

---

## 📄 License

Private project — Southern University (IUBiP) © 2026

---

# IUBiP Hub — Бэкенд

[![Django 6](https://img.shields.io/badge/Django-6.0-092E20.svg)](https://www.djangoproject.com/) [![DRF 3.17](https://img.shields.io/badge/DRF-3.17-red.svg)](https://www.django-rest-framework.org/) [![Python 3.14](https://img.shields.io/badge/python-3.14-blue.svg)](https://www.python.org/) [![MariaDB](https://img.shields.io/badge/MariaDB-11-brown.svg)](https://mariadb.org/)

**Django REST API** для управления студенческими проектами, лабораториями и участниками Цифрового Хаба Южного Университета (ИУБиП).

Модели legacy-таблиц (`managed = False`), DRF вьюсеты, кастомная админка с Excel-экспортом и журналом событий.

---

## ✨ Возможности

- **Legacy модели** — все таблицы `managed = False`, изменения схемы через `ALTER TABLE`
- **Админка** — /admin/ с кастомными inlines, фильтрами, Excel-экспортом
- **API** — /api/ через DRF роутер с фильтрацией, поиском, пагинацией
- **Журнал событий** — автоматическое логирование действий над моделями
- **Медиа** — изображения в `media/`, отдаются через Next.js proxy
- **ImageField** — `SerializerMethodField` возвращает относительный `obj.image.url` (без `build_absolute_uri`)

---

## 🏗️ Архитектура

```
┌─────────────┐     /api (rewrite)      ┌─────────────┐
│   Next.js   │ ──────────────────────► │   Django    │
│  :3000      │                         │  :8000      │
└─────────────┘                         └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   MariaDB   │
                                        │  podman:3306│
                                        └─────────────┘
```

## 📦 Модели

| Модель | Описание |
|---|---|
| Laboratory | Лаборатории (slug, описание, статус) |
| Project | Проекты (название, цель, описание) |
| Student | Студенты (контакты, группа, опыт) |
| HubLeader / Guide | Руководители хаба и лабораторий |
| Achievement | Достижения (привязка к лаб./проекту) |
| Role / LabRole | Глобальные роли и роли лабораторий |
| ProjectRole / StudentProjectRole | Позиции и участники проектов |
| EventLog | Журнал действий |
| File + M2M таблицы | Файловые вложения |

Полный список: `hub/models.py`

---

## 🚀 Запуск

### Требования

- Python **3.14**, MariaDB **11** (podman контейнер `hub-mysql:3306`)
- Виртуальное окружение в `venv/`

### Старт

```bash
cd Backend
source venv/bin/activate
nohup venv/bin/python manage.py runserver 0.0.0.0:8000 --noreload > /tmp/django.log 2>&1 &
```

> `--noreload` обязателен — reloader падает на Python 3.14.

### Перезапуск

```bash
kill $(pgrep -f runserver)
# затем запустить заново
```

---

## ⚙️ Настройка (`.env` из `.env.example`)

| Переменная | Назначение |
|---|---|
| `SECRET_KEY` | Секретный ключ Django |
| `DEBUG` | Режим отладки |
| `ALLOWED_HOSTS` | Разрешённые хосты через запятую |
| `DATABASE_*` | Настройки подключения к MySQL/MariaDB |
| `CORS_ALLOWED_ORIGINS` | Origins для CORS |

---

## 🛠️ Устранение неполадок

| Проблема | Что делать |
|---|---|
| **Django не стартует** | Проверить `/tmp/django.log` |
| **Раздел `Type` в админке виден** | Очистить `__pycache__` и перезапустить с `--noreload` |
| **Медиа-файлы 404** | Проверить rewrites в `next.config.ts` |
| **Нет подключения к БД** | Проверить podman: `podman ps` |

---

## 📄 Лицензия

Приватный проект — Южный Университет (ИУБиП) © 2026
