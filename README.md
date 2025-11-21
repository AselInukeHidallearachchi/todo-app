# Todo App

A full-stack task management application built with Laravel (API) and Next.js (Frontend), containerized with Docker for easy deployment.

## 🎯 Interview Preparation Materials

**Preparing for backend developer interviews?** This repository includes comprehensive interview preparation documentation:

- 📚 **[START_HERE.md](START_HERE.md)** - Begin your interview prep journey here!
- 📖 **[INTERVIEW_PREP.md](INTERVIEW_PREP.md)** - Complete guide covering Laravel, Next.js, Docker (1,594 lines)
- ⚡ **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Cheat sheet with commands, API endpoints, and quick answers (624 lines)
- 📋 **[DOCUMENTATION_SUMMARY.md](DOCUMENTATION_SUMMARY.md)** - Overview of all documentation

**Total: 2,700+ lines of comprehensive interview preparation material covering what you built, how you built it, and how to discuss it in interviews.**

## 📋 Overview

This is a modern todo application that allows users to create, manage, and track their tasks efficiently. The application features user authentication, role-based access control (admin/user), task prioritization, due dates, file attachments, and comprehensive task statistics.

## ✨ Features

### User Management
- **User Registration & Authentication** - Secure user accounts with Laravel Sanctum
- **Role-Based Access Control** - Admin and regular user roles
- **User Preferences** - Customizable user settings
- **Profile Management** - Update user information

### Task Management
- **Create, Read, Update, Delete Tasks** - Full CRUD operations
- **Task Status Tracking** - Pending, In Progress, Completed
- **Priority Levels** - Set task priorities (low, medium, high)
- **Due Dates** - Assign deadlines to tasks
- **Task Statistics** - View completion rates and progress
- **Search & Filter** - Find tasks quickly by various criteria
- **File Attachments** - Attach files to tasks

### Admin Features
- **User Management** - View and manage all users
- **User Status Control** - Activate/deactivate user accounts
- **Role Management** - Assign admin or user roles
- **View All Tasks** - Access to all users' tasks

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER / CLIENT                                  │
│                         (Web Browser / API Client)                          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   │ HTTP/HTTPS
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                         FRONTEND - Next.js (Port 3000)                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  React 19 Components (TypeScript)                                   │    │
│  │  ├─ Pages: Dashboard, Tasks, Login, Register, Settings, Admin       │    │
│  │  ├─ Context: UserContext (State Management)                         │    │
│  │  ├─ UI: Radix UI + Tailwind CSS                                     │    │
│  │  └─ Forms: React Hook Form + Zod Validation                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   │ REST API Calls
                                   │ (axios)
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                        BACKEND API - Laravel (Port 8000)                    |
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  API Routes (/api/v1/*)                                             │    │
│  │  ├─ Authentication Routes (Sanctum Token-based)                     │    │
│  │  │  └─ register, login, logout, me                                  │    │
│  │  ├─ Task Routes (CRUD + Statistics)                                 │    │
│  │  │  └─ index, store, show, update, destroy, statistics              │    │
│  │  ├─ Attachment Routes (File Management)                             │    │
│  │  │  └─ index, store, destroy                                        │    │
│  │  └─ Admin Routes (User Management)                                  │    │
│  │     └─ users CRUD, updateRole, toggleActive                         │    │
│  └─────────────────────────┬───────────────────────────────────────────┘    │
│                            │                                                │
│  ┌─────────────────────────▼───────────────────────────────────────────┐    │
│  │  Middleware Layer                                                   |    │
│  │  ├─ auth:sanctum - Token Authentication                             │   │
│  │  ├─ CheckUserActive - Verify user is active                         │   │
│  │  └─ admin - Admin role verification                                 │   │
│  └─────────────────────────┬───────────────────────────────────────────┘   │
│                            │                                               │
│  ┌─────────────────────────▼───────────────────────────────────────────┐   │
│  │  Controllers (Request Handling)                                     │   │
│  │  ├─ AuthController - User authentication                            │   │
│  │  ├─ TaskController - Task management                                │   │
│  │  ├─ UserController - User & preferences management                  │   │
│  │  └─ AttachmentController - File attachments                         │   │
│  └─────────────────────────┬───────────────────────────────────────────┘   │
│                            │                                               │
│  ┌─────────────────────────▼───────────────────────────────────────────┐   │
│  │  Handlers (Business Logic)                                          │   │
│  │  └─ TaskHandler - Task processing logic                             │   │
│  └─────────────────────────┬───────────────────────────────────────────┘   │
│                            │                                               │
│  ┌─────────────────────────▼───────────────────────────────────────────┐   │
│  │  Models (Eloquent ORM)                                              │   │
│  │  ├─ User (hasMany: tasks, attachments; hasOne: preference)          │   │
│  │  ├─ Task (belongsTo: user; hasMany: attachments)                    │   │
│  │  ├─ Attachment (belongsTo: task, uploaded_by)                       │   │
│  │  └─ UserPreference (belongsTo: user)                                │   │
│  └─────────────────────────┬───────────────────────────────────────────┘   │
└────────────────────────────┼───────────────────────────────────────────────┘
                             │
                             │ PDO/MySQL Driver
                             │
┌────────────────────────────▼─────────────────────────────────────────────────┐
│                        DATABASE - MySQL 8.0 (Port 3307)                      │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │  Tables:                                                            │     │
│  │  ├─ users (id, name, email, password, role, is_active)              │     │
│  │  ├─ tasks (id, user_id, title, description, status, priority,       │     │
│  │  │           due_date, completed_at, timestamps)                    │     │
│  │  ├─ attachments (id, task_id, uploaded_by, file_name, file_path,    │     │
│  │  │              file_size, mime_type, timestamps)                   │     │
│  │  ├─ user_preferences (id, user_id, preferences, timestamps)         │     │
│  │  └─ personal_access_tokens (Sanctum authentication tokens)          │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            DOCKER INFRASTRUCTURE                            │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │  web container │  │  api container │  │  db container  │                 │
│  │  Next.js:3000  │  │  Laravel:8000  │  │  MySQL:3307    │                 │
│  └────────────────┘  └────────────────┘  └────────────────┘                 │
│           │                   │                   │                         │
│           └───────────────────┴───────────────────┘                         │
│                      todo-network (bridge)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication Flow**
   ```
   User → Frontend → POST /api/v1/auth/login → AuthController 
   → User Model → Database → Token Generated (Sanctum) → Response to Frontend
   → Token Stored in localStorage → Subsequent requests include token 
   in Authorization: Bearer {token} header
   ```

2. **Task Creation Flow**
   ```
   User → Frontend Form → POST /api/v1/tasks → auth:sanctum middleware
   → CheckUserActive middleware → TaskController → TaskHandler
   → Task Model → Database → Response → Frontend updates UI
   ```

3. **Admin User Management Flow**
   ```
   Admin → Frontend → GET /api/v1/users → auth:sanctum middleware
   → CheckUserActive middleware → admin middleware → UserController
   → User Model → Database → Response with all users
   ```

### Backend (API)
- **Framework**: Laravel 12.x (PHP 8.2+)
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum (Token-based)
- **API Version**: v1
- **Architecture Pattern**: Controller-Handler pattern

#### Key Components
- **Models**: User, Task, Attachment, UserPreference
- **Controllers**: AuthController, TaskController, UserController, AttachmentController
- **Middleware**: CheckUserActive, Admin role verification
- **Migrations**: Database schema with proper relationships

### Frontend (Web)
- **Framework**: Next.js 15.5.5 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Icons**: Lucide React

#### Key Pages
- `/` - Dashboard with task statistics
- `/login` - User login
- `/register` - User registration
- `/tasks` - Task list view
- `/tasks/new` - Create new task
- `/tasks/[id]` - Task detail view
- `/settings` - User preferences
- `/admin/users` - Admin user management (admin only)

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AselInukeHidallearachchi/todo-app.git
   cd todo-app
   ```

2. **Start the application with Docker**
   ```bash
   ./docker-start.sh
   ```

   This script will:
   - Start the MySQL database container
   - Build and start the Laravel API container
   - Build and start the Next.js web container

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:3307

### Manual Docker Commands

If you prefer to run Docker commands manually:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild containers
docker compose up -d --build
```

### Helper Scripts

- **`docker-start.sh`** - Starts all containers in the correct order
- **`docker-reset.sh`** - Resets containers and volumes
- **`docker-fix.sh`** - Fixes common Docker issues
- **`migrate-db.sh`** - Runs database migrations

## 🗄️ Database Schema

### Users Table
- id, name, email, password
- role (admin/user)
- is_active (boolean)
- timestamps

### Tasks Table
- id, user_id (foreign key)
- title, description
- status (pending/in_progress/completed)
- priority (low/medium/high)
- due_date, completed_at
- timestamps

### Attachments Table
- id, task_id (foreign key), uploaded_by (foreign key)
- file_name, file_path, file_size, mime_type
- timestamps

### User Preferences Table
- id, user_id (foreign key)
- preferences (JSON)
- timestamps

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user (authenticated)
- `POST /api/v1/auth/logout` - Logout (authenticated)

### Tasks
- `GET /api/v1/tasks` - List tasks (with filtering)
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/{id}` - Get task details
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `GET /api/v1/tasks-statistics` - Get task statistics

### Attachments
- `GET /api/v1/tasks/{task}/attachments` - List task attachments
- `POST /api/v1/tasks/{task}/attachments` - Upload attachment
- `DELETE /api/v1/tasks/{task}/attachments/{attachment}` - Delete attachment

### User Preferences
- `GET /api/v1/user/preferences` - Get user preferences
- `PUT /api/v1/user/preferences` - Update user preferences

### Admin Routes (Admin only)
- `GET /api/v1/users` - List all users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user details
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `PATCH /api/v1/users/{id}/role` - Update user role
- `PATCH /api/v1/users/{id}/toggle` - Toggle user active status

## 🛠️ Development

### Backend Development

```bash
# Enter the API container
docker exec -it todo-api bash

# Run migrations
php artisan migrate

# Run tests
php artisan test

# Clear cache
php artisan cache:clear

# Generate API documentation
php artisan route:list
```

### Frontend Development

```bash
# Enter the web container
docker exec -it todo-web sh

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### Running Without Docker

#### Backend (API)
```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### Frontend (Web)
```bash
cd web
npm install
npm run dev
```

## 🔒 Security Features

- **Token-based Authentication** - Laravel Sanctum for API authentication
- **Password Hashing** - Bcrypt password encryption
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **Middleware Protection** - Route-level authentication and authorization
- **User Status Verification** - Active user check for all authenticated routes
- **Role-based Authorization** - Admin-only routes protected

## 📦 Docker Configuration

### Services
- **db** - MySQL 8.0 database
  - Port: 3307 (host) → 3306 (container)
  - Volume: Persistent data storage
  - Health checks enabled

- **api** - Laravel API
  - Port: 8000 (host) → 80 (container)
  - Depends on: db
  - Auto-restart enabled

- **web** - Next.js frontend
  - Port: 3000 (host) → 3000 (container)
  - Depends on: api
  - Hot module reloading enabled

### Environment Variables

**API (.env)**
- `DB_HOST=db`
- `DB_DATABASE=todo`
- `DB_USERNAME=root`
- `DB_PASSWORD=root`
- `APP_KEY=base64:iB8ndzIL9taiDW4WDLSq7NHmGVarmvy+p4P+8+BPJgk=`
- `APP_URL=http://localhost:8000`

**Web**
- `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1`
- `API_INTERNAL_URL=http://todo-api:80`

## 🧪 Testing

### Backend Tests
```bash
cd api
php artisan test
```

The API includes:
- Feature tests for API endpoints
- Unit tests for business logic
- Example tests in `tests/Feature/` and `tests/Unit/`

### Frontend Tests
Currently using ESLint for code quality:
```bash
cd web
npm run lint
```

## 📝 Project Structure

```
todo-app/
├── api/                    # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   └── Handlers/
│   ├── config/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── tests/
│
├── web/                    # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── tasks/
│   │   ├── admin/
│   │   ├── login/
│   │   └── register/
│   ├── components/        # React components
│   │   └── ui/           # Reusable UI components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
│
├── docker-compose.yml     # Docker orchestration
├── docker-compose.prod.yml
├── docker-start.sh        # Helper script to start app
├── docker-reset.sh        # Helper script to reset
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- Asel Inuke Hidallearachchi - [GitHub](https://github.com/AselInukeHidallearachchi)

## 🙏 Acknowledgments

- Laravel Framework - Backend API
- Next.js - Frontend framework
- Radix UI - Component primitives
- Tailwind CSS - Styling framework
- Docker - Containerization

## 📞 Support

## 🚀 How to Run Tests

### Run All Tests (Inside Docker)
```bash
docker compose exec api php artisan test tests/Feature
```

### Run Specific Test File
```bash
docker compose exec api php artisan test tests/Feature/AuthenticationTest.php
```

### Run Specific Test
```bash
docker compose exec api php artisan test tests/Feature/AuthenticationTest.php --filter="user_can_register"
```

### Run with Coverage
```bash
docker compose exec api php artisan test tests/Feature --coverage
```


For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ using Laravel and Next.js
