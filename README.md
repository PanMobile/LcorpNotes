# 📝 LCorpNotes

<div align="center">

![LCorpNotes Logo](https://img.shields.io/badge/LCorpNotes-v1.0.0-blueviolet?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript)

**(Почти) Современный фуллстак-сайт для создания и организации 
заметок с красивым дизайном**

[Возможности](#-возможности) • [Технологии](#-технологический-стек) • [Установка](#-установка) • [Использование](#-использование) • [API](#-api-документация)

</div>

---

## Возможности

### 📂 Управление заметками (По сути - CRUD)
-  **Создание заметок** - Создание заметок с заголовком и содержимым
-  **Папки** - Создание заметок внутри папок для удобства
-  **Избранное** - Отметка важных заметок звездочкой для быстрого доступа
- ️ **Редактирование** - Возможность открыть модальное окно для редактирования
-  **Удаление** - Удаление заметок и папок с подтверждением

### 🔐 Аутентификация
-  **Email/Пароль** - Классическая регистрация/вход
-  **Google OAuth** - Быстрый вход через Google аккаунт
-  **Firebase Auth** - Интеграция с Firebase для OAuth провайдеров (для пункт выше)
-  **JWT токены** - Безопасная авторизация с 6-часовыми токенами

### 👤 Профиль пользователя
-  **Редактирование имени** - Изменение отображаемого имени
-  **Смена пароля** - Безопасное изменение пароля
-  **Выход** - Безопасный выход из аккаунта
-  **Удаление аккаунта** - Полное удаление с каскадным удалением всех данных

---

## Cтек

### 🖼️ Frontend

- Main Lang: TypeScript (JavaScript, но круче) (но не лучше Kotlin)
- UI Library: React (Jetpack Compose, но хуже)
- Navigation: React Router (Compose Navigation, но хуже)
- UI Design Framework Tailwind CSS (Jetpack Compose, но хуже)
- Authentication: Firebase Auth (== OAuth Google)


### ⚒️ Backend

- Main Lang: Java (Kotlin, но хуже)
- Server framework: Spring Boot (Ktor, но больше) 
- Framework Module: Spring Security (Ktor Auth)
- Framework Module: Spring Data JPA (Ktor Postgres)
- Database SQL Dialect: SQLite 
- Auth: JWT (JSON Web Tokens)
- SDK: Firebase Admin SDK (Верификация Firebase токенов)


### 📊 База данных
```sql
SQLite 3.44.1.0 - Схема базы данных

users
  - id (PK, AUTO_INCREMENT)
  - email (UNIQUE, NOT NULL)
  - name (NOT NULL)
  - password_hash (NOT NULL)
  - created_at (TIMESTAMP)

folders
  - id (PK, AUTO_INCREMENT)
  - name (NOT NULL)
  - owner_id (FK → users.id, CASCADE DELETE)
  - created_at (TIMESTAMP)

notes
  - id (PK, AUTO_INCREMENT)
  - title (NOT NULL)
  - content (TEXT)
  - is_favorite (BOOLEAN)
  - folder_id (FK → folders.id, SET NULL)
  - owner_id (FK → users.id, CASCADE DELETE)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

---

## 📦 Установка

### Предварительные требования

```bash
# Backend
Java 17 или выше
Maven 3.8+

# Frontend
Node.js 18+
npm или yarn
```

### 1. Клонирование репозитория

```bash
git clone https://github.com/PanMobile/LcorpNotes.git
cd lcorpnotes
```

### 2. Настройка проекта

```bash
# Настройку проекта делать не нужно
# Внутри репозитория все необходимые модули и зависимости
```

### 3. Запуска бекенда
Перейдите в папку с бекендом (notes-backend) и внутри запустите Maven скрипт 
```bash
cd notes-backend
mvn spring-boot:run

# Или сборка JAR
mvn clean package
java -jar target/notes-backend-1.0.0.jar
```

Backend будет доступен на `http://localhost:5000`

### 4. Запуск фронтенда
Перейдите в root директорию проекта и запустите NPM скрипт
```bash
cd ..
npm run dev
```

Frontend будет доступен на `http://localhost:5173`
---

## 📡 API Документация

### Базовый URL
```
http://localhost:5000/api
```

### Аутентификация

#### Регистрация
```http
POST /auth/register
Content-Type: application/json

{
  "email": "AngelicaMyWaifu@gmail.com",
  "name": "Roland",
  "password": "PasswordTest17"
}

Response: 201 Created
{
  "message": "Registered"
}
```

#### Вход (Email/Password)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "AngelicaMyWaifu@gmail.com",
  "password": "PasswordTest17"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "AngelicaMyWaifu@gmail.com",
    "name": "Roland"
  }
}
```

#### Вход через Firebase (Google)
```http
POST /auth/firebase-login
Content-Type: application/json

{
  "idToken": "firebase_id_token_here"
}

Response: 200 OK
{
  "message": "Firebase authentication successful",
  "token": "firebase_id_token_here",
  "user": {
    "id": 1,
    "email": "AngelicaMyWaifu@gmail.com",
    "name": "Roland"
  }
}
```

### Папки

**Все запросы требуют заголовок:** `Authorization: Bearer {token}`

#### Получить все папки
```http
GET /folders

Response: 200 OK
[
  {
    "id": 1,
    "name": "Work",
    "createdAt": "2025-01-15T10:30:00"
  }
]
```

#### Создать папку
```http
POST /folders
Content-Type: application/json

{
  "name": "Personal"
}

Response: 201 Created
{
  "id": 2,
  "name": "Personal",
  "createdAt": "2025-01-15T11:00:00"
}
```

#### Переименовать папку
```http
PUT /folders/{folderId}
Content-Type: application/json

{
  "name": "Work Projects"
}

Response: 200 OK
{
  "message": "Updated"
}
```

#### Удалить папку
```http
DELETE /folders/{folderId}

Response: 200 OK
{
  "message": "Deleted"
}
```

### Заметки

#### Получить заметки
```http
GET /notes
GET /notes?folderId=1  // Заметки конкретной папки

Response: 200 OK
[
  {
    "id": 1,
    "title": "Meeting Notes",
    "content": "Discussion points...",
    "isFavorite": false,
    "folderId": 1,
    "updatedAt": "2025-01-15T14:30:00"
  }
]
```

#### Создать заметку
```http
POST /notes
Content-Type: application/json

{
  "title": "New Note",
  "content": "Content here",
  "folderId": 1  // optional
}

Response: 201 Created
{
  "id": 2,
  "title": "New Note",
  "content": "Content here",
  "isFavorite": false,
  "folderId": 1,
  "updatedAt": "2025-01-15T15:00:00"
}
```

#### Обновить заметку
```http
PUT /notes/{noteId}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "folderId": null  // переместить в "без папки"
}

Response: 200 OK
{
  "id": 2,
  "title": "Updated Title",
  "content": "Updated content",
  "isFavorite": false,
  "folderId": null,
  "updatedAt": "2025-01-15T15:30:00"
}
```

#### Удалить заметку
```http
DELETE /notes/{noteId}

Response: 200 OK
{
  "message": "Deleted"
}
```

#### Переключить избранное
```http
POST /notes/{noteId}/favorite

Response: 200 OK
{
  "id": 2,
  "isFavorite": true
}
```

### Профиль

#### Получить профиль
```http
GET /profile

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Обновить имя
```http
PUT /profile
Content-Type: application/json

{
  "name": "Jane Doe"
}

Response: 200 OK
{
  "message": "Name changed success!"
}
```

#### Сменить пароль
```http
POST /profile/change-password
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}

Response: 200 OK
{
  "message": "Password change GREAT success!"
}
```

#### Удалить аккаунт
```http
DELETE /profile

Response: 200 OK
{
  "message": "Account deleted :("
}
```

---

## 🎨 Структура проекта

```
lcorpnotes/
├── backend-java/                      # Java Spring Boot Backend
│   ├── src/main/java/com/lcorp/notes/
│   │   ├── NotesApplication.java     
│   │   ├── config
│   │   ├── controller
│   │   ├── dto                     
│   │   ├── model
│   │   ├── repository
│   │   └── security
│   ├── src/main/resources
│   ├── pom.xml                        # Maven зависимости
│   └── lcorpnotes.sqlite3            # База данных SQLite
│
├── frontend/                          # React TypeScript Frontend
│   ├── src/
│   │   ├── auth/
│   │   ├── components/               # Переиспользуемые компоненты
│   │   ├── pages/
│   │   ├── models/
│   │   ├── firebase.ts               # Firebase конфигурация
│   │   ├── App.tsx                   # Главный компонент
│   │   └── main.tsx                  # Entry point
│   │
└── README.md                          # Этот файл
```

---

## 🔒 Безопасность

### Реализованные меры безопасности

1. **Хеширование паролей** - BCrypt с автоматической солью
2. **JWT токены** - 256-битные секретные ключи, 6-часовой срок действия
3. **CORS защита** - Настроенный CORS для защиты от XSS
4. **SQL Injection защита** - JPA/Hibernate параметризованные запросы
5. **Каскадное удаление** - Автоматическое удаление связанных данных
6. **Firebase верификация** - Проверка подлинности Firebase токенов
7. **Аутентификация на уровне метода** - `@PreAuthorize` аннотации

---



<div align="center">

**Сделано без ❤️ PanMobile'ом (Mobile stack лучше)**

[⬆ Наверх](#-lcorpnotes)

</div>