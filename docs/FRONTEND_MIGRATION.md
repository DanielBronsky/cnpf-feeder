# Миграция Frontend на GraphQL

## Статус миграции

### ✅ Выполнено

1. **Apollo Client настроен**
   - ✅ `src/lib/apollo-client.ts` - настройка Apollo Client
   - ✅ `src/lib/apollo-provider.tsx` - Apollo Provider
   - ✅ Добавлен в `src/app/layout.tsx`

2. **GraphQL queries и mutations созданы**
   - ✅ `src/lib/graphql/queries.ts` - все queries
   - ✅ `src/lib/graphql/mutations.ts` - все mutations

3. **Компоненты обновлены**
   - ✅ `src/app/auth/login/page.tsx` - использует `LOGIN_MUTATION`
   - ✅ `src/app/auth/register/page.tsx` - использует `REGISTER_MUTATION` (без аватара пока)
   - ✅ `src/components/LogoutButton/LogoutButton.tsx` - использует `LOGOUT_MUTATION`
   - ✅ `src/app/feed/ui.tsx` - использует `REPORTS_QUERY`, `CREATE_REPORT_MUTATION`, `UPDATE_REPORT_MUTATION`, `DELETE_REPORT_MUTATION`

### 🔄 В процессе / Осталось

- [ ] `src/app/settings/ui.tsx` - обновить для GraphQL
- [ ] `src/app/admin/users/ui.tsx` - обновить для GraphQL
- [ ] `src/app/admin/reports/ui.tsx` - обновить для GraphQL
- [ ] `src/app/admin/competitions/ui.tsx` - обновить для GraphQL
- [ ] `src/components/Competition/CompetitionsSection.tsx` - обновить для GraphQL

### 📝 Замечания

1. **Загрузка файлов**: GraphQL не поддерживает загрузку файлов напрямую. Для загрузки фото/аватаров можно:
   - Оставить REST endpoints для загрузки файлов
   - Или добавить поддержку GraphQL Upload scalar позже

2. **Server Components**: Компоненты типа `Header` и `page.tsx` используют server-side `getCurrentUser()`, который работает с cookies. Это нормально и будет работать с GraphQL Backend.

3. **Competitions**: Пока загружаются через REST API, можно обновить позже на GraphQL.

## Переменные окружения

Убедитесь, что в `.env.local` указан URL GraphQL сервера:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Тестирование

После обновления всех компонентов:

1. Запустить Backend: `cd ../cnpf-feeder-backend && go run ./cmd/server`
2. Запустить Frontend: `npm run dev`
3. Протестировать все функции через UI
