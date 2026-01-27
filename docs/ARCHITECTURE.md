# Архитектура проекта

Этот документ описывает структуру проекта и ответственность **каждой папки и ключевых файлов** (first‑party) в репозитории.
Сгенерированные директории (`node_modules/`, `.next/`) и lock‑файлы пакетов мы здесь не расписываем.

## Корень репозитория

- `src/`: исходники Next.js (App Router) + серверные утилиты.
- `public/`: статические файлы (svg, иконки).
- `docs/`: документация проекта.

### Конфиги / инфраструктура

- `docker-compose.yml`: описывает запуск **двух сервисов** — `web` (Next.js) и `mongo` (MongoDB) + volume для данных.
- `Dockerfile`: multi-stage сборка `web` контейнера (deps → build → run).
- `env.example`: пример переменных окружения (копируй в `.env.local` для локального запуска без docker).
- `.gitignore`: исключения для git (в т.ч. `.env*`, `.next/`, `node_modules/`).
- `.dockerignore`: исключения для docker build (ускоряет сборку и уменьшает контекст).
- `next.config.ts`: конфиг Next.js (включает `reactCompiler`, и фиксирует `turbopack.root`).
- `tsconfig.json`: TypeScript конфиг + алиас `@/*` → `./src/*`.
- `eslint.config.mjs`: ESLint конфигурация (next core-web-vitals + typescript).
- `next-env.d.ts`: авто‑файл типов Next.js (генерируется create-next-app).

### Документы

- `README.md`: как ставить зависимости и запускать (в т.ч. “как показывать на демо через docker compose”).
- `TODO`: рабочий чеклист “что делаем по шагам” (история/инструкция).

## `src/app` (App Router)

Здесь живут **страницы** и **API endpoints**. По структуре папок Next.js строит роуты.

- `src/app/layout.tsx`: корневой layout приложения (обертка для всех страниц), подключает глобальные шрифты и `globals.css`.
- `src/app/globals.css`: глобальные стили для всего приложения.
- `src/app/page.tsx`: главная страница (stub) — читает cookie, определяет “кто я”, показывает `me` и ссылки на auth/API.
- `src/app/page.module.css`: оставшийся css‑модуль от шаблона create-next-app (сейчас не используется страницей `/`, но файл можно либо удалить позже, либо вернуть стили).
- `src/app/favicon.ico`: favicon.

### Страницы

- `src/app/auth/register/page.tsx`: клиентская форма регистрации (POST `/api/auth/register`).
- `src/app/auth/login/page.tsx`: клиентская форма логина (POST `/api/auth/login`).

### API Routes

- `src/app/api/auth/register/route.ts`: регистрация (создает пользователя в MongoDB).
- `src/app/api/auth/login/route.ts`: логин (проверяет пароль, ставит httpOnly cookie с JWT).
- `src/app/api/auth/me/route.ts`: возвращает текущего пользователя по cookie JWT.

## `src/lib` (серверные утилиты)

- `src/lib/mongodb.ts`: подключение к MongoDB + `getDb()`; в dev переиспользует соединение через `global._mongoClientPromise`.
- `src/lib/password.ts`: хеширование/проверка паролей (bcryptjs).
- `src/lib/auth.ts`: подпись/проверка JWT (jose) + имя cookie `cnpf_auth`.

## Как идет запрос (в 2 словах)

- Регистрация: страница → `/api/auth/register` → MongoDB `users.insertOne`.
- Логин: страница → `/api/auth/login` → MongoDB `users.findOne` + bcrypt → cookie `cnpf_auth` (JWT).
- Me: `/api/auth/me` (или SSR на `/`) → cookie `cnpf_auth` → `verifyAuthToken` → MongoDB `users.findOne`.

## Docker Compose (локальный запуск)

- `mongo`: MongoDB в контейнере, данные лежат в volume `mongo_data`, порт проброшен на `27017`.
- `web`: Next.js app (включая API routes). По умолчанию подключается к Mongo по `mongodb://mongo:27017/cnpf_feeder`, порт `3000`.

## Важно про переменные окружения

- `AUTH_SECRET`: секрет для подписи JWT. Для демо можно любой длинный рандом; для продакшена — хранить как секрет.
- `MONGODB_URI`: строка подключения к MongoDB.
  - в docker compose по умолчанию берется `mongodb://mongo:27017/cnpf_feeder`
  - вне docker обычно `mongodb://localhost:27017/cnpf_feeder`

