# Quick Reference Guide - Todo App

## 🚀 Quick Commands

### Docker Commands
```bash
# Start the application
./docker-start.sh
# OR
docker compose up -d

# View logs
docker compose logs -f
docker compose logs -f api    # Just API logs
docker compose logs -f web    # Just web logs

# Stop everything
docker compose down

# Reset everything (including volumes)
docker compose down -v

# Rebuild containers
docker compose up -d --build

# Enter a container
docker compose exec api bash   # Laravel container
docker compose exec web sh     # Next.js container
docker compose exec db mysql -uroot -proot  # MySQL
```

### Laravel Commands (Inside API Container)
```bash
# Enter container
docker compose exec api bash

# Run migrations
php artisan migrate
php artisan migrate:fresh      # Drop all tables and re-run
php artisan migrate:rollback   # Rollback last batch

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# View routes
php artisan route:list

# Run tests
php artisan test
php artisan test --filter=TaskTest

# Create components
php artisan make:model Task
php artisan make:controller TaskController
php artisan make:migration create_tasks_table
php artisan make:request CreateTaskRequest
php artisan make:resource TaskResource
```

### Next.js Commands (Inside Web Container)
```bash
# Enter container
docker compose exec web sh

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Development (if not using Docker)
npm run dev
```

---

## 📁 Project Structure

```
todo-app/
├── api/                          # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # Request handlers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── TaskController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Middleware/       # Request filters
│   │   │   │   ├── CheckUserActive.php
│   │   │   │   └── EnsureAdmin.php
│   │   │   ├── Requests/         # Validation
│   │   │   │   ├── CreateTaskRequest.php
│   │   │   │   └── LoginRequest.php
│   │   │   ├── Resources/        # API response formatting
│   │   │   │   ├── TaskResource.php
│   │   │   │   └── UserResource.php
│   │   │   └── Responses/
│   │   │       └── ApiResponse.php
│   │   ├── Models/               # Database models
│   │   │   ├── User.php
│   │   │   ├── Task.php
│   │   │   ├── Attachment.php
│   │   │   └── UserPreference.php
│   │   ├── Handlers/             # Business logic
│   │   │   ├── TaskHandler.php
│   │   │   └── AuthHandler.php
│   │   └── Services/             # Reusable services
│   │       ├── TaskService.php
│   │       ├── AuthService.php
│   │       └── AttachmentService.php
│   ├── database/
│   │   └── migrations/           # Database schema versions
│   ├── routes/
│   │   └── api.php              # API routes definition
│   └── tests/                   # PHPUnit tests
│
├── web/                         # Next.js Frontend
│   ├── app/                     # App Router pages
│   │   ├── page.tsx             # Dashboard (/)
│   │   ├── login/page.tsx       # Login page
│   │   ├── register/page.tsx    # Register page
│   │   ├── tasks/
│   │   │   ├── page.tsx         # Task list
│   │   │   ├── new/page.tsx     # Create task
│   │   │   └── [id]/page.tsx    # Task detail
│   │   └── admin/
│   │       └── users/page.tsx   # Admin user management
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   └── task/                # Task-specific components
│   ├── context/                 # React Context
│   │   └── ToastContext.tsx
│   ├── lib/                     # Utilities
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth helpers
│   │   └── utils.ts            # General utilities
│   └── types/                   # TypeScript types
│
├── docker-compose.yml           # Docker orchestration
├── docker-start.sh              # Helper script to start
└── README.md                    # Project documentation
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login (get token)
GET    /api/v1/auth/me            # Get current user
POST   /api/v1/auth/logout        # Logout (revoke token)
```

### Tasks (Authenticated)
```
GET    /api/v1/tasks              # List tasks (filterable)
POST   /api/v1/tasks              # Create task
GET    /api/v1/tasks/{id}         # Get task
PUT    /api/v1/tasks/{id}         # Update task
DELETE /api/v1/tasks/{id}         # Delete task
GET    /api/v1/tasks-statistics   # Get statistics
```

### Attachments (Authenticated)
```
GET    /api/v1/tasks/{task}/attachments              # List attachments
POST   /api/v1/tasks/{task}/attachments              # Upload attachment
DELETE /api/v1/tasks/{task}/attachments/{attachment} # Delete attachment
```

### User Preferences (Authenticated)
```
GET    /api/v1/user/preferences   # Get preferences
PUT    /api/v1/user/preferences   # Update preferences
```

### Admin Routes (Admin Only)
```
GET    /api/v1/users              # List all users
POST   /api/v1/users              # Create user
GET    /api/v1/users/{id}         # Get user
PUT    /api/v1/users/{id}         # Update user
DELETE /api/v1/users/{id}         # Delete user
PATCH  /api/v1/users/{id}/role    # Update role
PATCH  /api/v1/users/{id}/toggle  # Toggle active status
```

---

## 💾 Database Schema

### Users Table
```sql
id              BIGINT (PK)
name            VARCHAR(255)
email           VARCHAR(255) UNIQUE
password        VARCHAR(255)
role            ENUM('admin', 'user')
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tasks Table
```sql
id              BIGINT (PK)
user_id         BIGINT (FK → users.id)
title           VARCHAR(255)
description     TEXT
status          ENUM('pending', 'in_progress', 'completed')
priority        ENUM('low', 'medium', 'high')
due_date        DATE
completed_at    TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Attachments Table
```sql
id              BIGINT (PK)
task_id         BIGINT (FK → tasks.id)
uploaded_by     BIGINT (FK → users.id)
file_name       VARCHAR(255)
file_path       VARCHAR(255)
file_size       BIGINT
mime_type       VARCHAR(100)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### User Preferences Table
```sql
id              BIGINT (PK)
user_id         BIGINT (FK → users.id)
preferences     JSON
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 🔑 Common Code Snippets

### Laravel - Query Examples
```php
// Simple queries
$tasks = Task::all();
$task = Task::find($id);
$tasks = Task::where('status', 'pending')->get();

// With relationships (Eager loading)
$tasks = Task::with('user')->get();
$tasks = Task::with(['user', 'attachments'])->get();

// Pagination
$tasks = Task::paginate(15);

// Filtering
$tasks = Task::where('user_id', $userId)
    ->where('status', 'pending')
    ->orderBy('due_date', 'asc')
    ->get();

// Create
$task = Task::create([
    'title' => 'New Task',
    'status' => 'pending',
    'user_id' => $userId,
]);

// Update
$task->update(['status' => 'completed']);

// Delete
$task->delete();
```

### Laravel - Response Helpers
```php
// Success response
return response()->json([
    'success' => true,
    'data' => $data,
    'message' => 'Success'
], 200);

// Error response
return response()->json([
    'success' => false,
    'message' => 'Error message'
], 400);

// Using Resource
return TaskResource::collection($tasks);
return new TaskResource($task);
```

### Next.js - API Calls
```typescript
// GET request
const response = await api.get<ApiResponse<Task[]>>('/tasks');
const tasks = response.data.data;

// POST request
const response = await api.post('/tasks', {
  title: 'New Task',
  status: 'pending',
});

// PUT request
await api.put(`/tasks/${id}`, updatedData);

// DELETE request
await api.delete(`/tasks/${id}`);

// With error handling
try {
  const response = await api.post('/tasks', data);
  console.log(response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data.message);
  }
}
```

### Next.js - Server vs Client Components
```typescript
// Server Component (Default)
async function ServerPage() {
  const data = await fetchData(); // Runs on server
  return <ClientComponent data={data} />;
}

// Client Component
'use client';

function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  return <div onClick={() => setState(newValue)} />;
}
```

---

## 🛡️ Middleware Stack

### API Request Flow
```
HTTP Request
    ↓
OPTIONS Pre-flight (CORS)
    ↓
Route Matching
    ↓
auth:sanctum (Verify token)
    ↓
CheckUserActive (Check if user active)
    ↓
admin (Check admin role - if admin route)
    ↓
Controller
    ↓
Handler/Service
    ↓
Model
    ↓
Database
    ↓
Resource (Format response)
    ↓
JSON Response
```

---

## 🎨 Frontend Pages & Routes

```
/                          → Dashboard (Server Component)
/login                     → Login page (Client Component)
/register                  → Registration page (Client Component)
/tasks                     → Task list (Server + Client)
/tasks/new                 → Create task (Client Component)
/tasks/[id]                → Task details (Server + Client)
/settings                  → User settings (Client Component)
/admin/users               → User management (Admin only)
```

---

## 🔐 Environment Variables

### API (.env)
```env
APP_NAME=Todo-API
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=todo
DB_USERNAME=root
DB_PASSWORD=root

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DRIVER=cookie
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
API_INTERNAL_URL=http://todo-api:80
```

---

## 🧪 Testing

### Run Tests
```bash
# Laravel tests
docker compose exec api php artisan test

# Specific test file
docker compose exec api php artisan test tests/Feature/TaskTest.php

# With coverage
docker compose exec api php artisan test --coverage

# Frontend linting
docker compose exec web npm run lint
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if DB is healthy
docker compose ps

# Check DB logs
docker compose logs db

# Manually connect to DB
docker compose exec db mysql -uroot -proot todo

# Re-run migrations
docker compose exec api php artisan migrate:fresh
```

### Clear All Cache
```bash
# Laravel
docker compose exec api php artisan cache:clear
docker compose exec api php artisan config:clear
docker compose exec api php artisan route:clear
docker compose exec api php artisan view:clear

# Next.js
docker compose exec web rm -rf .next
docker compose restart web
```

### Permission Issues
```bash
# Fix Laravel storage permissions
docker compose exec api chmod -R 775 storage bootstrap/cache
docker compose exec api chown -R www-data:www-data storage bootstrap/cache
```

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or change ports in docker-compose.yml
```

---

## 📊 Common Interview Questions - Quick Answers

**Q: What's the tech stack?**
> Laravel 12, Next.js 15, MySQL 8, Docker, TypeScript, Tailwind CSS

**Q: How does authentication work?**
> Token-based auth with Laravel Sanctum. User logs in, receives token, stores in localStorage, includes in Authorization header for API calls.

**Q: What's your API architecture?**
> RESTful API with MVC + Handler/Service pattern. Controllers handle requests, Handlers contain business logic, Services provide reusable operations.

**Q: How do you handle CORS?**
> Configured in Laravel config/cors.php with allowed origins, methods, and headers. Middleware handles preflight OPTIONS requests.

**Q: What's the difference between Server and Client Components in Next.js?**
> Server Components run on server (better SEO, security), Client Components run in browser (interactivity, hooks, browser APIs).

**Q: How do you prevent N+1 queries?**
> Eager loading with `with()` method: `Task::with('user')->get()` loads all users in 2 queries instead of N+1.

**Q: How does Docker help?**
> Consistent environment across dev/prod, easy setup with docker-compose, isolated services, reproducible builds.

**Q: What are Eloquent relationships?**
> ORM relationships: hasMany, belongsTo, hasOne, belongsToMany. Defines how models relate to each other.

**Q: How do you validate input?**
> Backend: FormRequest classes with validation rules. Frontend: Zod schemas with React Hook Form.

**Q: What's middleware?**
> Functions that run before/after controller. Used for auth, logging, CORS, rate limiting, etc.

---

## 🎯 Key Features You Built

✅ **Authentication System**
- User registration & login
- Token-based auth with Sanctum
- Password hashing
- Session management

✅ **Authorization**
- Role-based access (admin/user)
- Middleware protection
- User status checking

✅ **Task Management**
- Full CRUD operations
- Status tracking (pending/in_progress/completed)
- Priority levels
- Due dates
- Task statistics

✅ **File Uploads**
- Attachment support
- File validation
- Storage management

✅ **Admin Panel**
- User management
- Role assignment
- User activation/deactivation

✅ **Modern Frontend**
- Server-side rendering
- Type-safe with TypeScript
- Responsive design
- Form validation

✅ **DevOps**
- Dockerized application
- Multi-container setup
- Health checks
- Easy deployment

---

## 📈 Technologies & Concepts Demonstrated

### Backend
- ✅ Laravel MVC
- ✅ Eloquent ORM
- ✅ RESTful API design
- ✅ Middleware
- ✅ Authentication (Sanctum)
- ✅ Authorization
- ✅ Database migrations
- ✅ Validation
- ✅ API Resources
- ✅ Service/Handler pattern

### Frontend
- ✅ Next.js App Router
- ✅ Server Components
- ✅ Client Components
- ✅ TypeScript
- ✅ React Hooks
- ✅ Context API
- ✅ Form validation (Zod)
- ✅ Tailwind CSS
- ✅ Radix UI

### DevOps
- ✅ Docker
- ✅ Docker Compose
- ✅ Multi-container apps
- ✅ Container networking
- ✅ Volumes
- ✅ Health checks
- ✅ Environment management

### General
- ✅ Git version control
- ✅ REST principles
- ✅ CORS handling
- ✅ Database design
- ✅ Clean architecture
- ✅ Security best practices

---

**Quick Tip for Interviews:**
Always be ready to explain:
1. **What** you built
2. **How** you built it
3. **Why** you made specific technical decisions
4. **Challenges** you faced and how you solved them
