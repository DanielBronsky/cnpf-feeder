# Как мы собрали проект (шаги)

Этот документ — **пошаговый лог/чеклист**, как был собран проект: от Next.js до Docker Compose (web + mongo) и проверки.

## 0) Цель

Сделать один репозиторий на Next.js (App Router), где:
- UI страницы (frontend)
- API endpoints (backend внутри Next.js: `src/app/api/**`)
- MongoDB для хранения пользователей (локально через `docker compose`)
- Логин/регистрация по email+password, сессия через httpOnly cookie (JWT)

## 1) Создание Next.js проекта

- Создали Next.js проект с App Router и TypeScript.
- Исходники находятся в `src/`.

Ключевые папки:
- `src/app`: страницы и API routes
- `src/lib`: серверные утилиты (db/auth/password)

## 2) Установка зависимостей

Добавили зависимости:
- `mongodb` — работа с MongoDB
- `bcryptjs` — хеширование паролей
- `jose` — JWT подпись/проверка
- `zod` — валидация входных данных

## 3) MongoDB: подключение и helper

Добавили `src/lib/mongodb.ts`:
- хранит логику подключения к MongoDB
- экспортирует `getDb()`
- в dev переиспользует соединение через `global._mongoClientPromise`

## 4) Auth: пароль + JWT cookie

Добавили:
- `src/lib/password.ts` — `hashPassword()` и `verifyPassword()` через bcrypt
- `src/lib/auth.ts` — `signAuthToken()` / `verifyAuthToken()` через jose и константа cookie `cnpf_auth`

## 5) API (backend внутри Next.js)

Добавили API routes:
- `POST /api/auth/register` → `src/app/api/auth/register/route.ts`
- `POST /api/auth/login` → `src/app/api/auth/login/route.ts`
- `GET /api/auth/me` → `src/app/api/auth/me/route.ts`

Что происходит:
- register: валидирует input → проверяет email → сохраняет пользователя в MongoDB
- login: валидирует input → проверяет пароль → ставит httpOnly cookie с JWT
- me: читает cookie → проверяет JWT → достает пользователя из MongoDB → возвращает `{ user | null }`

## 6) UI страницы для проверки

Добавили минимальные страницы:
- `/auth/register` → `src/app/auth/register/page.tsx`
- `/auth/login` → `src/app/auth/login/page.tsx`

И обновили главную:
- `/` → `src/app/page.tsx` (показывает `Me: ...` на сервере, читая cookie и MongoDB)

## 7) Docker Compose (требование задания)

Добавили инфраструктуру:
- `Dockerfile` — сборка и запуск Next.js в production
- `docker-compose.yml` — поднимает `mongo` + `web`
- `.dockerignore` — ускоряет docker build

По умолчанию `web` подключается к MongoDB по:
- `mongodb://mongo:27017/cnpf_feeder`

## 8) Запуск и проверка (для демо)

### Предусловие

- Docker Desktop запущен
- `docker info` показывает `Server:` без ошибок

### Запуск одной командой (в фоне)

```bash
cd /Users/daniel/projects/cnpf.feeder.md
yarn compose:up
```

### Проверка статуса контейнеров

```bash
yarn compose:ps
```

### Открыть в браузере

- `http://localhost:3000/`
- `http://localhost:3000/auth/register`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/api/auth/me`

### Логи (опционально)

```bash
yarn compose:logs
```

### Остановить после демо

```bash
yarn compose:down
```

