# Backend Interview Preparation Guide

A quick reference guide based on the Todo App Laravel API project.

---

## 1. Architecture Overview

```
Request → Routes → Middleware → Controller → Handler → Service → Model → Database
                                     ↓
                              FormRequest (Validation)
                                     ↓
                              ApiResponse (Response)
```

**Key Pattern**: Controller-Handler-Service (Separation of Concerns)
- **Controller**: Receives HTTP requests, delegates to handlers
- **Handler**: Orchestrates business logic, transforms responses
- **Service**: Contains core business logic, interacts with models
- **Model**: Data representation with Eloquent ORM

---

## 2. Authentication (Laravel Sanctum)

### Token-Based Authentication
```php
// Generate token on login/register
$token = $user->createToken('api')->plainTextToken;

// Protect routes
Route::middleware('auth:sanctum')->group(function () {
    // Protected routes here
});

// Delete token on logout
$user->currentAccessToken()->delete();
```

### Key Interview Points:
- Sanctum uses `personal_access_tokens` table
- Token sent in `Authorization: Bearer {token}` header
- Stateless authentication (no sessions)
- Password hashing uses `bcrypt` via Laravel's `Hash` facade

---

## 3. Middleware

### Custom Middleware Examples:

**CheckUserActive** - Block deactivated users:
```php
public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();
    if ($user && !$user->is_active) {
        $user->currentAccessToken()->delete();
        return ApiResponse::forbidden('Account deactivated');
    }
    return $next($request);
}
```

**EnsureAdmin** - Role-based access:
```php
public function handle(Request $request, Closure $next): Response
{
    if (!$request->user()?->isAdmin()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    return $next($request);
}
```

### Middleware Order (important!):
```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware([CheckUserActive::class])->group(function () {
        Route::middleware('admin')->group(function () {
            // Admin-only routes
        });
    });
});
```

---

## 4. Eloquent ORM & Relationships

### Model Definitions:
```php
// User Model
class User extends Authenticatable {
    use HasFactory, Notifiable, HasApiTokens;
    
    protected $fillable = ['name', 'email', 'password', 'role', 'is_active'];
    protected $hidden = ['password', 'remember_token'];
    
    protected function casts(): array {
        return ['password' => 'hashed', 'is_active' => 'boolean'];
    }
    
    // Relationships
    public function tasks() { return $this->hasMany(Task::class); }
    public function preference() { return $this->hasOne(UserPreference::class); }
}

// Task Model
class Task extends Model {
    protected $fillable = ['title', 'description', 'status', 'priority', 'due_date', 'user_id'];
    protected $casts = ['due_date' => 'date'];
    
    public function user() { return $this->belongsTo(User::class); }
    public function attachments() { return $this->hasMany(Attachment::class); }
}
```

### Relationships Summary:
| Relationship | Example |
|-------------|---------|
| `hasMany` | User → Tasks |
| `belongsTo` | Task → User |
| `hasOne` | User → UserPreference |

---

## 5. Form Request Validation

```php
class CreateTaskRequest extends FormRequest
{
    public function authorize() { return true; }
    
    public function rules() {
        return [
            'title' => 'required|string|max:120',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,completed',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
        ];
    }
}
```

### Common Validation Rules:
- `required`, `nullable`, `sometimes`
- `string`, `email`, `integer`, `boolean`, `date`
- `max:255`, `min:8`
- `unique:table,column`, `exists:table,column`
- `in:val1,val2`, `confirmed`

---

## 6. API Resources (Response Transformation)

```php
class TaskResource extends JsonResource
{
    public function toArray(Request $request) {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status,
            'due_date' => $this->due_date?->toIso8601String(),
            'attachments' => AttachmentResource::collection(
                $this->whenLoaded('attachments')
            ),
        ];
    }
}
```

### Standardized API Response:
```php
class ApiResponse {
    public static function success($data, string $message, int $code = 200) {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }
    
    public static function error(string $message, int $code, $errors = null) {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
```

---

## 7. RESTful API Design

### Routes Structure:
```php
Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('tasks', TaskController::class);
        Route::get('/tasks-statistics', [TaskController::class, 'statistics']);
    });
});
```

### HTTP Methods & Status Codes:
| Method | Use Case | Success Code |
|--------|----------|--------------|
| GET | Retrieve resource | 200 |
| POST | Create resource | 201 |
| PUT/PATCH | Update resource | 200 |
| DELETE | Remove resource | 200/204 |

### Error Codes:
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `422` Validation Error
- `500` Server Error

---

## 8. Database Migrations

```php
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title', 120);
    $table->text('description')->nullable();
    $table->enum('status', ['todo','in_progress','completed'])->default('todo')->index();
    $table->date('due_date')->nullable()->index();
    $table->timestamps();
});
```

### Key Concepts:
- **Foreign Keys**: `foreignId('user_id')->constrained()`
- **Cascade Delete**: `onDelete('cascade')`
- **Indexes**: Improve query performance on filtered columns
- **Enums**: Restrict values to predefined set

---

## 9. Query Building & Filtering

```php
public function getAllTasks(User $user, array $filters)
{
    $query = Task::with('attachments');  // Eager loading
    
    // Role-based filtering
    if (!$user->isAdmin()) {
        $query->where('user_id', $user->id);
    }
    
    // Dynamic filters
    if (!empty($filters['status'])) {
        $query->where('status', $filters['status']);
    }
    
    // Search
    if (!empty($filters['search'])) {
        $query->where('title', 'like', "%{$filters['search']}%");
    }
    
    // Custom sorting
    if ($filters['sort'] === 'priority') {
        $query->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')");
    }
    
    return $query->paginate($filters['per_page']);
}
```

### N+1 Problem Solution:
```php
// Bad: N+1 queries
$tasks = Task::all();
foreach ($tasks as $task) {
    echo $task->user->name;  // Extra query per task
}

// Good: Eager loading
$tasks = Task::with('user')->get();  // Only 2 queries
```

---

## 10. File Upload Handling

```php
class AttachmentService
{
    public function uploadAttachment(Task $task, UploadedFile $file): Attachment
    {
        $path = $file->store('attachments', 'public');
        
        return Attachment::create([
            'task_id' => $task->id,
            'uploaded_by' => auth()->id(),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
        ]);
    }
}
```

### Validation:
```php
$request->validate([
    'file' => 'required|file|max:10240|mimes:jpeg,png,pdf,doc,docx'
]);
```

---

## 11. Database Transactions

```php
$task = DB::transaction(function() use ($validated, $request) {
    $task = Task::create([...]);
    
    foreach ($request->file('attachments') as $file) {
        $this->attachmentService->uploadAttachment($task, $file);
    }
    
    return $task;
});
```

**Use transactions when**: Multiple related database operations must succeed or fail together.

---

## 12. Business Logic Protection

```php
class UserService
{
    public function ensureAtLeastOneAdmin(User $user, ?string $newRole): void
    {
        if ($newRole === 'admin' || !$user->isAdmin()) return;
        
        $adminCount = User::where('role', 'admin')->count();
        
        if ($adminCount <= 1) {
            throw new \Exception('Cannot modify the last admin.');
        }
    }
}
```

---

## 13. Common Interview Questions

### Q: Explain the request lifecycle in Laravel
**A**: Request → `index.php` → Service Container → HTTP Kernel → Middleware → Router → Controller → Response

### Q: Difference between `Middleware` and `FormRequest`?
**A**: 
- **Middleware**: Runs on every request (auth, logging, CORS)
- **FormRequest**: Validates specific request data before controller

### Q: What is Dependency Injection?
**A**: Laravel's service container automatically resolves and injects dependencies:
```php
public function __construct(TaskService $taskService) {
    $this->taskService = $taskService;  // Auto-injected
}
```

### Q: How do you prevent SQL injection?
**A**: Use Eloquent ORM or query builder with parameter binding:
```php
// Safe
$users = User::where('email', $email)->first();

// Also safe
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

### Q: What is Eager Loading?
**A**: Loading related models in advance to prevent N+1 queries:
```php
Task::with(['user', 'attachments'])->get();
```

### Q: Explain API versioning benefits
**A**: 
- Backward compatibility
- Gradual migration
- Multiple client support
- Route grouping: `Route::prefix('v1')`

---

## 14. Security Checklist

- [x] Token-based authentication (Sanctum)
- [x] Password hashing (bcrypt)
- [x] Form validation on all inputs
- [x] Role-based access control
- [x] User status verification
- [x] CORS configuration
- [x] SQL injection prevention (Eloquent)
- [x] File upload validation (type, size)

---

## 15. Quick Reference Commands

```bash
# Artisan commands
php artisan route:list          # List all routes
php artisan migrate             # Run migrations
php artisan make:controller     # Create controller
php artisan make:model -m       # Create model + migration
php artisan make:middleware     # Create middleware
php artisan make:request        # Create form request
php artisan make:resource       # Create API resource
php artisan test                # Run tests

# Database
php artisan migrate:fresh       # Drop all & re-run migrations
php artisan db:seed             # Run seeders
php artisan tinker              # Interactive shell
```

---

## Summary

This Todo App demonstrates:
1. **Clean Architecture**: Controller → Handler → Service → Model
2. **Authentication**: Laravel Sanctum token-based auth
3. **Authorization**: Middleware + role-based access
4. **Validation**: Form Requests with custom rules
5. **API Design**: RESTful endpoints with versioning
6. **Response Handling**: Standardized JSON responses
7. **Database**: Eloquent ORM with relationships
8. **File Handling**: Secure file uploads with validation

**Good luck with your interview!** 🚀
