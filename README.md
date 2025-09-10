## My‑Blog — современный блог с Firebase, лайками и профилями

Лёгкое и быстрое блого‑приложение: авторизация, создание постов, комментарии и лайки в реальном времени. Упор на удобство, чистую архитектуру и понятный UX.

[![My Blog — Live Demo](https://github.com/Vo1ka/my-blog/blob/master/src/img/preview.png)](https://my-blog-aobktpfvw-vo1kas-projects.vercel.app/ "Открыть демо на Vercel")

---

### Содержание
-     [Возможности](#возможности)
-     [Быстрый старт](#быстрый-старт)
-     [Переменные окружения](#переменные-окружения)
-     [Технологии](#технологии)
-     [Планы](#планы)
-     [Лицензия](#лицензия)

---

## Возможности

-     Авторизация
  -   Firebase Auth / JWT‑decode; защита приватных маршрутов и редиректы.
-     Посты
  -   Создание, редактирование, удаление; черновики и предпросмотр обложки.
  -   Чистые даты и форматирование через date‑fns.
-     Лайки и комментарии
  -   Обновления в реальном времени на базе Cloud Firestore.
  -   Счётчики, сортировка по активности.
-     Профиль пользователя
-     Темы: ThemeProvider для смены на светлую/темную тему.
-     Поиск и навигация
  -   Маршруты на React Router 7, фильтры, пагинация.
-     Производительность и DX
  -   Redux Toolkit store, аккуратные слайсы и сервис‑слой; стили на Sass.

---

## Быстрый старт

```bash
git clone https://github.com/Vo1ka/my-blog.git
cd my-blog
npm i
npm run dev
```

Откройте http://localhost:5173

---

## Переменные окружения

Создайте файл .env в корне проекта и добавьте ключи Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

При деплое на Vercel добавьте эти переменные в Project Settings → Environment Variables.

---

## Технологии

-     React 19, React DOM 19
-     Vite 6 + @vitejs/plugin-react
-     React Router DOM 7
-     Firebase 11 (Auth, Firestore) + @firebase/firestore 4
-     Redux Toolkit 2, React Redux 9
-     Axios 1
-     date‑fns 4
-     jwt‑decode 4
-     React Icons 5
-     Sass 1

Инфраструктура и инструменты:
-     TypeScript 5.7
-     ESLint 9 (+ eslint‑plugin‑react‑hooks, eslint‑plugin‑react‑refresh, @eslint/js, globals, typescript‑eslint)
-     json‑server и json‑server‑auth для локальных экспериментов
-     Vite scripts

---

## Планы

-     Фикс бага с отображением поста
-     Черновики и автосохранение редактора
-     Уведомления о новых комментариях
-     Роли (author/mod) и модерация контента
-     Таб “Избранное” и персональная лента
-     Тестирование (React Testing Library / Cypress) и CI‑бейджи

---

## Лицензия

MIT — используйте и модифицируйте свободно. Если проект оказался полезен, поддержите звёздой ⭐

---

Кликабельное превью (добавьте своё изображение и замените ссылку на демо):

[My‑Blog — Live Demo](https://my-blog-aobktpfvw-vo1kas-projects.vercel.app/)

