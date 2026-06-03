# 🏛️ IUBiP Hub — Student Digital Hub

[![Django 6](https://img.shields.io/badge/Django-6.0-092E20.svg)](https://www.djangoproject.com/) [![DRF 3.17](https://img.shields.io/badge/DRF-3.17-red.svg)](https://www.django-rest-framework.org/) [![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/) [![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/) [![Python 3.14](https://img.shields.io/badge/python-3.14-blue.svg)](https://www.python.org/) [![MariaDB](https://img.shields.io/badge/MariaDB-11-brown.svg)](https://mariadb.org/)

**Platform for student laboratories** of Southern University (IUBiP), Rostov-on-Don. Each laboratory has projects, participants, achievements and supervisors.

Monorepo: **Django + DRF** backend and **Next.js (App Router)** frontend. Database — **MariaDB** in podman container.

---

## ✨ Features

- **Laboratories** — slug-based pages with projects, members, achievements
- **Projects** — with roles, participants, links, reports
- **Achievements** — attached to labs or projects with images
- **Leaders & Guides** — hub leaders and laboratory supervisors
- **Admin panel** — Django admin with custom inlines, Excel export, event log
- **Event log** — automatic audit of all model changes
- **Media** — images stored on backend, proxied through frontend

---

## 🏗️ Architecture

```
┌─────────────┐     /api (rewrite)      ┌─────────────┐
│   Next.js   │ ──────────────────────► │   Django    │
│  podman:3000│     /media (rewrite)    │  :8000      │
└─────────────┘                         └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   MariaDB   │
                                        │  podman:3306│
                                        └─────────────┘
```

```
webSite/
├── Backend/          # Django + DRF
│   ├── hub/          # App: models, views, admin, serializers
│   ├── hub_backend/  # Django project settings
│   ├── media/        # User uploaded images
│   └── requirements.txt
├── frontend/         # Next.js 16 App Router
│   ├── app/          # Pages and components
│   ├── public/       # Static assets
│   └── Dockerfile
└── README.md         # You are here
```

---

## 🚀 Quick Start

### Prerequisites

- Python **3.14**, Node.js **20+**
- Podman / Docker
- MariaDB **11** container

### 1. All services (compose)

```bash
podman compose up -d
```

### 2. Or start individually

```bash
# Database
podman run -d --name hub-mysql -e MARIADB_ROOT_PASSWORD=root -p 3306:3306 mariadb:11

# Backend
cd Backend && podman build --no-cache --network host -t hub-backend .
podman run -d --name hub-backend --network host hub-backend

# Frontend
cd frontend && podman build --no-cache --network host -t frontend .
podman run -d --name frontend --network host frontend:latest
```

### 3. Open

| Service | URL |
|---|---|
| **Site** | http://localhost:3000/main |
| **Admin** | http://localhost:8000/admin/ |
| **API** | http://localhost:8000/api/ |

---

### 🔧 Cross-platform launch

#### 🐧 Linux (Podman / Docker native)

`network_mode: host` works out of the box:

```bash
podman compose up -d --build    # or: docker compose up -d --build
```

#### 🪟 Windows / 🍏 macOS (Docker Desktop)

`network_mode: host` is **not supported** on Docker Desktop. Use port mapping instead (see Russian section below for a full `docker-compose.yml` template).

```bash
docker compose -f docker-compose.yml up -d --build
```

#### 💻 No Docker (local dev)

```bash
# 1. MariaDB on port 3306
# 2. Backend
cd Backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate && python manage.py runserver

# 3. Frontend (separate terminal)
cd frontend && npm ci && npm run dev
```

---

## 🔗 Stack

| Layer | Technology |
|---|---|
| **Backend** | Django 6.0, DRF 3.17, django-filter, django-cors-headers |
| **Database** | MariaDB 11 (podman), legacy tables (`managed = False`) |
| **Frontend** | Next.js 16.1.6 (standalone), React 19.1.0, TypeScript 5 |
| **Styling** | Tailwind CSS 4.2.1, Framer Motion 12.35.2 |
| **State** | Zustand 5.0.11 |
| **Admin** | Custom Django admin with Excel export (openpyxl), event logging |
| **Container** | Podman / Docker |

---

## 📄 API Endpoints

| Endpoint | Description |
|---|---|
| `/api/labs/` | Laboratories (filter by slug, members action) |
| `/api/projects/` | Projects (filter by lab_slug) |
| `/api/students/` | Students with roles in projects |
| `/api/guides/` | Laboratory supervisors |
| `/api/hub-leaders/` | Hub leaders |
| `/api/achievements/` | Achievements (filter by lab/project) |
| `/api/reports/` | Reports |
| `/api/events/` | Event log |
| `/api/users/me/` | Current user |

---

## 🛠️ Troubleshooting

| Problem | What to try |
|---|---|
| **Django won't start** | Check `/tmp/django.log`; ensure `--noreload` flag |
| **Frontend build fails** | Run `npm run validate` in frontend/ |
| **Media files 404** | Check `/media` rewrite in `next.config.ts` |
| **Database connection** | `podman ps` to verify MariaDB is running |
| **CORS errors** | Check `CORS_ALLOWED_ORIGINS` in backend `.env` |
| **Admin section visible after removal** | Clear `__pycache__` and restart with `--noreload` |

---

## 🙏 Team

| Area | Lead |
|---|---|
| Backend | Grigoriy |
| Frontend | Daniil, Pavel |

---

## 📄 License

Private project — Southern University (IUBiP) © 2026

---

# 🏛️ IUBiP Hub — Студенческий Цифровой Хаб

[![Django 6](https://img.shields.io/badge/Django-6.0-092E20.svg)](https://www.djangoproject.com/) [![DRF 3.17](https://img.shields.io/badge/DRF-3.17-red.svg)](https://www.django-rest-framework.org/) [![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/) [![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/) [![Python 3.14](https://img.shields.io/badge/python-3.14-blue.svg)](https://www.python.org/) [![MariaDB](https://img.shields.io/badge/MariaDB-11-brown.svg)](https://mariadb.org/)

**Платформа для студенческих лабораторий** Южного Университета (ИУБиП), Ростов-на-Дону. Каждая лаборатория содержит проекты, участников, достижения и руководителей.

Монорепозиторий: бэкенд на **Django + DRF** и фронтенд на **Next.js (App Router)**. База данных — **MariaDB** в podman-контейнере.

---

## ✨ Возможности

- **Лаборатории** — страницы на slug с проектами, участниками, достижениями
- **Проекты** — с ролями, участниками, ссылками, отчётами
- **Достижения** — привязаны к лабораториям или проектам с изображениями
- **Руководители** — лидеры хаба и руководители лабораторий
- **Админка** — Django admin с кастомными inlines, Excel-экспортом, журналом событий
- **Журнал событий** — автоматический аудит изменений моделей
- **Медиа** — изображения на бэкенде, проксируются через фронтенд

---

## 🏗️ Архитектура

```
┌─────────────┐     /api (rewrite)      ┌─────────────┐
│   Next.js   │ ──────────────────────► │   Django    │
│  podman:3000│     /media (rewrite)    │  :8000      │
└─────────────┘                         └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   MariaDB   │
                                        │  podman:3306│
                                        └─────────────┘
```

```
webSite/
├── Backend/          # Django + DRF
│   ├── hub/          # Приложение: модели, вьюхи, админка, сериализаторы
│   ├── hub_backend/  # Настройки Django-проекта
│   ├── media/        # Загруженные изображения
│   └── requirements.txt
├── frontend/         # Next.js 16 App Router
│   ├── app/          # Страницы и компоненты
│   ├── public/       # Статика
│   └── Dockerfile
└── README.md         # Вы здесь
```

---

## 🚀 Быстрый старт

### Требования

- Python **3.14**, Node.js **20+**
- Podman / Docker
- MariaDB **11** контейнер

### 1. Все сервисы (compose)

```bash
podman compose up -d
```

### 2. Или по отдельности

```bash
# База данных
podman run -d --name hub-mysql -e MARIADB_ROOT_PASSWORD=root -p 3306:3306 mariadb:11

# Бэкенд
cd Backend && podman build --no-cache --network host -t hub-backend .
podman run -d --name hub-backend --network host hub-backend

# Фронтенд
cd frontend && podman build --no-cache --network host -t frontend .
podman run -d --name frontend --network host frontend:latest
```

### 3. Открыть

| Сервис | URL |
|---|---|
| **Сайт** | http://localhost:3000/main |
| **Админка** | http://localhost:8000/admin/ |
| **API** | http://localhost:8000/api/ |

---

### 🔧 Запуск на разных платформах

#### 🐧 Linux (Podman / Docker native)

```bash
# Сохранить compose.yaml как есть (network_mode: host работает нативно)
podman compose up -d --build
# или
docker compose up -d --build
```

`network_mode: host` работает из коробки — контейнеры видят `localhost` друг друга.

#### 🪟 Windows / 🍏 macOS (Docker Desktop)

В Docker Desktop `network_mode: host` **не поддерживается**. Вместо этого используйте порты:

```yaml
# docker-compose.yml (альтернативная версия для Windows/Mac)
services:
  db:
    image: docker.io/mariadb:11
    container_name: hub-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: appiub95_it_hub
      MYSQL_USER: Fxrar
      MYSQL_PASSWORD: qwerty
    ports:
      - "3306:3306"
    volumes:
      - hub_mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "localhost"]
    restart: unless-stopped

  backend:
    build: ./Backend
    container_name: hub-backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_HOST: db                    # имя сервиса (внутренняя сеть compose)
      DATABASE_PORT: "3306"
      DATABASE_NAME: appiub95_it_hub
      DATABASE_USER: Fxrar
      DATABASE_PASSWORD: qwerty
      CORS_ALLOWED_ORIGINS: http://localhost:3000,http://127.0.0.1:3000
    volumes:
      - hub_backend_media:/app/media
    depends_on:
      db:
        condition: service_healthy
    command: >
      sh -c "
        python manage.py migrate &&
        python manage.py runserver 0.0.0.0:8000 --noreload
      "
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: hub-frontend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      API_BASE_URL: http://localhost:8000/api
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  hub_mysql_data:
  hub_backend_media:
```

Запуск:

```bash
docker compose -f docker-compose.yml up -d --build
```

#### 💻 Без Docker (локальная разработка)

```bash
# 1. MariaDB (любым способом — порт 3306)
# podman, docker, или установленный локально

# 2. Бэкенд
cd Backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# 3. Фронтенд (в отдельном терминале)
cd frontend
npm ci
npm run dev
```

#### 🔍 Проверка после запуска

```bash
curl http://localhost:8000/api/labs/        # список лабораторий
curl http://localhost:8000/admin/           # админка (должна открыться)
curl http://localhost:3000/main             # главная страница
```

---

## 🔗 Стек

| Слой | Технология |
|---|---|
| **Бэкенд** | Django 6.0, DRF 3.17, django-filter, django-cors-headers |
| **База данных** | MariaDB 11 (podman), legacy-таблицы (`managed = False`) |
| **Фронтенд** | Next.js 16.1.6 (standalone), React 19.1.0, TypeScript 5 |
| **Стили** | Tailwind CSS 4.2.1, Framer Motion 12.35.2 |
| **Состояние** | Zustand 5.0.11 |
| **Админка** | Кастомная Django admin с Excel-экспортом (openpyxl), логированием |
| **Контейнеры** | Podman / Docker |

---

## 📄 Endpoints API

| Endpoint | Описание |
|---|---|
| `/api/labs/` | Лаборатории (фильтр по slug, members action) |
| `/api/projects/` | Проекты (фильтр по lab_slug) |
| `/api/students/` | Студенты с ролями в проектах |
| `/api/guides/` | Руководители лабораторий |
| `/api/hub-leaders/` | Лидеры хаба |
| `/api/achievements/` | Достижения (фильтр по лаб./проекту) |
| `/api/reports/` | Отчёты |
| `/api/events/` | Журнал событий |
| `/api/users/me/` | Текущий пользователь |

---

## 🛠️ Устранение неполадок

| Проблема | Что делать |
|---|---|
| **Django не стартует** | Проверить `/tmp/django.log`; убедиться в флаге `--noreload` |
| **Сборка фронта падает** | Запустить `npm run validate` в frontend/ |
| **Медиа-файлы 404** | Проверить rewrite `/media` в `next.config.ts` |
| **Нет БД** | `podman ps` — убедиться, что MariaDB запущен |
| **Ошибки CORS** | Проверить `CORS_ALLOWED_ORIGINS` в `.env` бэкенда |
| **Раздел админки виден после удаления** | Очистить `__pycache__` и перезапустить с `--noreload` |

---

## 🙏 Команда

| Направление | Ответственный |
|---|---|
| Бэкенд | Григорий |
| Фронтенд | Даниил, Павел |

---

## 📄 Лицензия

Приватный проект — Южный Университет (ИУБиП) © 2026
