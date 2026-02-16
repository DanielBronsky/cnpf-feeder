# Миграция Docker контейнеров на новую архитектуру

## Текущая ситуация

**Старая архитектура** (монолит):
- `web` - Next.js приложение с API routes (порт 3000)
- `mongo` - MongoDB (порт 27017)

**Новая архитектура** (разделенная):
- `backend` - Go GraphQL API (порт 4000)
- `frontend` - Next.js приложение (порт 3000)
- `mongo` - MongoDB (порт 27017)

## План миграции

### Шаг 1: Остановить старые контейнеры

```bash
cd /Users/daniel/projects/cnpf.feeder.md
docker compose down
```

Это остановит и удалит контейнеры:
- `cnpffeedermd-web-1`
- `cnpffeedermd-mongo-1`

⚠️ **Важно**: Данные MongoDB сохранятся в volume `mongo_data`, они не будут удалены!

### Шаг 2: Обновить docker-compose.yml

Файл `docker-compose.yml` уже обновлен и теперь включает:
- `backend` - собирается из `../cnpf-feeder-backend`
- `frontend` - собирается из текущей директории
- `mongo` - использует официальный образ `mongo:7`

### Шаг 3: Запустить новый стек

```bash
cd /Users/daniel/projects/cnpf.feeder.md
docker compose up --build
```

Это создаст и запустит:
- `cnpffeedermd-backend-1` - Go GraphQL API
- `cnpffeedermd-frontend-1` - Next.js Frontend
- `cnpffeedermd-mongo-1` - MongoDB (использует существующий volume)

### Шаг 4: Проверка

1. **Backend**: http://localhost:4000/graphql (GraphQL Playground)
2. **Frontend**: http://localhost:3000
3. **MongoDB**: localhost:27017

## Очистка старых образов (опционально)

После успешного запуска нового стека можно удалить старый образ:

```bash
docker rmi cnpffeedermd-web
```

## Структура после миграции

```
/Users/daniel/projects/
├── cnpf.feeder.md/              # Frontend проект
│   ├── docker-compose.yml       # Управляет всем стеком
│   ├── Dockerfile               # Сборка Frontend
│   └── ...
│
└── cnpf-feeder-backend/         # Backend проект
    ├── Dockerfile               # Сборка Backend
    └── ...
```

## Преимущества новой структуры

1. **Разделение ответственности**: Backend и Frontend в отдельных контейнерах
2. **Независимая разработка**: Можно обновлять Backend и Frontend отдельно
3. **Масштабируемость**: Можно запускать несколько экземпляров Backend или Frontend
4. **Единая точка управления**: Один `docker-compose.yml` управляет всем стеком

## Переменные окружения

Создайте файл `.env` в `cnpf.feeder.md` (если еще не создан):

```env
# MongoDB
MONGODB_URI=mongodb://mongo:27017/cnpf_feeder

# Backend
AUTH_SECRET=change_this_to_a_long_random_string
PORT=4000
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Troubleshooting

### Порт уже занят
```bash
# Проверить, что использует порт
lsof -i :3000
lsof -i :4000
lsof -i :27017

# Остановить процесс или изменить порт в docker-compose.yml
```

### Ошибка сборки Backend
```bash
# Убедитесь, что Backend проект существует
ls -la ../cnpf-feeder-backend

# Проверьте Dockerfile в Backend проекте
cat ../cnpf-feeder-backend/Dockerfile
```

### Данные MongoDB не сохраняются
```bash
# Проверьте volume
docker volume ls | grep mongo_data

# Проверьте, что volume подключен
docker compose config | grep mongo_data
```
