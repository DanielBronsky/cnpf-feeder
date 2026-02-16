# План миграции на GraphQL

## Текущий статус

✅ **Backend проект создан** (`/Users/daniel/projects/cnpf-feeder-backend/`)
- GraphQL схема и resolvers готовы
- Apollo Server настроен
- Dockerfile создан

✅ **Frontend проект обновлен**
- Apollo Client добавлен в зависимости
- Apollo Provider настроен в layout
- Базовая структура готова

## Что нужно сделать дальше

### 1. Удалить API routes из Frontend

После миграции всех компонентов на GraphQL, удалить:
- `src/app/api/` - вся папка

### 2. Мигрировать компоненты на GraphQL

#### 2.1. Auth компоненты
- [ ] `src/app/auth/login/page.tsx` - использовать `login` mutation
- [ ] `src/app/auth/register/page.tsx` - использовать `register` mutation
- [ ] `src/components/LogoutButton/LogoutButton.tsx` - использовать `logout` mutation

#### 2.2. Feed компоненты
- [ ] `src/app/feed/ui.tsx` - использовать `reports` query и `createReport`, `updateReport`, `deleteReport` mutations
- [ ] `src/app/feed/page.tsx` - обновить для работы с GraphQL

#### 2.3. Settings компоненты
- [ ] `src/app/settings/ui.tsx` - использовать `me` query, `updateProfile`, `updatePassword` mutations
- [ ] `src/app/settings/modal.tsx` - обновить для работы с GraphQL

#### 2.4. Admin компоненты
- [ ] `src/app/admin/users/ui.tsx` - использовать `adminUsers` query, `adminUpdateUser`, `adminDeleteUser` mutations
- [ ] `src/app/admin/reports/ui.tsx` - использовать GraphQL queries/mutations
- [ ] `src/app/admin/competitions/ui.tsx` - использовать `competitions` query, `createCompetition`, `updateCompetition`, `deleteCompetition` mutations

#### 2.5. Другие компоненты
- [ ] `src/app/page.tsx` - использовать `me` query
- [ ] `src/components/Header/Header.tsx` - использовать `me` query
- [ ] `src/components/Competition/CompetitionsSection.tsx` - использовать `competitions` query

### 3. Создать GraphQL queries и mutations

Создать файлы в `src/lib/graphql/`:
- [ ] `queries.ts` - все GraphQL queries
- [ ] `mutations.ts` - все GraphQL mutations
- [ ] `fragments.ts` - переиспользуемые fragments (если нужно)

### 4. Обновить переменные окружения

Добавить в `.env.local`:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

### 5. Обновить Docker

- [ ] Обновить `Dockerfile` для Frontend (убрать зависимости для API routes)
- [ ] Обновить `docker-compose.yml` (если нужно)

### 6. Удалить неиспользуемые зависимости

После полной миграции удалить из `package.json`:
- `bcryptjs` (используется только в API routes)
- `jose` (используется только в API routes)
- `mongodb` (используется только в API routes)

## Пример миграции компонента

### До (REST API):
```typescript
const r = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ login, password }),
});
const data = await r.json();
```

### После (GraphQL):
```typescript
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '@/lib/graphql/mutations';

const [loginMutation] = useMutation(LOGIN_MUTATION);
const { data } = await loginMutation({
  variables: { input: { login, password } },
});
```

## Важные замечания

1. **Файлы (photos, avatar)**: GraphQL Upload пока не реализован. Можно:
   - Оставить REST endpoints для загрузки файлов
   - Или добавить поддержку GraphQL Upload scalar позже

2. **Cookies**: Apollo Client настроен для отправки cookies (`credentials: 'include'`), поэтому аутентификация через cookies будет работать.

3. **Обработка ошибок**: GraphQL возвращает ошибки в другом формате, нужно обновить обработку ошибок в компонентах.

4. **Типизация**: Создать TypeScript типы для GraphQL queries/mutations (можно использовать GraphQL Code Generator).

## Проверка миграции

После миграции каждого компонента:
1. Проверить, что компонент работает
2. Убедиться, что нет прямых вызовов `/api/*`
3. Проверить обработку ошибок
