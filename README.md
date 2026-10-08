# Цифровая визитка: backend

GraphQL API для цифровой визитки Андрея Быченкова: профиль, ссылки, образование, навыки, опыт работы с достижениями и проекты.

Данные взяты с сайта [decebell032rus.pythonanywhere.com](https://decebell032rus.pythonanywhere.com) и с [GitHub](https://github.com/AndreyBychenkow). Сбор выполнен 8 октября 2026 года.

## Стек

| Что | Чем |
|---|---|
| Язык и рантайм | TypeScript 6, Node.js 24 (минимум 20.19) |
| Фреймворк | NestJS 12, ESM (`module: nodenext`) |
| GraphQL | `@nestjs/graphql` 14 (code-first), `@nestjs/apollo` 14, Apollo Server 5, Apollo Sandbox |
| База данных | PostgreSQL 17, Prisma 7 через `@prisma/adapter-pg` |
| Батчинг | DataLoader (`dataloader`) |
| Тесты | Vitest 4, supertest, SWC (для DI в тестах) |
| Линтер и форматирование | oxlint, Prettier |
| Контейнеры | Docker (multi-stage), Docker Compose |

## Быстрый старт через Docker

Нужны Docker и Docker Compose. Ничего заранее создавать не надо: база, миграции и данные создаются при первом запуске.

```bash
docker compose up --build
```

После запуска:

- GraphQL и Apollo Sandbox: <http://localhost:3000/graphql> (откройте в браузере);
- проверка работоспособности: <http://localhost:3000/health>.

Если порты заняты, их можно сменить: `API_PORT=3001 POSTGRES_PORT=5433 docker compose up --build`.

Пример запроса — все данные по ТЗ:

```graphql
query {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
      period
      achievements {
        text
      }
    }
    projects {
      name
      url
    }
  }
}
```

Тот же запрос через curl:

```bash
curl -X POST http://localhost:3000/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"query { profile { name description skills { name } experience { company position period achievements { text } } projects { name url } } }"}'
```

Остановить и удалить данные базы: `docker compose down -v`. Без `-v` данные сохраняются в volume `pgdata`.

## Локальная разработка без Docker

1. Установите PostgreSQL 17 и создайте базу `digital_card` (пользователь и пароль на ваш выбор).
2. Скопируйте `.env.example` в `.env` и поправьте `DATABASE_URL`.
3. Установите зависимости и подготовьте базу:

   ```bash
   npm install
   npm run db:setup      # миграции и заполнение данными
   npm run start:dev     # сервер с перезагрузкой на http://localhost:3000/graphql
   ```

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run start:dev` | Запуск в режиме разработки с перезагрузкой |
| `npm run build` | Сборка в `dist/` |
| `npm run start:prod` | Запуск собранной версии (`dist/main.js`) |
| `npm run db:migrate` | Применить миграции Prisma (`prisma migrate deploy`) |
| `npm run db:migrate:dev` | Создать новую миграцию после изменения `schema.prisma` |
| `npm run db:seed` | Привести данные в базе к `profile.data.ts` |
| `npm run db:setup` | Миграции и seed подряд |
| `npm test` | Unit-тесты |
| `npm run test:e2e` | e2e-тесты на отдельной базе |
| `npm run lint` | oxlint с проверкой типов |
| `npm run format` | Prettier |

## Переменные окружения

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `DATABASE_URL` | да | — | Строка подключения к PostgreSQL |
| `PORT` | нет | `3000` | Порт HTTP-сервера (от 1 до 65535) |
| `E2E_DATABASE_URL` | нет | `…/digital_card_test` | База для e2e-тестов. Её нельзя брать равной рабочей базе |
| `API_PORT`, `POSTGRES_PORT` | нет | `3000`, `5432` | Порты на хосте для `docker compose` |

Приложение проверяет переменные при старте и завершается с понятной ошибкой, если `DATABASE_URL` не задан или `PORT` некорректен.

## API

Единственная точка входа — `Query.profile`. Остальное открывается через вложенные поля:

```graphql
query {
  profile {
    name
    title
    description
    links { kind label url }
    education { institution degree graduationYear }
    skills(category: TESTING) { name category }   # фильтр необязателен
    experience {
      company
      position
      period          # "Февраль 2026 — Август 2026" или "… — настоящее время"
      isCurrent
      durationMonths
      achievements { text }
    }
    projects { name url technologies }
  }
}
```

Полная схема собрана в файле `schema.gql` (он создаётся при запуске вне production). Её же можно посмотреть в Apollo Sandbox, там есть документация к полям.

Значения `SkillCategory`: `LANGUAGES_AND_FRAMEWORKS`, `API_AND_ARCHITECTURE`, `DATABASES_AND_QUEUES`, `DEVOPS_AND_INFRASTRUCTURE`, `TESTING`.

## Структура проекта

```
src/
  main.ts                 точка входа: завершение по SIGTERM, CORS, порт
  app.module.ts           корневой модуль
  config/                 проверка переменных окружения при старте
  database/               PrismaService и seed (database/seed)
  graphql/                настройки Apollo: путь, Sandbox, схема
  health/                 GET /health
  profile/                Query.profile, ссылки, образование
  skills/                 навыки и фильтр по категории
  experience/             опыт, период работы, достижения (DataLoader)
  projects/               проекты
prisma/                   schema.prisma и миграции
test/                     e2e-тесты и подготовка их базы
docker/postgres/init/     создание тестовой базы при первом старте PostgreSQL
```

Внутри каждого модуля слои разделены так:

- `*.repository.ts` — только запросы к базе через Prisma;
- `*.service.ts` — правила и сборка моделей для API;
- `*.resolver.ts` — GraphQL-слой (Query и ResolveField), без обращений к базе;
- `models/*.model.ts` — GraphQL-типы. Они не совпадают с типами Prisma, поэтому схема API не зависит от устройства таблиц.

### Вложенные данные и N+1

Достижения грузятся через DataLoader (`experience/achievements.loader.ts`). Загрузчик живёт в рамках одного запроса: все опыты, которые запрошены в нём, получают достижения одним SQL-запросом `WHERE "experienceId" IN (...)`. Это проверено по журналу PostgreSQL: при запросе двух мест работы с достижениями выполняется один такой запрос. Юнит-тест и e2e-тест проверяют то же самое на уровне кода.

## База данных и seed

- Схема описана в `prisma/schema.prisma`. Миграции лежат в `prisma/migrations`.
- Данные визитки хранятся в `src/database/seed/profile.data.ts`. Это источник истины.
- **Seed идемпотентный и выполняется при каждом старте.** Он находит профиль по `slug`, создаёт его или обновляет, а дочерние записи (ссылки, навыки, опыт, достижения, проекты, образование) пересоздаёт. Всё идёт в одной транзакции под `pg_advisory_xact_lock`, поэтому читатель никогда не увидит половину профиля, а два одновременных запуска не конфликтуют.
- Следствие: **ID дочерних записей (ссылок, навыков, опыта, достижений, проектов, образования) меняются при каждой синхронизации.** Внешним клиентам на них полагаться нельзя. ID самого профиля стабилен: seed обновляет ту же строку.
- Чтобы изменить визитку, правьте `profile.data.ts` и перезапускайте приложение (или `npm run db:seed`).

Навыки взяты с сайта. Технологий, которых на сайте нет (например, TypeScript, NestJS, Prisma и GraphQL в этом проекте), в навыках нет, пока владелец визитки не подтвердит их добавление.

## Проверки и healthcheck

`GET /health` выполняет `SELECT 1`. При ответе `200 {"status":"ok","database":"up"}` база доступна. Если база недоступна, возвращается `503`. Этот адрес используют Docker HEALTHCHECK и Render.

Тесты:

- `npm test` — 14 unit-тестов: проверка env, период работы, батчинг достижений, health, ошибка при отсутствующем профиле.
- `npm run test:e2e` — 8 e2e-тестов: запрос из ТЗ, вложенные поля, батчинг, фильтр навыков, ошибки валидации, Apollo Sandbox, идемпотентность seed. Перед запуском тесты применяют миграции и seed к `E2E_DATABASE_URL`. Базу `digital_card_test` создаёт `docker compose` при первом создании volume `pgdata`. Если вы поднимаете свою PostgreSQL, создайте её сами: `createdb digital_card_test`.

## Docker

- `Dockerfile` собирается в несколько стадий: общая база с OpenSSL, сборка, зависимости только для production и runtime-образ. Образ основан на `node:24-slim`: Prisma нуждается в OpenSSL, которого нет в Alpine по умолчанию.
- Приложение работает от пользователя `node`, а не от root.
- `docker-entrypoint.sh` при каждом старте выполняет `prisma migrate deploy`, затем seed и только потом запускает `node dist/main.js`. Сигналы доходят до Node напрямую, а `enableShutdownHooks` закрывает соединения с базой при остановке.
- `docker-compose.yml` поднимает PostgreSQL с healthcheck и запускает API только после того, как база стала `healthy`.

## Проверка с нуля

Прогон в песочнице с пустым volume: `docker compose down -v`, затем `docker compose up --build`.

- База стала `healthy`. Миграция `20261008143811_init` применилась, seed записал профиль: 4 ссылки, 32 навыка, 2 места работы с 11 достижениями, 4 проекта и 1 запись об образовании.
- Перезапуск контейнера: миграций нет (`No pending migrations to apply`), seed дал те же счётчики.
- Запрос из раздела «Быстрый старт» возвращает данные, `/health` отвечает `{"status":"ok","database":"up"}`.
- e2e-набор (8 тестов) проходит против базы из compose.

## Деплой на Render

В репозитории есть `render.yaml` (Blueprint): веб-сервис из `Dockerfile` и база PostgreSQL 17.

1. Загрузите репозиторий на GitHub.
2. В Render выберите **New → Blueprint** и укажите репозиторий. Render создаст `digital-card-db` и `digital-card-api`, а `DATABASE_URL` подставит из базы.
3. Дождитесь деплоя (healthcheck идёт по `/health`) и откройте `https://<имя-сервиса>.onrender.com/graphql`.

Ограничения бесплатного плана: веб-сервис засыпает без трафика, поэтому первый запрос после паузы идёт дольше. Бесплатная база на Render ограничена по времени действия, подробности в документации Render. По умолчанию регион — Oregon. Чтобы выбрать другой, добавьте `region` и сервису, и базе в одном и том же регионе: строка подключения `fromDatabase` работает только внутри региона.

## Решения, которые стоит знать

- **Helmet не подключён.** Его CSP по умолчанию блокирует скрипты с CDN, а Apollo Sandbox загружается именно оттуда. Если понадобятся защитные заголовки, добавьте Helmet с CSP, разрешающей CDN Apollo.
- **CORS открыт для любых источников** (`*`). Данные публичные, API только для чтения.
- **Нет авторизации и мутаций.** Визитка — публичные данные, которые меняются только через seed.
- **Перед деплоем** проверьте, что `DATABASE_URL` указывает на базу, которую вы хотите использовать.
