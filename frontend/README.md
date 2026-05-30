# IUBiP Hub — Frontend

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/) [![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/) [![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4.svg)](https://tailwindcss.com/)

**Student Digital Hub frontend** — Next.js 16 (App Router) + React 19 + TypeScript. Runs in a podman container on port 3000 with standalone output.

Proxies `/api/*` and `/media/*` to the Django backend through `next.config.ts` rewrites.

---

## ✨ Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router, standalone) |
| UI | React 19.1.0, Tailwind CSS 4.2.1 |
| Language | TypeScript 5 |
| State | Zustand 5.0.11 |
| Animations | Framer Motion 12.35.2 |
| Slider | Swiper 12.1.2 |

---

## 🏗️ Architecture

```
┌─────────────┐     /api (rewrite)      ┌─────────────┐
│   Next.js   │ ──────────────────────► │   Django    │
│  podman:3000│                         │  :8000      │
└─────────────┘                         └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   MariaDB   │
                                        │  podman:3306│
                                        └─────────────┘
```

## 🚀 Run

### Prerequisites

- Node.js **20+** (used in Dockerfile `node:20-slim`)
- Docker / Podman
- Django backend running on `localhost:8000`

### Podman (production)

```bash
# Build
podman build --no-cache --network host -t frontend .

# Replace container
podman stop frontend && podman rm frontend
podman run -d --name frontend --network host frontend:latest
```

### Local development

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Code quality

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
npm run format     # Prettier
npm run validate   # full check
```

---

## ⚙️ Configuration

### Environment (`Dockerfile`)

| Variable | Purpose |
|---|---|
| `API_BASE_URL` | Backend URL for SSR (`http://localhost:8000/api`) |

### Next.js rewrites (`next.config.ts`)

| Source | Destination |
|---|---|
| `/api/:path*` | `http://localhost:8000/api/:path*` |
| `/media/:path*` | `http://localhost:8000/media/:path*` |

### Redirects

- `/` → `/main`
- `/main/:path+` → `/main`

---

## 📁 Structure

```
frontend/
├── app/
│   ├── auth/           # Login page
│   ├── components/     # React components
│   ├── lab/            # Lab pages
│   ├── main/           # Home page
│   ├── store/          # Zustand stores
│   ├── lib/            # API client, helpers
│   └── globals.css
├── public/             # Static assets
├── DataBase/           # Types, constants
├── scripts/            # Validation scripts
├── Dockerfile
└── next.config.ts
```

---

## 🛠️ Troubleshooting

| Problem | What to try |
|---|---|
| **Build fails** | Run `npm run validate` to check types + lint + data |
| **API 404** | Ensure Django is running on `:8000` |
| **Media 404** | Check `/media` rewrite in `next.config.ts` |
| **Container won't start** | Check logs: `podman logs frontend` |

---

## 📄 License

Private project — Southern University (IUBiP) © 2026

---

# IUBiP Hub — Фронтенд

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/) [![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/) [![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4.svg)](https://tailwindcss.com/)

**Фронтенд Студенческого Цифрового Хаба** — Next.js 16 (App Router) + React 19 + TypeScript. Запускается в podman контейнере на порту 3000 с standalone-сборкой.

Проксирует `/api/*` и `/media/*` на Django-бэкенд через rewrites в `next.config.ts`.

---

## ✨ Стек

| Слой | Технология |
|---|---|
| Framework | Next.js 16.1.6 (App Router, standalone) |
| UI | React 19.1.0, Tailwind CSS 4.2.1 |
| Язык | TypeScript 5 |
| Состояние | Zustand 5.0.11 |
| Анимации | Framer Motion 12.35.2 |
| Слайдер | Swiper 12.1.2 |

---

## 🏗️ Архитектура

```
┌─────────────┐     /api (rewrite)      ┌─────────────┐
│   Next.js   │ ──────────────────────► │   Django    │
│  podman:3000│                         │  :8000      │
└─────────────┘                         └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   MariaDB   │
                                        │  podman:3306│
                                        └─────────────┘
```

## 🚀 Запуск

### Требования

- Node.js **20+** (в Dockerfile используется `node:20-slim`)
- Docker / Podman
- Django бэкенд на `localhost:8000`

### Podman (production)

```bash
# Сборка
podman build --no-cache --network host -t frontend .

# Замена контейнера
podman stop frontend && podman rm frontend
podman run -d --name frontend --network host frontend:latest
```

### Локальная разработка

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Проверка качества

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
npm run format     # Prettier
npm run validate   # полная проверка
```

---

## ⚙️ Настройка

### Переменные окружения (`Dockerfile`)

| Переменная | Назначение |
|---|---|
| `API_BASE_URL` | URL бэкенда для SSR (`http://localhost:8000/api`) |

### Rewrites Next.js (`next.config.ts`)

| Источник | Назначение |
|---|---|
| `/api/:path*` | `http://localhost:8000/api/:path*` |
| `/media/:path*` | `http://localhost:8000/media/:path*` |

### Редиректы

- `/` → `/main`
- `/main/:path+` → `/main`

---

## 📁 Структура

```
frontend/
├── app/
│   ├── auth/           # Страница входа
│   ├── components/     # React-компоненты
│   ├── lab/            # Страницы лабораторий
│   ├── main/           # Главная страница
│   ├── store/          # Zustand-хранилища
│   ├── lib/            # API-клиент, утилиты
│   └── globals.css
├── public/             # Статика
├── DataBase/           # Типы, константы
├── scripts/            # Скрипты валидации
├── Dockerfile
└── next.config.ts
```

---

## 🛠️ Устранение неполадок

| Проблема | Что делать |
|---|---|
| **Ошибка сборки** | Запустить `npm run validate` для проверки |
| **API 404** | Убедиться, что Django запущен на `:8000` |
| **Медиа 404** | Проверить rewrite `/media` в `next.config.ts` |
| **Контейнер не стартует** | Логи: `podman logs frontend` |

---

## 📄 Лицензия

Приватный проект — Южный Университет (ИУБиП) © 2026
