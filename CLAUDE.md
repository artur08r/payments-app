# payments-app

Платёжный кабинет: «Платежи и переводы» и «История». Микросервисная архитектура.

## Принцип работы

1. **Пишем локально** — код правим на этом компьютере в `~/Claude/payments-app`.
2. **Проверяем локально** — поднимаем всё в Docker и смотрим в браузере на http://localhost:5173. Всё должно работать до коммита.
3. **Пушим в git** — только проверенное: коммит → `git push` в `github.com/artur08r/payments-app` (приватный, ветка `main`).

Локальная папка и GitHub всегда синхронизированы: не оставляем непушнутых проверенных изменений.

Делаем только то, что попросили: новые сервисы, таблицы и фичи добавляем по мере того, как их описывают.

## Структура

```
frontend/            React + Vite + TypeScript
services/account/    Java 21, Spring Boot 4 — пользователи, счета, подписки, лимиты
services/pricing/    Java 21, Spring Boot 4 — расчёт комиссий
docker-compose.yml   всё приложение одной командой
reference-*.png      макеты
```

## База данных

Пока одна общая Postgres (`payments`), у каждого сервиса **своя схема**: `account`, `pricing`. Сервис ходит только в свою схему; чужие данные получает через REST другого сервиса. Позже разнесём по отдельным базам.

Миграции — Flyway, лежат в `services/<сервис>/src/main/resources/db/migration`. Hibernate только проверяет схему (`ddl-auto: validate`), таблицы создаются миграциями.

- `account.users` — пользователь и его подписка (`NONE`, `PREMIUM`, `PREMIUM_PLUS`).
- `account.accounts` — счета: `WALLET` («Мой кошелёк», ровно один у каждого) и `CARD` (у тех, кто оформил карту).
- `account.limits` — лимиты на операции (структура есть, правила добавим позже).
- `pricing.commission_rules` — процент комиссии для пары «вид операции × подписка».

## API

- account `:8081`
  - `GET /api/users/{userId}` — профиль, подписка и счета
  - `GET /api/users/{userId}/accounts` — счета
- pricing `:8082`
  - `POST /api/pricing/commission` `{userId, operationType, amount}` → `{commission, percent, total, subscription, …}`. Подписку берёт из account по REST. `operationType`: `PHONE_TRANSFER`, `CARD_TRANSFER`, `OWN_TRANSFER`.

Фронтенд ходит в сервисы через прокси Vite (`/api/users` → account, `/api/pricing` → pricing). Авторизации пока нет: фронтенд работает от имени демо-пользователя `00000000-0000-0000-0000-000000000001` (сид в миграции account).

## Запуск

Java и Node на компьютер ставить не нужно — всё собирается и работает в Docker.

```bash
docker compose up -d --build   # поднять всё
docker compose logs -f pricing # логи сервиса
docker compose down            # остановить (данные БД сохраняются в volume)
docker compose down -v         # остановить и стереть БД
```

Postgres доступна с компьютера на `localhost:5433` (`payments` / `payments`).

После изменения `package.json` — `docker compose up -d --build --renew-anon-volumes web`.

## Страницы

- `/` — Платежи и переводы. Переключатель «Платежи / Переводы» на этой же странице (`/?tab=transfers`).
- `/transfers/phone`, `/transfers/card`, `/transfers/own` — формы переводов. Через 0,5 с после ввода суммы фронтенд запрашивает комиссию в pricing и показывает итог. Сам перевод пока не выполняется: показываем экран «Перевод отправлен», балансы не меняются.
- `/history` — История операций (пока моковая).
- Навигация — в шапке сверху.
