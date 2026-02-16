# Настройка чат-бота с Google Gemini

## Архитектура

Чат-бот реализован на **Go backend** через GraphQL API. Вся логика поиска и интеграции с Gemini находится на бэкенде.

## Шаг 1: Получение API ключа Google Gemini

1. Перейдите на [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Войдите в свой Google аккаунт
3. Нажмите "Create API Key"
4. Скопируйте полученный API ключ

## Шаг 2: Добавление API ключа в Backend

### Для локального запуска Backend:

Создайте файл `.env` в корне проекта `cnpf-feeder-backend`:

```env
MONGODB_URI="mongodb://localhost:27017/cnpf_feeder"
AUTH_SECRET="change_this_to_a_long_random_string"
GOOGLE_GEMINI_API_KEY="ваш_api_ключ_здесь"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

### Для Docker Compose:

Добавьте переменную в `docker-compose.yml` в секцию `backend`:

```yaml
environment:
  GOOGLE_GEMINI_API_KEY: ${GOOGLE_GEMINI_API_KEY:-your_api_key_here}
```

Или передайте при запуске:

```bash
GOOGLE_GEMINI_API_KEY="ваш_ключ" yarn compose:up
```

## Шаг 3: Генерация GraphQL кода

После добавления новых типов в schema.graphql нужно сгенерировать код:

```bash
cd cnpf-feeder-backend
go generate ./graph
```

## Шаг 4: Запуск проекта

### Локально:

```bash
# Backend
cd cnpf-feeder-backend
go run cmd/graph/server.go

# Frontend (в другом терминале)
cd cnpf.feeder.md
yarn dev
```

### Через Docker Compose:

```bash
cd cnpf.feeder.md
GOOGLE_GEMINI_API_KEY="ваш_ключ" yarn compose:up
```

## Использование

1. Откройте страницу `/chat` в браузере
2. Или нажмите "Чат-бот" в навигации (если вы залогинены)
3. Задайте вопрос, например:
   - "Отчет о Днестре"
   - "соревнования в Данченах"
   - "покажи последние отчеты"

## Как это работает

1. **Frontend**: Отправляет GraphQL query `chat(query: String!)` на бэкенд
2. **Backend**: Ищет в MongoDB отчеты и соревнования по ключевым словам
3. **Gemini**: Анализирует найденные материалы через Google Gemini AI
4. **Ответ**: Бэкенд возвращает дружелюбный ответ с предложением перейти к материалам

## GraphQL Query

Чат-бот использует GraphQL query:

```graphql
query Chat($query: String!) {
  chat(query: $query) {
    message
    results {
      id
      type
      title
      hasPhotos
      photosCount
      location
    }
  }
}
```

## Ограничения Google Gemini Free Tier

- **15 запросов в минуту** - этого достаточно для тестирования
- Для продакшена может потребоваться платный план

## Troubleshooting

### Ошибка "Missing GOOGLE_GEMINI_API_KEY"

Убедитесь, что:
1. API ключ добавлен в `.env.local` (для локального запуска)
2. Переменная окружения передана в Docker контейнер
3. Перезапустили сервер после добавления переменной

### Ошибка "API key not valid"

Проверьте, что API ключ скопирован полностью и без лишних пробелов.

### Медленные ответы

Gemini API может отвечать с задержкой. Это нормально для бесплатного tier.
