# CI/CD для PDP

Подготовка пайплайнов для сдачи PDP.

## Текущая схема

| Репо              | CI                         | CD (деплой)   |
|-------------------|----------------------------|---------------|
| cnpf-feeder-backend | ✅ lint, vet, build, test, Docker | placeholder   |
| cnpf.feeder.md (frontend) | ✅ lint, build, Docker       | placeholder   |

## Что уже работает (CI)

- **Backend**: `go vet`, `golangci-lint`, `go build`, `go test`, Docker build
- **Frontend**: `yarn lint`, `yarn build`, Docker build

Триггер: push/PR в `main`, `master`, `develop`.

## Включение CD для PDP

Когда хостинг выбран, раскомментируй job `deploy-pdp` в `.github/workflows/ci.yml` и добавь шаги.

### Вариант 1: Vercel (фронт)

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Вариант 2: Railway (backend + frontend)

```yaml
- name: Install Railway CLI
  run: npm i -g @railway/cli

- name: Deploy
  run: railway up
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Вариант 3: VPS (SSH + docker compose)

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v1
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_SSH_KEY }}
    script: |
      cd /opt/cnpf-feeder
      git pull
      docker compose up -d --build
```

## Secrets в GitHub

Settings → Secrets and variables → Actions → New repository secret:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — для Vercel
- `RAILWAY_TOKEN` — для Railway
- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` — для VPS

## Чеклист для PDP

- [ ] CI на каждом push/PR
- [ ] Деплой на production при merge в main
- [ ] Успешная сборка Docker для обоих проектов
- [ ] Секреты хранятся в GitHub Secrets, не в коде
