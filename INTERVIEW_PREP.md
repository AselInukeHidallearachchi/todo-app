# Backend Interview Preparation Guide
## Full-Stack Todo Application with Laravel, Next.js & Docker

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [What You Built - Your Accomplishments](#what-you-built)
3. [Laravel Backend Deep Dive](#laravel-backend)
4. [Next.js Frontend Deep Dive](#nextjs-frontend)
5. [Docker & DevOps](#docker-devops)
6. [Interview Questions & Answers](#interview-questions)
7. [Technical Concepts](#technical-concepts)
8. [Code Walkthrough](#code-walkthrough)

---

## 🎯 Project Overview

### The Application
A **production-ready, full-stack task management system** with:
- **Backend**: Laravel 12.x REST API with MySQL
- **Frontend**: Next.js 15.5 with React 19 & TypeScript
- **Infrastructure**: Dockerized multi-container setup
- **Authentication**: Token-based auth with Laravel Sanctum
- **Architecture**: Clean separation with MVC + Service/Handler pattern

### Tech Stack Summary
```
Backend:    Laravel 12.x + PHP 8.2+ + MySQL 8.0
Frontend:   Next.js 15.5 + React 19 + TypeScript
Styling:    Tailwind CSS 4.x + Radix UI
Auth:       Laravel Sanctum (Token-based)
DevOps:     Docker + Docker Compose
```

---

## 🚀 What You Built - Your Accomplishments

### 1. **Complete Authentication System**
✅ **User Registration & Login**
- Implemented secure user registration with validation
- Built token-based authentication using Laravel Sanctum
- Created session management with token storage in frontend

✅ **Authorization & Role Management**
- Implemented role-based access control (Admin/User)
- Created middleware for admin-only routes
- Built user status checking (active/inactive users)

**Code Example:**
```php
// Middleware: CheckUserActive.php
public function handle(Request $request, Closure $next): Response
{
    if (!$request->user()->is_active) {
        return response()->json([
            'success' => false,
            'message' => 'Your account is inactive. Please contact support.'
        ], 403);
    }
    return $next($request);
}
```

### 2. **RESTful API Design**
✅ **Task Management CRUD**
- `GET /api/v1/tasks` - List with filtering and pagination
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{id}` - Get task details
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `GET /api/v1/tasks-statistics` - Analytics endpoint

✅ **File Upload System**
- Implemented attachment upload for tasks
- Created file management with size validation
- Built relationship between tasks and attachments

✅ **User Preferences API**
- JSON-based user settings storage
- Customizable user preferences

**API Route Structure:**
```php
Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::middleware([CheckUserActive::class])->group(function () {
            Route::apiResource('tasks', TaskController::class);
            
            // Admin-only routes
            Route::middleware('admin')->group(function () {
                Route::apiResource('users', UserController::class);
            });
        });
    });
});
```

### 3. **Database Design & Relationships**
✅ **Normalized Schema**
- Users table with role and status
- Tasks table with status, priority, due dates
- Attachments table with file metadata
- User preferences table with JSON data

✅ **Eloquent Relationships**
```php
// User Model
public function tasks() {
    return $this->hasMany(Task::class);
}

public function attachments() {
    return $this->hasMany(Attachment::class, 'uploaded_by');
}

// Task Model
public function user() {
    return $this->belongsTo(User::class);
}

public function attachments() {
    return $this->hasMany(Attachment::class);
}
```

### 4. **Clean Architecture Pattern**
✅ **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses
- **Handlers**: Business logic processing
- **Services**: Reusable business operations
- **Models**: Data layer with Eloquent ORM
- **Resources**: API response transformation
- **Requests**: Input validation

**Example Architecture:**
```
Request → Controller → Handler → Service → Model → Database
                ↓                              ↓
            Validation                    Response Resource
```

### 5. **Frontend with Next.js**
✅ **Server-Side Rendering (SSR)**
- Built server components for better SEO
- Implemented data fetching on the server
- Created client components for interactivity

✅ **Type Safety with TypeScript**
- Defined interfaces for all API responses
- Type-safe API calls
- Strong typing throughout the application

✅ **Modern React Patterns**
- Context API for global state
- Custom hooks for reusable logic
- Form handling with React Hook Form + Zod validation

**Example:**
```typescript
// Type-safe API response
interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

// Server Component
async function getTaskStatistics(): Promise<TaskStats> {
  const response = await serverApi.get<TaskStatsResponse>("/tasks-statistics");
  return response.data;
}
```

### 6. **Docker Infrastructure**
✅ **Multi-Container Setup**
- Database container (MySQL 8.0)
- API container (Laravel with PHP-FPM + Nginx)
- Web container (Next.js)
- Custom network for inter-container communication

✅ **Development Environment**
- Health checks for database readiness
- Volume mounting for hot reload
- Environment variable management
- Helper scripts for easy deployment

**Docker Compose Structure:**
```yaml
services:
  db:
    image: mysql:8.0
    healthcheck: [checks database availability]
    
  api:
    build: ./api
    depends_on: db
    
  web:
    build: ./web
    depends_on: api
```

---

## 🔧 Laravel Backend Deep Dive

### Core Concepts You Implemented

#### 1. **MVC Architecture**
**Model-View-Controller** pattern is the foundation:

**Models** (Data Layer):
- Represent database tables
- Define relationships between entities
- Handle data validation and casting

```php
class Task extends Model {
    protected $fillable = ['title', 'description', 'status', 'priority', 'due_date'];
    protected $casts = ['due_date' => 'date', 'completed_at' => 'datetime'];
    
    // Relationships
    public function user() { return $this->belongsTo(User::class); }
    public function attachments() { return $this->hasMany(Attachment::class); }
}
```

**Controllers** (Request Handlers):
- Receive HTTP requests
- Delegate to handlers/services
- Return JSON responses

```php
class TaskController extends Controller {
    protected TaskHandler $taskHandler;
    
    public function index(Request $request): JsonResponse {
        return $this->taskHandler->handleGetTasks($request, $request->user());
    }
}
```

**Views** (In API context, these are API Resources):
- Transform models into JSON
- Hide sensitive data
- Format responses consistently

```php
class TaskResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status,
            'user' => new UserResource($this->user),
        ];
    }
}
```

#### 2. **Eloquent ORM (Object-Relational Mapping)**

**Query Builder:**
```php
// Simple queries
$tasks = Task::where('user_id', $userId)->get();

// Complex queries with relationships
$tasks = Task::with('user', 'attachments')
    ->where('status', 'pending')
    ->orderBy('due_date', 'asc')
    ->paginate(15);
```

**Relationships:**
- `hasMany` / `belongsTo` (One-to-Many)
- `hasOne` (One-to-One)
- `belongsToMany` (Many-to-Many)

**Eager Loading** (N+1 Query Problem Solution):
```php
// Bad: N+1 queries
$tasks = Task::all();
foreach ($tasks as $task) {
    echo $task->user->name; // Queries user for each task
}

// Good: 2 queries total
$tasks = Task::with('user')->get();
foreach ($tasks as $task) {
    echo $task->user->name; // User already loaded
}
```

#### 3. **Middleware**

Middleware processes requests before they reach controllers:

```php
// Route protection
Route::middleware(['auth:sanctum'])->group(function () {
    // Protected routes
});

// Custom middleware
class CheckUserActive implements Middleware {
    public function handle($request, Closure $next) {
        if (!$request->user()->is_active) {
            return response()->json(['error' => 'Inactive account'], 403);
        }
        return $next($request);
    }
}
```

**Middleware Stack in Your App:**
1. `auth:sanctum` - Verify token authentication
2. `CheckUserActive` - Ensure user is active
3. `admin` - Verify admin role (for admin routes)

#### 4. **Request Validation**

**Form Requests** for validation:
```php
class CreateTaskRequest extends FormRequest {
    public function rules(): array {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date|after:today',
        ];
    }
}
```

**Usage in Controller:**
```php
public function store(CreateTaskRequest $request) {
    // Validation already happened, data is clean
    $validated = $request->validated();
    $task = Task::create($validated);
}
```

#### 5. **Laravel Sanctum (Authentication)**

**Token Generation:**
```php
// On login
$token = $user->createToken('auth-token')->plainTextToken;
return response()->json(['token' => $token]);
```

**Token Verification:**
```php
// Middleware automatically verifies token from header:
// Authorization: Bearer {token}
$user = $request->user(); // Authenticated user
```

**Token Revocation:**
```php
// On logout
$request->user()->currentAccessToken()->delete();
```

#### 6. **Database Migrations**

Version control for database schema:

```php
// Migration file: create_tasks_table.php
public function up() {
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['pending', 'in_progress', 'completed']);
        $table->enum('priority', ['low', 'medium', 'high']);
        $table->date('due_date')->nullable();
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });
}

public function down() {
    Schema::dropIfExists('tasks');
}
```

**Running Migrations:**
```bash
php artisan migrate              # Run pending migrations
php artisan migrate:rollback     # Rollback last batch
php artisan migrate:fresh        # Drop all tables and re-run
```

#### 7. **Service Container & Dependency Injection**

Laravel's IoC (Inversion of Control) container:

```php
class TaskController {
    // Dependencies automatically injected
    public function __construct(
        TaskHandler $taskHandler,
        AttachmentService $attachmentService
    ) {
        $this->taskHandler = $taskHandler;
        $this->attachmentService = $attachmentService;
    }
}
```

**Benefits:**
- Loose coupling
- Easy testing (mock dependencies)
- Automatic resolution of dependencies

---

## ⚛️ Next.js Frontend Deep Dive

### Core Concepts You Implemented

#### 1. **App Router (Next.js 13+)**

**File-based Routing:**
```
app/
  ├── page.tsx                    → /
  ├── login/page.tsx              → /login
  ├── tasks/
  │   ├── page.tsx               → /tasks
  │   ├── new/page.tsx           → /tasks/new
  │   └── [id]/page.tsx          → /tasks/:id
  └── admin/
      └── users/page.tsx         → /admin/users
```

#### 2. **Server vs Client Components**

**Server Components** (default):
```tsx
// app/page.tsx
async function Home() {
  // Runs on server, can access DB/APIs directly
  const user = await requireAuth();
  const stats = await getTaskStatistics();
  
  return <DashboardClient user={user} stats={stats} />;
}
```

**Client Components** (interactive):
```tsx
// components/DashboardClient.tsx
'use client'; // Mark as client component

export function DashboardClient({ user, stats }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div onClick={() => setIsOpen(true)}>
      {/* Interactive UI */}
    </div>
  );
}
```

**When to Use What:**
- **Server**: Data fetching, SEO, security-sensitive operations
- **Client**: User interactions, state management, browser APIs

#### 3. **TypeScript Integration**

**Type Definitions:**
```typescript
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  user: User;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

**Type-Safe API Calls:**
```typescript
const response = await api.get<ApiResponse<Task[]>>('/tasks');
const tasks: Task[] = response.data.data;
```

#### 4. **React Context API**

**Global State Management:**
```tsx
// context/ToastContext.tsx
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = (message: string, type: 'success' | 'error') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };
  
  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Usage in components
const { addToast } = useToast();
addToast('Task created!', 'success');
```

#### 5. **Form Handling with React Hook Form + Zod**

**Schema Validation:**
```typescript
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;
```

**Form Implementation:**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
  resolver: zodResolver(taskSchema),
});

const onSubmit = async (data: TaskFormData) => {
  await api.post('/tasks', data);
};
```

#### 6. **Authentication Flow**

**Server-Side Auth Check:**
```typescript
// lib/auth.ts
export async function requireAuth() {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }
  
  const user = await serverApi.get('/auth/me');
  return user.data;
}
```

**Client-Side Auth:**
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 7. **UI Components with Radix UI**

**Headless Components:**
```tsx
import * as Dialog from '@radix-ui/react-dialog';

function TaskDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Task</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Task Details</Dialog.Title>
          {/* Content */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**Benefits:**
- Accessibility built-in
- Unstyled (style with Tailwind)
- Keyboard navigation
- ARIA attributes

---

## 🐳 Docker & DevOps

### Docker Fundamentals

#### 1. **Docker Concepts**

**Images vs Containers:**
- **Image**: Blueprint (read-only template)
- **Container**: Running instance of an image

**Dockerfile Example (Laravel):**
```dockerfile
FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache mysql-client nginx

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy application
COPY . /var/www/html

# Set working directory
WORKDIR /var/www/html

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port
EXPOSE 80

# Start services
CMD ["php-fpm"]
```

#### 2. **Docker Compose**

**Multi-Container Orchestration:**
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
      
  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db
      DB_DATABASE: todo
      
  web:
    build: ./web
    depends_on:
      - api
    ports:
      - "3000:3000"
```

**Key Concepts:**
- **Services**: Containerized applications
- **Volumes**: Persistent data storage
- **Networks**: Container communication
- **depends_on**: Service startup order
- **Health checks**: Ensure service readiness

#### 3. **Networking**

**Container Communication:**
```yaml
networks:
  todo-network:
    driver: bridge
```

Containers can communicate using service names:
- `web` can call `api` at `http://todo-api:80`
- `api` can connect to `db` at `db:3306`

#### 4. **Volume Management**

**Named Volumes:**
```yaml
volumes:
  db_data:              # Persistent database data
  api_vendor:           # Cached composer packages
```

**Bind Mounts** (development):
```yaml
volumes:
  - ./api:/var/www/html     # Live code reload
  - /var/www/html/vendor    # Don't overwrite vendor
```

#### 5. **Environment Variables**

**Multiple Ways to Set:**
```yaml
# In docker-compose.yml
environment:
  - DB_HOST=db
  - DB_DATABASE=todo

# From .env file
env_file:
  - .env.docker

# Build-time arguments
build:
  args:
    - API_URL=http://localhost:8000
```

#### 6. **Docker Commands**

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f api

# Execute command in container
docker compose exec api php artisan migrate

# Stop containers
docker compose down

# Remove volumes
docker compose down -v

# Restart specific service
docker compose restart web
```

---

## 💬 Interview Questions & Answers

### Laravel Questions

#### Q1: Explain the request lifecycle in Laravel.
**Answer:**
```
1. Entry Point: public/index.php
2. Bootstrap: Load framework, register service providers
3. Routing: Match request to route
4. Middleware: Execute middleware stack
5. Controller: Handle request
6. Response: Return response
7. Middleware: Execute after-middleware
8. Send Response: Output to browser
```

**In Your Project:**
```
HTTP Request → index.php → Bootstrap
  → Route Matching (api.php)
  → Middleware (auth:sanctum → CheckUserActive → admin)
  → Controller (TaskController)
  → Handler (TaskHandler)
  → Model (Task)
  → Response (TaskResource)
```

#### Q2: What's the difference between `get()`, `first()`, and `find()` in Eloquent?
**Answer:**
- `get()`: Returns collection of all matching records
- `first()`: Returns first matching record or null
- `find($id)`: Finds by primary key, returns model or null

```php
// Returns Collection<Task>
$tasks = Task::where('status', 'pending')->get();

// Returns Task or null
$task = Task::where('user_id', 1)->first();

// Returns Task or null
$task = Task::find(5);

// Throws exception if not found
$task = Task::findOrFail(5);
```

#### Q3: How does middleware work in your application?
**Answer:**
Middleware wraps around your controller logic:

```php
// Middleware stack for admin routes
Route::middleware(['auth:sanctum', CheckUserActive::class, 'admin'])->group(...);

// Execution order:
1. auth:sanctum → Verify token, set $request->user()
2. CheckUserActive → Check if user is active
3. admin → Verify user has admin role
4. Controller action
5. Response back through middleware
```

**Example middleware:**
```php
class CheckUserActive {
    public function handle($request, Closure $next) {
        // Before controller
        if (!$request->user()->is_active) {
            return response()->json(['error' => 'Inactive'], 403);
        }
        
        $response = $next($request); // Call controller
        
        // After controller (modify response if needed)
        return $response;
    }
}
```

#### Q4: Explain Laravel Sanctum vs Passport.
**Answer:**
**Sanctum** (Used in your project):
- Lightweight, token-based
- Perfect for SPAs and mobile apps
- Simple to implement
- Tokens stored in database

**Passport**:
- Full OAuth2 implementation
- More complex, feature-rich
- Good for third-party API access
- Uses JWT tokens

**Why Sanctum for your project?**
- SPA (Next.js) doesn't need OAuth2
- Simpler setup
- Better performance for simple use cases

#### Q5: How do you prevent N+1 query problems?
**Answer:**
**Problem:**
```php
// 1 query for tasks + N queries for users (N+1)
$tasks = Task::all(); // 1 query
foreach ($tasks as $task) {
    echo $task->user->name; // N queries (one per task)
}
```

**Solution - Eager Loading:**
```php
// Only 2 queries total
$tasks = Task::with('user')->get(); // 2 queries
foreach ($tasks as $task) {
    echo $task->user->name; // No additional queries
}

// Multiple relationships
$tasks = Task::with(['user', 'attachments'])->get();

// Nested relationships
$tasks = Task::with('user.preference')->get();
```

#### Q6: What are Service Providers?
**Answer:**
Service Providers bootstrap application components:

```php
class AppServiceProvider extends ServiceProvider {
    public function register() {
        // Bind interfaces to implementations
        $this->app->bind(TaskServiceInterface::class, TaskService::class);
    }
    
    public function boot() {
        // Run after all services registered
        // Set up observers, policies, etc.
        Model::preventLazyLoading(!app()->isProduction());
    }
}
```

**In Your Project:**
- `AppServiceProvider`: General app bootstrapping
- `RouteServiceProvider`: Route configuration

### Next.js Questions

#### Q7: What's the difference between Server and Client Components?
**Answer:**

**Server Components** (Default in App Router):
```tsx
// app/page.tsx - Server Component
async function Dashboard() {
  // Runs on server
  const tasks = await db.tasks.findMany(); // Direct DB access
  const user = await requireAuth();        // Server-side auth
  
  return <DashboardClient tasks={tasks} />;
}
```

**Pros:** SEO, security, smaller bundle, can access backend directly

**Client Components:**
```tsx
'use client'; // Required directive

function DashboardClient({ tasks }) {
  const [filter, setFilter] = useState('all');
  
  // Can use hooks, event handlers, browser APIs
  return <div onClick={() => setFilter('active')} />;
}
```

**Pros:** Interactivity, hooks, browser APIs

**Best Practice:** Server by default, client only when needed

#### Q8: How does data fetching work in Next.js App Router?
**Answer:**

**Server-Side:**
```tsx
// Automatic caching, runs on server
async function getTasks() {
  const res = await fetch('http://api/tasks', {
    cache: 'no-store', // or 'force-cache'
    next: { revalidate: 3600 } // ISR
  });
  return res.json();
}

async function Page() {
  const tasks = await getTasks();
  return <TaskList tasks={tasks} />;
}
```

**Client-Side:**
```tsx
'use client';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);
}
```

#### Q9: Explain your authentication flow.
**Answer:**

**1. Login Flow:**
```
User → Login Form → POST /api/v1/auth/login
  → Laravel validates credentials
  → Generate Sanctum token
  → Return token to frontend
  → Store in localStorage
  → Redirect to dashboard
```

**2. Protected Routes:**
```tsx
// Server-side check
async function requireAuth() {
  const token = cookies().get('token');
  if (!token) redirect('/login');
  
  // Verify with backend
  const user = await serverApi.get('/auth/me');
  return user;
}

// Client-side API calls
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**3. Logout:**
```tsx
async function logout() {
  await api.post('/auth/logout'); // Revoke token
  localStorage.removeItem('token');
  router.push('/login');
}
```

#### Q10: How do you handle TypeScript types for API responses?
**Answer:**

**Define Types:**
```typescript
interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}
```

**Type-Safe API Calls:**
```typescript
// Generic API function
async function get<T>(url: string): Promise<ApiResponse<T>> {
  const response = await axios.get<ApiResponse<T>>(url);
  return response.data;
}

// Usage with type inference
const response = await get<Task[]>('/tasks');
const tasks: Task[] = response.data; // Fully typed
```

### Docker Questions

#### Q11: Explain your Docker setup.
**Answer:**

**Architecture:**
```
Docker Host
├── todo-network (bridge)
│   ├── db (mysql:8.0) - Port 3307:3306
│   ├── api (laravel) - Port 8000:80
│   └── web (nextjs) - Port 3000:3000
└── Volumes
    ├── db_data (persistent database)
    └── api_vendor (composer cache)
```

**Service Dependencies:**
```yaml
web → api → db
(Next.js) → (Laravel) → (MySQL)
```

**Container Communication:**
- `web` calls `api` via: `http://todo-api:80`
- `api` connects to `db` via: `db:3306`
- Host accesses via: `localhost:3000`, `localhost:8000`

#### Q12: What's the difference between CMD and ENTRYPOINT?
**Answer:**

**CMD** - Default command, can be overridden:
```dockerfile
CMD ["php-fpm"]

# Can override:
docker run myimage bash
```

**ENTRYPOINT** - Always runs, CMD becomes arguments:
```dockerfile
ENTRYPOINT ["php"]
CMD ["artisan", "serve"]

# Results in: php artisan serve
# Can add args:
docker run myimage artisan migrate
# Results in: php artisan migrate
```

**In Your Project:**
```dockerfile
# entrypoint.sh
#!/bin/sh
php artisan migrate --force
php artisan config:cache
php-fpm
```

#### Q13: How do you handle database persistence?
**Answer:**

**Named Volumes:**
```yaml
services:
  db:
    volumes:
      - db_data:/var/lib/mysql  # Persistent

volumes:
  db_data:  # Named volume persists after container removal
```

**Why it matters:**
- Data survives `docker compose down`
- Shared between container recreations
- Can be backed up with `docker volume backup`

**To reset:**
```bash
docker compose down -v  # Remove volumes
```

#### Q14: Explain health checks in your setup.
**Answer:**

```yaml
db:
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-proot"]
    timeout: 5s
    retries: 10
    interval: 3s
```

**Purpose:**
- Ensures MySQL is ready before starting API
- API waits via `depends_on: condition: service_healthy`
- Prevents connection errors during startup

**States:**
- starting → healthy/unhealthy
- API only starts when DB is healthy

---

## 📚 Technical Concepts

### RESTful API Design

**Principles:**
1. **Stateless**: Each request contains all needed info
2. **Resource-based**: URLs represent resources, not actions
3. **HTTP Methods**: GET, POST, PUT, DELETE for CRUD
4. **Status Codes**: Meaningful response codes

**Your Implementation:**
```
GET    /api/v1/tasks          → List tasks (200)
POST   /api/v1/tasks          → Create task (201)
GET    /api/v1/tasks/5        → Get task (200)
PUT    /api/v1/tasks/5        → Update task (200)
DELETE /api/v1/tasks/5        → Delete task (204)
```

**Good Practices:**
- Version your API (`/v1/`)
- Use nouns, not verbs (`/tasks` not `/getTasks`)
- Return proper status codes
- Consistent error format

### Authentication & Authorization

**Authentication**: Who are you?
```php
// Sanctum token verification
$user = $request->user(); // Via auth:sanctum middleware
```

**Authorization**: What can you do?
```php
// Role-based
if ($user->isAdmin()) {
    // Can access admin routes
}

// Policy-based
if ($user->can('update', $task)) {
    // Can update this specific task
}
```

**Your Implementation:**
```php
// Middleware stack
auth:sanctum        → Authenticate user
CheckUserActive     → Authorize active users
admin               → Authorize admin role
```

### Database Indexing

**Why Index:**
- Speed up queries
- Enforce uniqueness

**Your Implementation:**
```php
// Migration
$table->string('email')->unique();  // Index for fast lookup
$table->foreignId('user_id')->index();  // Index for joins
```

**Trade-offs:**
- Faster reads
- Slower writes (index must update)
- More disk space

### CORS (Cross-Origin Resource Sharing)

**Problem:**
Browser blocks requests from different origins:
```
http://localhost:3000 (Next.js)
→ http://localhost:8000 (Laravel)
❌ Blocked by browser
```

**Solution - CORS Headers:**
```php
// Laravel: config/cors.php
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

**Your Middleware:**
```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Validation

**Backend Validation** (Laravel):
```php
public function rules() {
    return [
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ];
}
```

**Frontend Validation** (Zod):
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

**Best Practice:** Validate on both sides
- Frontend: Better UX
- Backend: Security (never trust client)

---

## 🔍 Code Walkthrough

### Complete Feature: Creating a Task

#### 1. **Frontend Form (Next.js)**
```tsx
'use client';

function NewTaskForm() {
  const schema = z.object({
    title: z.string().min(1),
    status: z.enum(['pending', 'in_progress', 'completed']),
  });
  
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    try {
      await api.post('/tasks', data);
      router.push('/tasks');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      <select {...register('status')}>
        <option value="pending">Pending</option>
      </select>
      <button type="submit">Create</button>
    </form>
  );
}
```

#### 2. **API Route (Laravel)**
```php
// routes/api.php
Route::post('/tasks', [TaskController::class, 'store'])
    ->middleware(['auth:sanctum', CheckUserActive::class]);
```

#### 3. **Request Validation**
```php
// app/Http/Requests/CreateTaskRequest.php
class CreateTaskRequest extends FormRequest {
    public function authorize() {
        return true; // Already authenticated by middleware
    }
    
    public function rules() {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date|after:today',
        ];
    }
}
```

#### 4. **Controller**
```php
// app/Http/Controllers/TaskController.php
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

#### 5. **Handler (Business Logic)**
```php
// app/Handlers/TaskHandler.php
class TaskHandler {
    public function handleCreateTask(CreateTaskRequest $request): JsonResponse {
        try {
            $task = Task::create([
                'user_id' => $request->user()->id,
                ...$request->validated(),
            ]);
            
            $task->load('user', 'attachments');
            
            return ApiResponse::success(
                new TaskResource($task),
                'Task created successfully',
                201
            );
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create task', 500);
        }
    }
}
```

#### 6. **Model**
```php
// app/Models/Task.php
class Task extends Model {
    protected $fillable = [
        'user_id', 'title', 'description', 
        'status', 'priority', 'due_date'
    ];
    
    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];
    
    public function user() {
        return $this->belongsTo(User::class);
    }
}
```

#### 7. **Resource (Response)**
```php
// app/Http/Resources/TaskResource.php
class TaskResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

#### 8. **Database**
```sql
-- Executed by migration
INSERT INTO tasks (user_id, title, status, priority, created_at, updated_at)
VALUES (1, 'New Task', 'pending', 'high', NOW(), NOW());
```

#### 9. **Response Flow**
```
Database → Model → Handler → Resource → Controller → Response
  {record}    Task    Task      JSON      JsonResponse
```

**Final Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "New Task",
    "status": "pending",
    "priority": "high",
    "user": {
      "id": 1,
      "name": "John Doe"
    }
  }
}
```

---

## 🎓 Key Takeaways for Interviews

### What to Emphasize:

1. **Full-Stack Capability**
   - Built both backend API and frontend
   - Integrated them with proper authentication
   - Deployed with Docker

2. **Clean Architecture**
   - Separation of concerns
   - MVC + Handler/Service pattern
   - Reusable, testable code

3. **Modern Tech Stack**
   - Latest Laravel and Next.js
   - TypeScript for type safety
   - Docker for containerization

4. **Security**
   - Token-based authentication
   - Input validation (both sides)
   - Role-based access control
   - Active user checking

5. **Database Design**
   - Normalized schema
   - Proper relationships
   - Foreign keys and constraints

6. **API Design**
   - RESTful principles
   - Versioning
   - Consistent responses
   - Proper HTTP methods/codes

### How to Talk About Your Project:

**Opening:**
> "I built a production-ready full-stack task management system using Laravel for the REST API, Next.js for the frontend, and Docker for containerization. The application features authentication, role-based access control, file uploads, and comprehensive task management."

**Technical Details:**
> "On the backend, I implemented a clean architecture using Laravel's MVC pattern with additional Handler and Service layers for business logic. I used Eloquent ORM for database operations, Laravel Sanctum for token-based authentication, and comprehensive validation at both the request and model level."

**Frontend:**
> "For the frontend, I used Next.js 15 with the new App Router, leveraging server components for SEO and client components for interactivity. I implemented type-safe API calls with TypeScript, form validation with Zod, and state management with React Context."

**DevOps:**
> "I containerized the entire stack with Docker Compose, creating separate services for the database, API, and frontend with proper health checks and service dependencies to ensure smooth startup."

---

## 📖 Study Resources

### Laravel
- Official Documentation: laravel.com/docs
- Eloquent ORM deep dive
- Middleware and request lifecycle
- Authentication (Sanctum vs Passport)

### Next.js
- Next.js Documentation: nextjs.org/docs
- Server vs Client Components
- App Router patterns
- Data fetching strategies

### Docker
- Docker Documentation: docs.docker.com
- Docker Compose
- Multi-stage builds
- Container networking

### General Backend
- RESTful API design principles
- HTTP status codes
- Authentication vs Authorization
- Database normalization
- N+1 query problem
- CORS

---

## 🚀 Next Steps to Strengthen Your Knowledge

1. **Add Testing**
   - PHPUnit tests for Laravel
   - Feature tests for API endpoints
   - Unit tests for business logic

2. **Add More Features**
   - Email notifications
   - Task sharing/collaboration
   - Real-time updates (WebSockets)
   - Search functionality

3. **Performance Optimization**
   - Database query optimization
   - Caching (Redis)
   - API rate limiting
   - Image optimization

4. **Deployment**
   - Production Docker setup
   - CI/CD pipeline
   - Environment management
   - Monitoring and logging

5. **Advanced Concepts**
   - Queue jobs for long-running tasks
   - Event-driven architecture
   - Microservices patterns
   - GraphQL API

---

**Good luck with your interview! 🎯**

This project demonstrates strong full-stack skills, clean code practices, and modern development workflows. Be confident in what you've built!
