# 📝 Quick Reference Cheat Sheet - Todo App Interview

## 🎯 Project in 30 Seconds
Full-stack task management app with authentication, RBAC, and file attachments.
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Laravel 12 + PHP 8.2 + MySQL 8.0
- **Deployment**: Docker Compose (3 services)

---

## 🏗️ Architecture Quick Facts

```
Frontend (Next.js :3000) ←→ Backend API (Laravel :8000) ←→ Database (MySQL :3307)
```

### Tech Stack at a Glance
| Layer | Technology | Why? |
|-------|-----------|------|
| Frontend | Next.js 15 | SSR, file-based routing, React Server Components |
| UI Library | React 19 | Component-based, hooks, virtual DOM |
| Language | TypeScript | Type safety, better IDE support |
| Styling | Tailwind CSS v4 | Utility-first, rapid development |
| Backend | Laravel 12 | Elegant syntax, built-in auth, ORM |
| Auth | Sanctum | Token-based API authentication |
| Database | MySQL 8.0 | Relational data, ACID compliance |
| ORM | Eloquent | Active Record pattern, relationships |
| Containers | Docker | Consistent environments, easy setup |

---

## 📊 Database Schema (4 Tables)

```
users
├── id, name, email, password
├── role (admin/user), is_active
└── timestamps

tasks
├── id, user_id (FK)
├── title, description
├── status (todo/in_progress/completed)
├── priority (low/medium/high)
├── due_date, completed_at
└── timestamps

attachments
├── id, task_id (FK), uploaded_by (FK)
├── file_name, file_path, file_size
└── timestamps

user_preferences
├── id, user_id (FK)
├── theme, notification settings
└── timestamps
```

**Relationships:**
- User → Tasks (1:N)
- User → Attachments (1:N)
- User → Preferences (1:1)
- Task → Attachments (1:N)

---

## 🔌 API Endpoints Summary

```
Auth:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

Tasks (Protected):
GET    /api/v1/tasks              # List (filters: status, priority, search)
POST   /api/v1/tasks              # Create
GET    /api/v1/tasks/{id}         # Get one
PUT    /api/v1/tasks/{id}         # Update
DELETE /api/v1/tasks/{id}         # Delete
GET    /api/v1/tasks-statistics   # Stats

Attachments (Protected):
GET    /api/v1/tasks/{task}/attachments
POST   /api/v1/tasks/{task}/attachments
DELETE /api/v1/tasks/{task}/attachments/{id}

Admin Only:
GET    /api/v1/users              # List users
PATCH  /api/v1/users/{id}/role    # Change role
PATCH  /api/v1/users/{id}/toggle  # Activate/deactivate
```

---

## 🔐 Security Checklist

✅ **Passwords**: Bcrypt hashing with salt
✅ **Auth**: Token-based (Sanctum), stored in localStorage
✅ **SQL Injection**: Eloquent ORM with prepared statements
✅ **CSRF**: Protected by Sanctum
✅ **CORS**: Configured for localhost:3000
✅ **RBAC**: Middleware checks (admin/user roles)
✅ **Input Validation**: Form Requests (backend), Zod (frontend)
✅ **File Upload**: Type/size validation, renamed files
✅ **Active Users**: Middleware blocks inactive accounts

---

## 💡 Key Interview Talking Points

### Frontend
1. **React Hooks**: useState, useEffect, useContext for state management
2. **Next.js App Router**: Server/Client Components, file-based routing
3. **TypeScript**: Type safety, interfaces for API responses
4. **Form Handling**: React Hook Form + Zod validation
5. **UI Components**: Radix UI (accessible, unstyled) + Tailwind

### Backend
1. **MVC Pattern**: Controllers handle HTTP, Models represent data
2. **Eloquent ORM**: Active Record, relationships (hasMany, belongsTo)
3. **Middleware Chain**: auth:sanctum → CheckUserActive → admin
4. **Form Requests**: Encapsulate validation logic
5. **Handler Pattern**: Business logic separated from controllers

### Database
1. **Foreign Keys**: Cascade delete for data integrity
2. **Indexes**: On status, priority, due_date for fast queries
3. **Timestamps**: created_at, updated_at auto-managed
4. **Enums**: Status and priority constrained to valid values

### DevOps
1. **Docker Compose**: 3 services (db, api, web) on shared network
2. **Health Checks**: DB health check before API starts
3. **Volumes**: Persistent data (db_data), code mounting
4. **Port Mapping**: 3000, 8000, 3307 to avoid conflicts

---

## 🎨 Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| MVC | Laravel backend | Separation of concerns |
| Repository | TaskHandler | Business logic isolation |
| Singleton | API client | Reuse configured axios instance |
| Factory | Eloquent models | Create test data easily |
| Observer | Events | Decouple side effects |
| Middleware | Auth/RBAC | Request filtering pipeline |

---

## 📈 Scalability Considerations

**Database:**
- Add read replicas for read-heavy workload
- Implement query caching (Redis)
- Optimize N+1 queries with eager loading

**Application:**
- Horizontal scaling with load balancer
- Queue system for async tasks (emails, notifications)
- API rate limiting to prevent abuse

**Frontend:**
- CDN for static assets
- Code splitting (automatic in Next.js)
- Image optimization (next/image)

**Infrastructure:**
- Kubernetes for orchestration
- Monitoring (Datadog, New Relic)
- Centralized logging (ELK stack)

---

## 🔥 Common Pitfalls & Solutions

### N+1 Query Problem
❌ **Bad:**
```php
$tasks = Task::all();
foreach ($tasks as $task) {
    echo $task->user->name; // Query for each task!
}
```

✅ **Good:**
```php
$tasks = Task::with('user')->get(); // Single query with join
```

### React State Updates
❌ **Bad:**
```typescript
tasks.push(newTask) // Mutates state
setTasks(tasks)
```

✅ **Good:**
```typescript
setTasks([...tasks, newTask]) // Immutable update
```

### SQL Injection
❌ **Bad:**
```php
DB::select("SELECT * FROM tasks WHERE id = " . $id);
```

✅ **Good:**
```php
Task::find($id); // Uses prepared statements
```

---

## 🗣️ Must-Know Definitions

**SSR (Server-Side Rendering)**: Render React components on server for faster initial load and SEO.

**JWT (JSON Web Token)**: Compact token format for authentication, encoded JSON payload.

**ORM (Object-Relational Mapping)**: Maps database tables to objects (classes).

**CRUD**: Create, Read, Update, Delete - basic data operations.

**REST**: Architectural style using HTTP methods (GET, POST, PUT, DELETE) for API.

**Middleware**: Functions that intercept HTTP requests before reaching controller.

**Migration**: Version control for database schema changes.

**Eloquent**: Laravel's ORM, Active Record implementation.

**Sanctum**: Laravel's lightweight authentication system for SPAs and APIs.

**Hydration**: Process of attaching event handlers to SSR-rendered HTML in React.

---

## ⚡ One-Line Answers

**Q: Why Next.js over React?**  
A: Built-in SSR, file-based routing, automatic code splitting, better SEO, and performance.

**Q: Why Laravel over Node.js?**  
A: Mature ecosystem, built-in auth/ORM, convention over configuration, rapid development.

**Q: Why MySQL over MongoDB?**  
A: Relational data (users → tasks), ACID transactions, foreign key constraints, mature tooling.

**Q: Why TypeScript?**  
A: Catch errors at compile-time, better IDE support, self-documenting code, easier refactoring.

**Q: Why Docker?**  
A: Consistent environments, easy onboarding, isolation, portability across systems.

**Q: Why token-based auth?**  
A: Stateless, scalable, works with SPA, no session storage needed, mobile-friendly.

**Q: Why Tailwind CSS?**  
A: Rapid development, no CSS files, consistent design, small bundle size, no naming conflicts.

**Q: Why separate frontend/backend?**  
A: Independent scaling, technology flexibility, clear separation, multiple frontends possible.

---

## 🎯 5-Minute Demo Script

1. **Show Architecture** (30s)
   - "3-tier: Next.js frontend, Laravel API, MySQL database, all in Docker"

2. **Register User** (30s)
   - "TypeScript form with Zod validation, bcrypt password hashing"

3. **Login** (30s)
   - "Sanctum generates token, stored in localStorage, sent in headers"

4. **Create Task** (45s)
   - "POST to /api/v1/tasks, authenticated via token, stores in MySQL"

5. **Show Filtering** (30s)
   - "Filter by status, priority, search - indexed columns for performance"

6. **Upload File** (45s)
   - "Multipart form data, validation, stored in storage/, metadata in DB"

7. **Admin Panel** (30s)
   - "Role-based access, middleware checks, user management"

8. **Show Code** (90s)
   - "TaskController → TaskHandler → Task model → database"
   - "React component → API call → display"

---

## 📚 If You Have 10 Minutes Before Interview

1. ✅ Review this cheat sheet (you're doing it!)
2. ✅ Run `docker-compose up` and test the app
3. ✅ Look at `api/routes/api.php` for endpoints
4. ✅ Look at `api/app/Models/Task.php` for relationships
5. ✅ Look at `web/app/tasks/page.tsx` for frontend
6. ✅ Practice explaining: "User logs in → token → makes request → middleware → controller → model → DB"
7. ✅ Prepare 3 questions for interviewer
8. ✅ Deep breath, you got this! 💪

---

## 🌟 Confidence Boosters

- ✅ You built a **production-ready** full-stack application
- ✅ You used **modern, industry-standard** technologies
- ✅ You implemented **authentication** and **security** best practices
- ✅ You understand **database design** and **relationships**
- ✅ You can explain **architectural decisions** and **trade-offs**
- ✅ You've handled **Docker** and **containerization**
- ✅ You know both **frontend** and **backend** deeply

**You're prepared. You're qualified. You've got this!** 🚀

---

## 🆘 Emergency Phrases

**"I don't know"** → "I haven't worked with that specifically, but based on my experience with [similar tech], I would approach it by..."

**"I forgot"** → "Let me think through this... [explain your reasoning process]"

**"I'm stuck"** → "Could you give me a hint or rephrase the question?"

**"I disagree"** → "That's an interesting approach. In my experience, I've found [your approach] works because..."

---

**Quick tip**: Star this repo and the full guide. Review on your phone before the interview! 📱⭐
