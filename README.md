# CNPF Feeder

> Зачем этот файл: `README.md` — точка входа в проект (как установить, запустить, как показать демо/презентацию).

Полезные доки:
- `docs/ARCHITECTURE.md` — архитектура: что за что отвечает
- `docs/BUILD_STEPS.md` — шаги, как мы собрали проект (Next.js → auth/Mongo → Docker Compose)

## Требования

- **Node.js >= 22.0.0** (обязательно!)
- npm >= 10.0.0 **или** Yarn (рекомендуется для локального запуска команд)

## Установка Node.js 22

### Вариант 1: Через nvm-windows

1. Установите [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
2. Откройте PowerShell от имени администратора и выполните:
   ```powershell
   nvm install 22
   nvm use 22
   ```

### Вариант 2: Прямая установка

Скачайте и установите [Node.js 22 LTS](https://nodejs.org/)

### Проверка версии

```powershell
node --version
# Должно быть: v22.x.x
```

## Установка зависимостей

```bash
npm install
```

или через Yarn:

```bash
yarn install
```

## Переменные окружения

Создайте файл `.env.local` в корне проекта.

В репозитории есть шаблон `env.example` — можно скопировать его:

```bash
cp env.example .env.local
```

```env
MONGODB_URI="mongodb://localhost:27017/cnpf_feeder"
AUTH_SECRET="change_this_to_a_long_random_string"
```

## Запуск

```bash
npm run dev
```

или:

```bash
yarn dev
```

## Запуск через Docker Compose (по заданию)

Поднимает **Next.js app + MongoDB** локально:

```bash
AUTH_SECRET="change_this_to_a_long_random_string" docker compose up --build
```

То же самое, но через скрипты проекта (удобнее для демо):

```bash
yarn compose:up
```

> Важно: `docker-compose.yml` поднимает `web` в **production** (и `Dockerfile` делает `npm run build`), поэтому при изменениях кода нужно пересобирать контейнер (`compose:up`).

После старта:
- `http://localhost:3000/auth/register`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/api/auth/me`

## Демо/презентация (пошагово): Docker Compose + фронт

### 1) Запусти Docker Desktop

Убедись, что Docker daemon запущен:

```bash
docker info
```

### 2) Перейди в папку проекта

```bash
cd /Users/daniel/projects/cnpf.feeder.md
```

### 3) Подними всё одной командой (в фоне)

```bash
yarn compose:up
```

### 4) Покажи, что поднялись контейнеры

```bash
yarn compose:ps
```

Должны быть сервисы `web` и `mongo` в статусе `Up`.

### 5) Открой приложение в браузере

- `http://localhost:3000/`
- `http://localhost:3000/auth/register`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/api/auth/me`

### 6) (Опционально) Логи

```bash
yarn compose:logs
```

### 7) Остановить после демо

```bash
yarn compose:down
```
