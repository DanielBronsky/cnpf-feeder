# Docker Compose команды

## Быстрый старт всего стека

```bash
# Запустить все сервисы (Backend + Frontend + MongoDB)
docker compose up -d

# Или с пересборкой образов
docker compose up -d --build

# Или через yarn/npm
yarn compose:up
# или
npm run compose:up
```

## Остановка

```bash
# Остановить все сервисы
docker compose down

# Остановить и удалить volumes (удалит данные MongoDB!)
docker compose down -v
```

## Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Только Backend
docker compose logs -f backend

# Только Frontend
docker compose logs -f frontend

# Только MongoDB
docker compose logs -f mongo
```

## Перезапуск

```bash
# Перезапустить все сервисы
docker compose restart

# Перезапустить только Backend
docker compose restart backend

# Перезапустить только Frontend
docker compose restart frontend
```

## Статус

```bash
# Показать статус всех контейнеров
docker compose ps

# Показать использование ресурсов
docker compose top
```

## Пересборка

```bash
# Пересобрать все образы
docker compose build

# Пересобрать только Backend
docker compose build backend

# Пересобрать только Frontend
docker compose build frontend

# Пересобрать без кэша
docker compose build --no-cache
```

## Доступные URL

После запуска `docker compose up -d`:

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql
- **GraphQL Playground**: http://localhost:4000/
- **MongoDB**: localhost:27017 (внутри Docker сети)

## Переменные окружения

Создайте файл `.env` в корне проекта `cnpf.feeder.md`:

```env
MONGODB_URI=mongodb://mongo:27017/cnpf_feeder
AUTH_SECRET=your_long_random_secret_here
PORT=4000
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Troubleshooting

### Порт занят

```bash
# Проверить, что использует порт
lsof -i :3000
lsof -i :4000
lsof -i :27017

# Остановить процесс
kill <PID>
```

### MongoDB не запускается

```bash
# Проверить логи
docker compose logs mongo

# Пересоздать volume
docker compose down -v
docker compose up -d mongo
```

### Backend не подключается к MongoDB

Проверьте, что `MONGODB_URI` в `.env` использует имя сервиса `mongo`:
```env
MONGODB_URI=mongodb://mongo:27017/cnpf_feeder
```

### Frontend не подключается к Backend

Проверьте, что `NEXT_PUBLIC_GRAPHQL_URL` в `.env` правильный:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```
