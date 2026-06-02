# OmniDesk

## Unified IT Help Desk & Ticket Management Platform

## Overview

OmniDesk is a full-stack web application designed to manage IT support tickets, user roles, authentication, ticket workflows, dashboards, notifications, and reporting.

The system simulates an enterprise IT help desk environment where employees can submit support requests, while IT support agents, managers, and administrators can manage tickets, users, roles, and operational workflows.

This repository currently includes the work completed for Week 1 and Week 2 of the project.

---

## Main Features

* User authentication
* Role-based access control
* User registration and login
* JWT token-based authentication
* Protected API routes
* Admin-only authorization route
* Ticket creation and management
* Ticket assignment workflow
* Comments and notifications
* Dashboard and reporting
* Admin panel

---

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router DOM
* CSS

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* JWT Bearer Authentication
* BCrypt password hashing

### Database

* SQL Server Express
* SQL Server Management Studio

### Tools

* GitHub
* Visual Studio Code
* Postman
* Draw.io
* Figma

---

## Project Structure

```txt
omnidesk/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   └── OmniDesk.Api/
│       ├── Controllers/
│       │   └── AuthController.cs
│       ├── Data/
│       │   └── ApplicationDbContext.cs
│       ├── DTOs/
│       │   ├── LoginDto.cs
│       │   └── RegisterDto.cs
│       ├── Models/
│       │   ├── User.cs
│       │   └── Role.cs
│       ├── Migrations/
│       ├── Program.cs
│       └── appsettings.json
│
├── database/
├── docs/
└── README.md
```

---

## Current Status

## Week 1 — Requirements Analysis and Planning

Completed:

* Requirements analysis
* Project planning
* Workflow diagrams
* UI wireframes
* Database schema planning
* ERD planning
* Initial documentation

## Week 2 — Project Setup, Authentication, and Role Management

Completed:

* React frontend project setup
* ASP.NET Core Web API backend setup
* SQL Server database connection
* Entity Framework Core configuration
* User model
* Role model
* Database context setup
* Database migrations
* Seeded default roles
* JWT authentication
* Role-based authorization
* Register endpoint
* Login endpoint
* Protected profile endpoint
* Admin-only protected endpoint
* Login page
* Register page
* Dashboard/index page
* Frontend connected to backend API
* Backend tested using Postman
* Frontend login tested in browser

---

## Implemented Roles

The system currently supports four roles:

| Role ID | Role Name        |
| ------- | ---------------- |
| 1       | Admin            |
| 2       | Employee         |
| 3       | IT Support Agent |
| 4       | Manager          |

The roles are seeded into the database using Entity Framework Core migrations.

---

## Database

Database name:

```txt
OmniDeskDb
```

Current tables:

* Users
* Roles
* __EFMigrationsHistory

The database connection is configured in:

```txt
backend/OmniDesk.Api/appsettings.json
```

Example connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS01;Database=OmniDeskDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

## Backend API Endpoints

## Register User

```http
POST /api/auth/register
```

Creates a new user account.

Example request body:

```json
{
  "fullName": "Admin User",
  "email": "admin@omnidesk.com",
  "password": "Admin123!",
  "roleId": 1
}
```

Example response:

```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "fullName": "Admin User",
    "email": "admin@omnidesk.com",
    "role": "Admin"
  }
}
```

---

## Login User

```http
POST /api/auth/login
```

Authenticates an existing user and returns a JWT token.

Example request body:

```json
{
  "email": "admin@omnidesk.com",
  "password": "Admin123!"
}
```

The response includes:

* JWT token
* User ID
* Full name
* Email
* Role

---

## Authenticated Profile

```http
GET /api/auth/profile
```

Protected route that requires a valid Bearer Token.

Expected response:

```json
{
  "message": "You are authenticated.",
  "email": "admin@omnidesk.com",
  "role": "Admin"
}
```

---

## Admin-Only Route

```http
GET /api/auth/admin-only
```

Protected route that requires the user to have the Admin role.

Expected response:

```txt
Admin access granted.
```

---

## How to Run the Backend

Open Command Prompt from the project root:

```cmd
cd backend\OmniDesk.Api
dotnet run
```

The backend runs on:

```txt
http://localhost:5081
```

---

## How to Run the Frontend

Open another Command Prompt from the project root:

```cmd
cd frontend
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

---

## Frontend Pages Implemented

## Login Page

The login page allows an existing user to enter their email and password. After a successful login, the JWT token and user information are stored in local storage, and the user is redirected to the dashboard.

## Register Page

The register page allows a new user to create an account by entering:

* Full name
* Email
* Password
* Role

## Dashboard Page

The dashboard page displays the logged-in user’s name and role. It acts as the current index page after authentication.

---

## Authentication Flow

1. User registers with full name, email, password, and role.
2. Backend hashes the password using BCrypt.
3. User logs in with email and password.
4. Backend validates credentials.
5. Backend generates a JWT token.
6. Frontend stores the JWT token in local storage.
7. Protected routes use the token as a Bearer Token.
8. Role-based authorization controls access to admin-only routes.

---

## Testing Completed

Testing was completed using Postman, SQL Server Management Studio, and the browser.

Completed tests:

* Register user using Postman
* Login user using Postman
* JWT token returned successfully
* Protected profile endpoint tested with Bearer Token
* Admin-only endpoint tested successfully
* SQL Server Roles table verified
* Frontend login tested successfully
* Dashboard displayed logged-in user name and role

---

## Screenshots to Include in Documentation

Recommended screenshots:

1. Login page
2. Register page
3. Dashboard page
4. Postman register response
5. Postman login response with JWT token
6. Postman admin-only response
7. SQL Server Roles table
8. Backend running in terminal
9. Frontend running in terminal

---

## Next Steps

The next phase of development will focus on Week 3 features:

* Ticket CRUD operations
* Ticket categories
* Ticket priorities
* Ticket statuses
* Ticket list page
* Create ticket page
* Ticket details page
* Basic ticket filtering and search

---

## Author

OmniDesk was developed as part of a full-stack web development internship project.

