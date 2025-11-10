# 🎯 Todo App - Complete Interview Preparation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Frontend Technical Questions](#frontend-technical-questions)
4. [Backend Technical Questions](#backend-technical-questions)
5. [Database & Data Modeling](#database--data-modeling)
6. [API Design & REST Principles](#api-design--rest-principles)
7. [Authentication & Security](#authentication--security)
8. [Docker & DevOps](#docker--devops)
9. [System Design Questions](#system-design-questions)
10. [Coding Challenges](#coding-challenges)
11. [Project-Specific Questions](#project-specific-questions)
12. [Behavioral Questions](#behavioral-questions)
13. [Best Practices Implemented](#best-practices-implemented)

---

## 🎨 Project Overview

### What is this Todo App?
A full-stack task management application with user authentication, role-based access control (RBAC), and file attachment capabilities. Built with modern web technologies following industry best practices.

### Key Features
- ✅ User authentication (register/login/logout)
- ✅ Role-based access control (Admin/User)
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Task filtering by status, priority, and due date
- ✅ File attachments for tasks
- ✅ User preferences management
- ✅ Task statistics dashboard
- ✅ Dark/light theme support
- ✅ Responsive design
- ✅ Admin panel for user management

---

## 🏗️ Architecture & Technology Stack

### Overall Architecture
- **Architecture Pattern**: Three-tier architecture (Presentation, Business Logic, Data)
- **Design Pattern**: MVC (Model-View-Controller) on backend
- **Communication**: RESTful API
- **Containerization**: Docker & Docker Compose

### Frontend Stack
- **Framework**: Next.js 15.5.5 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: React Hooks & Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns, react-day-picker
- **Theme**: next-themes (dark/light mode)
- **Icons**: Lucide React

### Backend Stack
- **Framework**: Laravel 12 (PHP 8.2+)
- **Authentication**: Laravel Sanctum (Token-based)
- **Database**: MySQL 8.0
- **ORM**: Eloquent
- **API**: RESTful with versioning (v1)
- **Testing**: PHPUnit
- **Code Quality**: Laravel Pint

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL 8.0 container
- **Web Server**: PHP built-in server / Apache
- **Port Mapping**: 
  - Frontend: 3000
  - Backend API: 8000
  - Database: 3307 (host) → 3306 (container)

---

## 💻 Frontend Technical Questions

### React & Next.js Questions

**Q1: What is Next.js and why did you use it over Create React App?**
**A:** Next.js is a React framework that provides:
- **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** for better SEO and performance
- **File-based routing** - no need for react-router configuration
- **API routes** - can create backend endpoints within the same project
- **Automatic code splitting** - better performance
- **Image optimization** out of the box
- **Built-in CSS and Sass support**

In this project, we use Next.js 15 with the App Router (not Pages Router) for modern React Server Components support.

**Q2: Explain the difference between Client Components and Server Components in Next.js 13+**
**A:** 
- **Server Components** (default in App Router):
  - Render on the server
  - Can directly access backend resources
  - Reduce client-side JavaScript bundle
  - Cannot use React hooks like useState, useEffect
  - Better for data fetching and SEO

- **Client Components** (marked with 'use client'):
  - Render on the client
  - Can use React hooks and browser APIs
  - Enable interactivity
  - Required for event handlers

Example from our project:
```typescript
// TaskCard.tsx has 'use client' because it uses onClick handlers
'use client'
import { useState } from 'react'
// ... interactive component
```

**Q3: How does TypeScript improve your React code?**
**A:**
- **Type Safety**: Catches errors at compile-time, not runtime
- **Better IDE Support**: Autocomplete, refactoring, navigation
- **Self-documenting**: Types serve as inline documentation
- **Easier Refactoring**: Changes propagate through the codebase
- **Improved Team Collaboration**: Clear interfaces and contracts

Example:
```typescript
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
}
```

**Q4: What is React Hook Form and why use it over traditional state management?**
**A:** React Hook Form is a performant form library:
- **Better Performance**: Minimizes re-renders (uncontrolled components)
- **Less Boilerplate**: Less code than managing state manually
- **Built-in Validation**: Integrates with Zod schema validation
- **Better UX**: Easy error handling and field-level validation

Example from the project:
```typescript
const form = useForm<TaskFormValues>({
  resolver: zodResolver(taskSchema),
  defaultValues: {
    title: '',
    status: 'todo',
    priority: 'medium',
  }
})
```

**Q5: Explain the purpose of Zod in this project**
**A:** Zod is a TypeScript-first schema validation library:
- **Runtime Validation**: Validates data at runtime, not just compile-time
- **Type Inference**: Automatically infers TypeScript types from schemas
- **Error Messages**: Provides clear, customizable error messages
- **Composable**: Can build complex schemas from simple ones

Example:
```typescript
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.date().optional(),
})
```

**Q6: How do you handle API calls in this Next.js application?**
**A:** We use Axios with:
1. **Centralized Configuration**: Base URL and headers configured once
2. **Token Management**: Interceptors for adding auth tokens
3. **Error Handling**: Global error interceptors
4. **Type Safety**: Response types defined with TypeScript

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Q7: What is Tailwind CSS and what are its advantages?**
**A:** Tailwind CSS is a utility-first CSS framework:
- **Rapid Development**: No need to write custom CSS
- **Consistency**: Design system enforced through utilities
- **Small Bundle Size**: Purges unused CSS in production
- **Responsive Design**: Built-in responsive utilities
- **Customization**: Highly configurable via config file
- **No Naming Conflicts**: No need to name CSS classes

Example:
```tsx
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
  Click Me
</button>
```

**Q8: Explain the Context API usage for theme management**
**A:** We use `next-themes` which leverages Context API:
- **Global State**: Theme accessible throughout the app
- **Persistence**: Theme choice saved to localStorage
- **SSR-Safe**: Prevents hydration mismatches
- **System Preference**: Respects user's OS theme preference

```typescript
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

---

## 🔧 Backend Technical Questions

### Laravel & PHP Questions

**Q9: What is Laravel and why is it popular?**
**A:** Laravel is a PHP web framework known for:
- **Elegant Syntax**: Clean, expressive code
- **MVC Architecture**: Separation of concerns
- **Built-in Features**: Authentication, routing, ORM, queues, etc.
- **Eloquent ORM**: Intuitive database interactions
- **Artisan CLI**: Powerful command-line tools
- **Large Ecosystem**: Packages, community support
- **Security Features**: CSRF protection, SQL injection prevention, password hashing

**Q10: Explain the MVC pattern in Laravel**
**A:**
- **Model**: Represents data and business logic (e.g., `Task.php`, `User.php`)
  - Eloquent models interact with database
  - Define relationships, attributes, casting
  
- **View**: Presentation layer (in our case, Next.js frontend)
  - In traditional Laravel, Blade templates
  
- **Controller**: Handles HTTP requests, coordinates Model and View
  - `TaskController.php` receives requests
  - Delegates to handlers/services
  - Returns JSON responses

Example flow:
```
Request → Route → Controller → Handler/Service → Model → Database
                                                      ↓
Response ← Controller ← Handler/Service ← Model ← Database
```

**Q11: What is Eloquent ORM and how is it used in this project?**
**A:** Eloquent is Laravel's ORM (Object-Relational Mapping):
- **Active Record Pattern**: Each model represents a table
- **Fluent Query Builder**: Chainable query methods
- **Relationships**: Easy definition of table relationships

Example from `Task.php`:
```php
class Task extends Model {
    protected $fillable = ['title', 'description', 'status', 'priority', 'due_date'];
    protected $casts = ['due_date' => 'date'];
    
    public function user() { 
        return $this->belongsTo(User::class); 
    }
    
    public function attachments() { 
        return $this->hasMany(Attachment::class); 
    }
}
```

Query examples:
```php
// Get all tasks for a user
$tasks = Task::where('user_id', $userId)->get();

// Eager loading relationships
$task = Task::with('attachments')->find($id);

// Create a task
Task::create([
    'title' => 'New Task',
    'user_id' => auth()->id()
]);
```

**Q12: Explain Laravel Sanctum and how authentication works**
**A:** Laravel Sanctum provides:
- **Token-based authentication** for SPAs
- **Simple API token system**
- **CORS and CSRF protection**

Flow in our app:
1. **Register/Login**: User provides credentials
2. **Token Generation**: Sanctum creates a personal access token
3. **Token Storage**: Frontend stores token in localStorage
4. **Authenticated Requests**: Token sent in `Authorization: Bearer {token}` header
5. **Middleware Verification**: `auth:sanctum` middleware validates token

```php
// Login
$token = $user->createToken('auth-token')->plainTextToken;

// Protect routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('tasks', TaskController::class);
});

// Get authenticated user
$user = $request->user();
```

**Q13: What are Laravel Migrations and why are they important?**
**A:** Migrations are version control for your database:
- **Schema Definition**: Define table structure in PHP
- **Version Control**: Track database changes over time
- **Team Collaboration**: Share schema changes via Git
- **Rollback Support**: Can revert changes
- **Environment Consistency**: Same schema across dev/staging/prod

Example:
```php
public function up(): void {
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title', 120);
        $table->enum('status', ['todo','in_progress','completed']);
        $table->timestamps();
    });
}
```

Commands:
```bash
php artisan migrate           # Run migrations
php artisan migrate:rollback  # Rollback last batch
php artisan migrate:fresh     # Drop all tables and re-run
```

**Q14: Explain the Handler pattern used in TaskController**
**A:** The Handler/Service pattern separates business logic from controllers:
- **Single Responsibility**: Controllers only handle HTTP, handlers contain logic
- **Testability**: Easier to test business logic in isolation
- **Reusability**: Handlers can be used by multiple controllers
- **Maintainability**: Cleaner, more organized code

```php
class TaskController extends Controller {
    protected TaskHandler $taskHandler;
    
    public function __construct(TaskHandler $taskHandler) {
        $this->taskHandler = $taskHandler;
    }
    
    public function store(CreateTaskRequest $request): JsonResponse {
        return $this->taskHandler->handleCreateTask($request);
    }
}
```

**Q15: What are Form Requests in Laravel?**
**A:** Form Requests encapsulate validation logic:
- **Validation Rules**: Define rules in one place
- **Authorization**: Can include authorization logic
- **Clean Controllers**: Keep controllers thin
- **Reusable**: Same rules for create/update

Example:
```php
class CreateTaskRequest extends FormRequest {
    public function authorize(): bool {
        return true; // or check permissions
    }
    
    public function rules(): array {
        return [
            'title' => 'required|string|max:120',
            'status' => 'required|in:todo,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
        ];
    }
}
```

**Q16: Explain middleware and how it's used for authorization**
**A:** Middleware filters HTTP requests:
- **Authentication**: Verify user is logged in (`auth:sanctum`)
- **Authorization**: Check permissions (`admin`, `CheckUserActive`)
- **CORS**: Handle cross-origin requests
- **Logging**: Log requests/responses

Example from our project:
```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware([\App\Http\Middleware\CheckUserActive::class])->group(function () {
        // Only authenticated AND active users
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        Route::middleware('admin')->group(function () {
            // Only admins
            Route::apiResource('users', UserController::class);
        });
    });
});
```

Custom middleware:
```php
class CheckUserActive {
    public function handle(Request $request, Closure $next) {
        if (!$request->user()->is_active) {
            return response()->json(['error' => 'Account inactive'], 403);
        }
        return $next($request);
    }
}
```

---

## 🗄️ Database & Data Modeling

**Q17: Explain the database schema for this application**
**A:** 

**Tables:**
1. **users**: User accounts with authentication
   - id, name, email, password, role (admin/user), is_active
   
2. **tasks**: Task management
   - id, user_id (FK), title, description, status, priority, due_date, completed_at, timestamps
   
3. **attachments**: File attachments for tasks
   - id, task_id (FK), uploaded_by (FK to users), file_name, file_path, file_size
   
4. **user_preferences**: User settings
   - id, user_id (FK), theme, notifications, etc.

**Relationships:**
- User **has many** Tasks (1:N)
- User **has many** Attachments (1:N)
- User **has one** UserPreference (1:1)
- Task **belongs to** User (N:1)
- Task **has many** Attachments (1:N)
- Attachment **belongs to** Task (N:1)
- Attachment **belongs to** User (uploaded_by) (N:1)

**Q18: Why use foreign key constraints?**
**A:**
- **Data Integrity**: Ensures referenced records exist
- **Cascade Operations**: Auto-delete related records
- **Database-level Validation**: Prevents orphaned records
- **Performance**: Database can optimize queries with FK indexes

Example:
```php
$table->foreignId('user_id')->constrained()->onDelete('cascade');
// If user deleted, all their tasks are also deleted
```

**Q19: Explain database indexing in this project**
**A:** Indexes improve query performance:
- **Primary Keys**: Automatically indexed (id columns)
- **Foreign Keys**: user_id, task_id indexed for joins
- **Status Column**: Indexed for filtering tasks by status
- **Priority Column**: Indexed for filtering by priority
- **Due Date**: Indexed for date-based queries

```php
$table->enum('status', ['todo','in_progress','completed'])->index();
```

Trade-offs:
- ✅ Faster SELECT queries with WHERE clauses
- ❌ Slower INSERT/UPDATE operations
- ❌ More storage space

**Q20: What is the purpose of timestamps in Laravel models?**
**A:** Automatic timestamp management:
- **created_at**: When record was created
- **updated_at**: When record was last modified
- **Use Cases**: 
  - Audit trails
  - Sorting by newest/oldest
  - Tracking changes
  - Cache invalidation

Laravel automatically manages these if `$timestamps = true` (default).

---

## 🌐 API Design & REST Principles

**Q21: What is REST and what are its principles?**
**A:** REST (Representational State Transfer) principles:
1. **Client-Server Architecture**: Separation of concerns
2. **Stateless**: Each request contains all needed information
3. **Cacheable**: Responses can be cached
4. **Uniform Interface**: Standard HTTP methods and URIs
5. **Layered System**: Client can't tell if connected to end server

**Q22: Explain the API endpoints in this application**
**A:**

**Authentication Endpoints:**
```
POST   /api/v1/auth/register     - Create new user account
POST   /api/v1/auth/login        - Authenticate and get token
POST   /api/v1/auth/logout       - Invalidate token
GET    /api/v1/auth/me           - Get authenticated user info
```

**Task Endpoints (RESTful Resource):**
```
GET    /api/v1/tasks             - List all tasks (with filters)
POST   /api/v1/tasks             - Create new task
GET    /api/v1/tasks/{id}        - Get single task
PUT    /api/v1/tasks/{id}        - Update entire task
PATCH  /api/v1/tasks/{id}        - Partial update
DELETE /api/v1/tasks/{id}        - Delete task
GET    /api/v1/tasks-statistics  - Get task statistics
```

**Attachment Endpoints:**
```
GET    /api/v1/tasks/{task}/attachments              - List attachments
POST   /api/v1/tasks/{task}/attachments              - Upload file
DELETE /api/v1/tasks/{task}/attachments/{attachment} - Delete file
```

**User Management (Admin only):**
```
GET    /api/v1/users                - List all users
POST   /api/v1/users                - Create user
GET    /api/v1/users/{id}           - Get user
PUT    /api/v1/users/{id}           - Update user
DELETE /api/v1/users/{id}           - Delete user
PATCH  /api/v1/users/{id}/role      - Update user role
PATCH  /api/v1/users/{id}/toggle    - Toggle active status
```

**Q23: Why use API versioning (v1)?**
**A:**
- **Backward Compatibility**: Support old clients while introducing new features
- **Gradual Migration**: Clients can migrate at their own pace
- **Breaking Changes**: Can introduce breaking changes in v2 without affecting v1
- **Clear Documentation**: Each version has its own docs

**Q24: What HTTP status codes are used and why?**
**A:**

**Success Codes:**
- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE

**Client Error Codes:**
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions (not admin)
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation failed

**Server Error Codes:**
- **500 Internal Server Error**: Unexpected server error

Example responses:
```json
// 200 OK
{
  "data": { "id": 1, "title": "Task" }
}

// 201 Created
{
  "message": "Task created successfully",
  "data": { "id": 1, "title": "New Task" }
}

// 422 Validation Error
{
  "message": "Validation failed",
  "errors": {
    "title": ["The title field is required"]
  }
}
```

**Q25: How do you handle CORS in this application?**
**A:** CORS (Cross-Origin Resource Sharing) allows frontend (localhost:3000) to call backend (localhost:8000):
- **Laravel CORS Config**: Configure allowed origins, methods, headers
- **Preflight Requests**: Handle OPTIONS requests
- **Headers**: 
  - `Access-Control-Allow-Origin: *` or specific origin
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`
  - `Access-Control-Allow-Headers: Authorization, Content-Type`

```php
// In routes/api.php
Route::options('v1/{any}', function () {
    return response()->json(['status' => 'success'], 200);
})->where('any', '.*');
```

---

## 🔐 Authentication & Security

**Q26: How is password security handled?**
**A:**
- **Hashing**: Passwords hashed using bcrypt (Laravel default)
- **Never Stored Plain**: Original password never stored
- **Salt**: Unique salt per password (automatic in bcrypt)
- **Cost Factor**: Configurable hashing rounds
- **One-way**: Cannot decrypt, only verify

```php
// Registration
$user->password = Hash::make($request->password);

// Login verification
if (!Hash::check($request->password, $user->password)) {
    return response()->json(['error' => 'Invalid credentials'], 401);
}
```

**Q27: What is CSRF and how is it prevented?**
**A:** CSRF (Cross-Site Request Forgery) is when malicious sites make requests on behalf of authenticated users.

**Prevention:**
- **Token-based Auth**: API uses Sanctum tokens, not cookies
- **SameSite Cookies**: If using cookies, set SameSite attribute
- **CSRF Tokens**: Laravel automatically generates CSRF tokens for forms
- **Verify Origin**: Check request origin headers

**Q28: How is SQL Injection prevented?**
**A:**
- **Prepared Statements**: Eloquent uses PDO prepared statements
- **Parameter Binding**: Values escaped automatically
- **Query Builder**: Eloquent escapes inputs
- **Never Raw Queries**: Avoid `DB::raw()` with user input

Safe:
```php
Task::where('user_id', $request->userId)->get();
```

Unsafe:
```php
DB::select("SELECT * FROM tasks WHERE user_id = " . $request->userId);
```

**Q29: Explain Role-Based Access Control (RBAC) implementation**
**A:**

**Roles:**
- **Admin**: Full system access, manage users, view all tasks
- **User**: Manage own tasks only

**Implementation:**
1. **Database**: `role` column in users table (admin/user)
2. **Model Method**: `isAdmin()` helper method
3. **Middleware**: `admin` middleware checks role
4. **Policy/Gates**: Can define more granular permissions

```php
// User model
public function isAdmin(): bool {
    return $this->role === 'admin';
}

// Middleware
class AdminMiddleware {
    public function handle(Request $request, Closure $next) {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}

// Routes
Route::middleware('admin')->group(function () {
    Route::apiResource('users', UserController::class);
});
```

**Q30: How do you secure file uploads?**
**A:**
- **File Type Validation**: Check MIME type and extension
- **File Size Limits**: Restrict maximum file size
- **Rename Files**: Don't use user-provided filenames
- **Store Outside Public**: Files stored in storage/, not public/
- **Access Control**: Verify user has permission to access file
- **Scan for Malware**: In production, scan uploaded files

```php
$request->validate([
    'file' => 'required|file|max:10240|mimes:pdf,doc,docx,jpg,png'
]);

$path = $request->file('file')->store('attachments');
```

---

## 🐳 Docker & DevOps

**Q31: What is Docker and why use it?**
**A:** Docker is a containerization platform:
- **Consistency**: Same environment across dev/staging/prod
- **Isolation**: Each service in its own container
- **Portability**: Runs anywhere Docker is installed
- **Easy Setup**: New developers can start quickly
- **Resource Efficient**: Lighter than VMs

**Q32: Explain the Docker Compose setup**
**A:** Docker Compose orchestrates multi-container applications:

**Services:**
1. **db (MySQL)**:
   - Image: mysql:8.0
   - Port: 3307 (host) → 3306 (container)
   - Volume: Persistent data storage
   - Healthcheck: Ensures DB ready before API starts

2. **api (Laravel)**:
   - Build: Custom Dockerfile in ./api
   - Port: 8000
   - Depends on: db (waits for healthcheck)
   - Volumes: Code mounted, vendor in named volume

3. **web (Next.js)**:
   - Build: Custom Dockerfile in ./web
   - Port: 3000
   - Depends on: api
   - Volumes: Code mounted, node_modules in container

**Networking:**
- All services on `todo-network` bridge
- Services can communicate via service names (e.g., `http://todo-api`)

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: todo
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
```

**Q33: What are Docker volumes and why use them?**
**A:**
- **Persistent Data**: Data survives container restarts
- **Performance**: Better I/O than bind mounts on Mac/Windows
- **Isolation**: Separate data from container lifecycle

In our project:
- `db_data`: MySQL database files persist
- `api_vendor`: PHP dependencies (faster builds)
- Bind mounts: Source code (for live reload during dev)

**Q34: How do you debug issues in Docker containers?**
**A:**
```bash
# View logs
docker-compose logs api
docker-compose logs -f web  # Follow logs

# Execute commands in container
docker-compose exec api php artisan migrate
docker-compose exec api bash

# Check container status
docker-compose ps

# Inspect container
docker inspect todo-api

# Restart specific service
docker-compose restart api
```

**Q35: Explain the entrypoint.sh script purpose**
**A:** Entrypoint scripts run when container starts:
- **Wait for Dependencies**: Ensure DB is ready
- **Run Migrations**: Auto-apply database changes
- **Set Permissions**: Fix file permissions
- **Start Services**: Start PHP server

```bash
#!/bin/bash
# Wait for database
until mysqladmin ping -h db; do
  echo "Waiting for database..."
  sleep 2
done

# Run migrations
php artisan migrate --force

# Start server
php artisan serve --host=0.0.0.0
```

---

## 🎯 System Design Questions

**Q36: How would you scale this application to handle 1 million users?**
**A:**

**Database Scaling:**
- **Read Replicas**: Master-slave replication for read-heavy workload
- **Connection Pooling**: Reuse DB connections
- **Query Optimization**: Add indexes, optimize N+1 queries
- **Caching**: Redis/Memcached for frequent queries

**Application Scaling:**
- **Horizontal Scaling**: Multiple API servers behind load balancer
- **Load Balancer**: Nginx/AWS ALB to distribute traffic
- **Stateless API**: No session storage in app (use tokens)
- **Queue Workers**: Background jobs for heavy tasks

**Frontend Scaling:**
- **CDN**: CloudFront/Cloudflare for static assets
- **Edge Caching**: Cache pages at edge locations
- **Code Splitting**: Load only necessary JavaScript
- **Image Optimization**: WebP format, lazy loading

**Infrastructure:**
- **Auto-scaling**: Kubernetes/ECS for automatic scaling
- **Monitoring**: Datadog/New Relic for performance
- **Logging**: ELK stack for centralized logs
- **Database**: Managed service (AWS RDS, Aurora)

**Q37: How would you implement real-time notifications?**
**A:**
- **WebSockets**: Laravel WebSockets or Pusher
- **Server-Sent Events (SSE)**: For one-way updates
- **Polling**: Simple but less efficient
- **Redis Pub/Sub**: For message broadcasting

Implementation:
```php
// Backend - broadcast event
event(new TaskUpdated($task));

// Frontend - listen for events
const echo = new Echo({...})
echo.channel('tasks')
    .listen('TaskUpdated', (e) => {
        updateTaskInUI(e.task)
    })
```

**Q38: How would you implement caching?**
**A:**

**Types of Caching:**
1. **Query Caching**: Cache database query results
2. **Full Page Caching**: Cache entire HTML responses
3. **API Response Caching**: Cache JSON responses
4. **Object Caching**: Cache computed values

**Implementation:**
```php
// Laravel Cache
$tasks = Cache::remember('user.' . $userId . '.tasks', 3600, function() {
    return Task::where('user_id', $userId)->get();
});

// Invalidate on update
Cache::forget('user.' . $userId . '.tasks');
```

**Strategies:**
- **Cache Aside**: App checks cache, then DB
- **Write Through**: Write to cache and DB simultaneously
- **TTL**: Set expiration times
- **Cache Invalidation**: Clear cache on data changes

**Q39: How would you handle file storage at scale?**
**A:**
- **Object Storage**: AWS S3, Google Cloud Storage
- **CDN**: CloudFront for fast delivery
- **Signed URLs**: Temporary access to private files
- **Thumbnails**: Generate multiple sizes for images
- **Lazy Loading**: Load images as needed
- **Compression**: Compress files before storage

```php
// Laravel S3 integration
Storage::disk('s3')->put($path, $contents);

// Generate signed URL
Storage::temporaryUrl($path, now()->addMinutes(30));
```

**Q40: Explain microservices vs monolithic architecture**
**A:**

**Monolithic (Current):**
- ✅ Simpler to develop initially
- ✅ Easier to deploy
- ✅ Better performance (no network calls)
- ❌ Harder to scale specific parts
- ❌ Single point of failure
- ❌ Technology lock-in

**Microservices:**
- ✅ Independent scaling
- ✅ Technology diversity
- ✅ Isolated failures
- ✅ Team autonomy
- ❌ More complex deployment
- ❌ Network latency
- ❌ Distributed system challenges

**When to use:**
- **Monolith**: Small teams, MVP, low traffic
- **Microservices**: Large teams, high scale, complex domain

---

## 💡 Coding Challenges

**Challenge 1: Implement task filtering with multiple criteria**
```php
// Laravel Controller
public function index(Request $request) {
    $query = Task::query();
    
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }
    
    if ($request->has('priority')) {
        $query->where('priority', $request->priority);
    }
    
    if ($request->has('search')) {
        $query->where(function($q) use ($request) {
            $q->where('title', 'like', "%{$request->search}%")
              ->orWhere('description', 'like', "%{$request->search}%");
        });
    }
    
    if ($request->has('due_date_from')) {
        $query->whereDate('due_date', '>=', $request->due_date_from);
    }
    
    return $query->paginate(10);
}
```

**Challenge 2: Implement optimistic UI updates in React**
```typescript
const updateTask = async (id: number, data: Partial<Task>) => {
  // Optimistically update UI
  setTasks(tasks.map(t => t.id === id ? {...t, ...data} : t))
  
  try {
    const response = await api.patch(`/tasks/${id}`, data)
    // Update with server response
    setTasks(tasks.map(t => t.id === id ? response.data : t))
  } catch (error) {
    // Revert on error
    setTasks(originalTasks)
    toast.error('Update failed')
  }
}
```

**Challenge 3: Implement task statistics**
```php
public function statistics(User $user) {
    $userId = $user->isAdmin() ? null : $user->id;
    
    $query = $userId ? Task::where('user_id', $userId) : Task::query();
    
    return [
        'total' => $query->count(),
        'completed' => $query->where('status', 'completed')->count(),
        'in_progress' => $query->where('status', 'in_progress')->count(),
        'todo' => $query->where('status', 'todo')->count(),
        'overdue' => $query->where('due_date', '<', now())
                           ->where('status', '!=', 'completed')
                           ->count(),
        'high_priority' => $query->where('priority', 'high')->count(),
    ];
}
```

**Challenge 4: Implement debounced search in React**
```typescript
import { useDebounce } from '@/hooks/useDebounce'

function SearchInput() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  
  useEffect(() => {
    if (debouncedSearch) {
      fetchTasks({ search: debouncedSearch })
    }
  }, [debouncedSearch])
  
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search tasks..."
    />
  )
}

// Custom hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

**Challenge 5: Implement pagination in Next.js**
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = []
  
  // Always show first page
  pages.push(1)
  
  // Show pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }
  
  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages)
  }
  
  return (
    <div className="flex gap-2">
      {pages.map((page, idx) => (
        <React.Fragment key={page}>
          {idx > 0 && pages[idx] - pages[idx - 1] > 1 && <span>...</span>}
          <button
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'font-bold' : ''}
          >
            {page}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}
```

---

## 🔍 Project-Specific Questions

**Q41: Walk me through the user registration flow**
**A:**
1. User fills registration form (name, email, password)
2. Frontend validates with Zod schema
3. POST request to `/api/v1/auth/register`
4. Backend validates request (FormRequest)
5. Check if email already exists
6. Hash password with bcrypt
7. Create user record (default role: 'user', is_active: true)
8. Generate Sanctum token
9. Return token + user data
10. Frontend stores token in localStorage
11. Redirect to tasks page

**Q42: How does task creation work?**
**A:**
1. User clicks "New Task" button
2. Form modal opens with React Hook Form
3. User fills title, description, status, priority, due date
4. Client-side validation with Zod
5. POST request to `/api/v1/tasks` with auth token
6. Backend validates request (CreateTaskRequest)
7. Extract authenticated user from token
8. Create task with user_id = authenticated user
9. Return created task
10. Frontend updates task list
11. Success toast message

**Q43: Explain the admin user management feature**
**A:**
- **List Users**: Admin sees all users with roles and status
- **Toggle Active**: Admin can activate/deactivate users
- **Update Role**: Admin can promote users to admin
- **Delete User**: Admin can delete users (cascades to tasks)

Protected by:
- `auth:sanctum` middleware (must be logged in)
- `CheckUserActive` middleware (account must be active)
- `admin` middleware (must have admin role)

**Q44: How does file attachment work?**
**A:**
1. User on task detail page clicks "Upload"
2. File picker opens
3. User selects file(s)
4. Frontend validates file type/size
5. FormData created with file
6. POST to `/api/v1/tasks/{task}/attachments`
7. Backend validates file (MIME type, size)
8. Store file in storage/attachments
9. Create attachment record (task_id, uploaded_by, file_path)
10. Return attachment metadata
11. Frontend displays file with download link

**Q45: How do user preferences work?**
**A:**
- **Storage**: Separate `user_preferences` table (1:1 with users)
- **Settings**: Theme, notification preferences, default task status
- **Get**: GET `/api/v1/user/preferences`
- **Update**: PUT `/api/v1/user/preferences`
- **Auto-apply**: Frontend applies theme preference on load

---

## 🗣️ Behavioral Questions

**Q46: Tell me about a challenging bug you fixed in this project**
**A:** 
"I encountered an issue where tasks weren't showing up for regular users, only for admins. After debugging, I found that the task listing query wasn't properly filtering by user_id for non-admin users. The issue was in the TaskHandler where we weren't checking the user's role before applying the filter. I fixed it by:
1. Adding a role check in the handler
2. Applying user_id filter only for non-admin users
3. Adding a test case to prevent regression
This taught me the importance of thorough testing for different user roles and edge cases."

**Q47: How do you ensure code quality?**
**A:**
- **Code Reviews**: Peer review before merging
- **Testing**: PHPUnit tests for backend, manual testing for frontend
- **Linting**: Laravel Pint for PHP, ESLint for TypeScript
- **Type Safety**: TypeScript catches errors at compile-time
- **Documentation**: Clear comments for complex logic
- **Git Commits**: Descriptive commit messages
- **Standards**: Follow PSR standards for PHP, Airbnb style for JS

**Q48: How do you approach learning new technologies?**
**A:**
"I follow a structured approach:
1. **Official Documentation**: Start with docs and tutorials
2. **Build Projects**: Learn by doing, like this todo app
3. **Best Practices**: Research community standards
4. **Code Reviews**: Look at open-source projects
5. **Iterate**: Refactor and improve based on learnings
6. **Stay Updated**: Follow blogs, newsletters, conferences"

**Q49: How do you handle tight deadlines?**
**A:**
- **Prioritize**: Focus on MVP features first
- **Break Down**: Divide work into smaller tasks
- **Communicate**: Keep stakeholders informed
- **Timebox**: Set time limits for tasks
- **Cut Scope**: Identify what can be pushed to next sprint
- **Ask for Help**: Collaborate with team when stuck

**Q50: Describe your development workflow**
**A:**
1. **Understand Requirements**: Clarify features and acceptance criteria
2. **Design**: Plan database schema, API endpoints, UI
3. **Setup**: Create feature branch from main
4. **Backend First**: Build API endpoints with validation
5. **Test API**: Use Postman/Thunder Client
6. **Frontend**: Build UI consuming API
7. **Test Integrated**: Ensure end-to-end functionality
8. **Refactor**: Clean up code, add comments
9. **Commit**: Push changes with descriptive messages
10. **Review**: Code review and address feedback
11. **Merge**: Merge to main after approval

---

## ✅ Best Practices Implemented

### Code Organization
- ✅ **Separation of Concerns**: MVC on backend, component-based on frontend
- ✅ **DRY Principle**: Reusable components and handlers
- ✅ **Single Responsibility**: Each class/function has one purpose
- ✅ **Dependency Injection**: Controllers receive dependencies

### Security
- ✅ **Password Hashing**: Bcrypt with salt
- ✅ **Token-based Auth**: Sanctum for API authentication
- ✅ **SQL Injection Prevention**: Eloquent ORM with prepared statements
- ✅ **CSRF Protection**: Token verification
- ✅ **Input Validation**: Form requests and Zod schemas
- ✅ **Role-based Access**: Middleware for authorization
- ✅ **Active User Check**: Additional security layer

### Performance
- ✅ **Database Indexes**: On frequently queried columns
- ✅ **Eager Loading**: Prevent N+1 queries
- ✅ **Pagination**: Limit records returned
- ✅ **Code Splitting**: Next.js automatic splitting
- ✅ **Lazy Loading**: Components loaded on demand

### User Experience
- ✅ **Responsive Design**: Mobile-friendly UI
- ✅ **Dark Mode**: Theme toggle
- ✅ **Loading States**: Feedback during async operations
- ✅ **Error Messages**: Clear validation errors
- ✅ **Toast Notifications**: Success/error feedback

### Development
- ✅ **Version Control**: Git with meaningful commits
- ✅ **Environment Variables**: Separate config for dev/prod
- ✅ **Docker**: Consistent development environment
- ✅ **API Versioning**: Backward compatibility
- ✅ **Type Safety**: TypeScript on frontend
- ✅ **Code Linting**: Consistent code style

---

## 🎓 Key Takeaways

### Technical Skills Demonstrated
1. **Full-Stack Development**: Comfort with both frontend and backend
2. **Modern Frameworks**: Next.js, React, Laravel, TypeScript
3. **Database Design**: Proper schema, relationships, indexes
4. **API Design**: RESTful principles, versioning
5. **Authentication**: Token-based auth, RBAC
6. **DevOps**: Docker, containerization
7. **UI/UX**: Responsive design, dark mode, accessibility

### Soft Skills
1. **Problem Solving**: Breaking down complex features
2. **Code Organization**: Clean, maintainable code
3. **Security Awareness**: Implementing security best practices
4. **Documentation**: Clear comments and README
5. **Testing Mindset**: Thinking about edge cases
6. **Continuous Learning**: Adopting new technologies

---

## 📚 Additional Resources to Study

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Backend
- [Laravel Documentation](https://laravel.com/docs)
- [PHP The Right Way](https://phptherightway.com/)
- [REST API Tutorial](https://restfulapi.net/)

### Database
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Database Design Basics](https://www.lucidchart.com/pages/database-diagram/database-design)

### General
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Clean Code Principles](https://www.freecodecamp.org/news/clean-coding-for-beginners/)

---

## 🎯 Interview Tips

1. **Be Honest**: Don't pretend to know what you don't
2. **Think Aloud**: Explain your thought process
3. **Ask Questions**: Clarify requirements before answering
4. **Use Examples**: Reference specific code from this project
5. **Admit Mistakes**: Show you learn from errors
6. **Show Enthusiasm**: Demonstrate passion for coding
7. **Time Management**: Don't spend too long on one question
8. **Practice**: Do mock interviews with friends
9. **Prepare Questions**: Have questions ready for interviewer
10. **Stay Calm**: Take a breath if you need time to think

---

## 🚀 Final Checklist Before Interview

- [ ] Review this entire guide
- [ ] Run the application locally
- [ ] Understand each API endpoint
- [ ] Review the code in key files (Models, Controllers, Components)
- [ ] Practice explaining the architecture
- [ ] Prepare 3-5 questions for the interviewer
- [ ] Test your internet connection and equipment
- [ ] Have a backup plan for technical issues
- [ ] Get a good night's sleep
- [ ] Be yourself and show confidence

---

**Good luck with your interview! 🌟**

Remember: Confidence comes from preparation. You've built this project, you understand it, and you can explain it clearly. You've got this! 💪
