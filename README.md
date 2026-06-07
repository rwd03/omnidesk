# OmniDesk

## Unified IT Help Desk & Ticket Management Platform

## Overview

OmniDesk is a full-stack web application designed to manage IT support tickets, user roles, authentication, ticket workflows, dashboards, notifications, and reporting.

The system simulates an enterprise IT help desk environment where employees can submit support requests, while IT support agents, managers, and administrators can manage tickets, users, roles, and operational workflows.

This repository currently includes the work completed for Week 1, Week 2, and Week 3 of the project.

---

## Main Features

* User authentication
* Role-based access control
* User registration and login
* JWT token-based authentication
* Protected API routes
* Admin-only authorization route
* Ticket creation
* Ticket listing
* Ticket editing and updating
* Ticket deletion
* Ticket categories
* Ticket priorities
* Ticket statuses
* Dashboard navigation
* Frontend connected with backend APIs

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

```text
omnidesk/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── ticketsApi.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TicketList.jsx
│   │   │   ├── CreateTicket.jsx
│   │   │   └── EditTicket.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   └── OmniDesk.Api/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── TicketsController.cs
│       │   ├── CategoriesController.cs
│       │   ├── PrioritiesController.cs
│       │   └── StatusesController.cs
│       ├── Data/
│       │   └── ApplicationDbContext.cs
│       ├── DTOs/
│       │   ├── LoginDto.cs
│       │   ├── RegisterDto.cs
│       │   └── Tickets/
│       │       ├── CreateTicketDto.cs
│       │       ├── UpdateTicketDto.cs
│       │       └── TicketResponseDto.cs
│       ├── Models/
│       │   ├── User.cs
│       │   ├── Role.cs
│       │   ├── Ticket.cs
│       │   ├── Category.cs
│       │   ├── Priority.cs
│       │   └── Status.cs
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

---

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
* Dashboard page
* Frontend connected to backend API
* Backend tested using Postman
* Frontend login tested in browser

---

## Week 3 — Ticket Management CRUD Module

Completed:

* Ticket model
* Category model
* Priority model
* Status model
* Ticket DTOs
* Ticket database migration
* Seeded ticket categories
* Seeded ticket priorities
* Seeded ticket statuses
* Ticket creation API
* Ticket listing API
* Ticket details API
* Ticket update API
* Ticket delete API
* Categories API
* Priorities API
* Statuses API
* Postman API testing
* React ticket API service
* Ticket list page
* Create ticket page
* Edit ticket page
* Delete ticket functionality
* Dashboard button to access ticket module
* Back button from ticket list to dashboard
* Full frontend/backend ticket CRUD flow tested

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

## Ticket Categories

The following ticket categories are seeded into the database:

| Category ID | Category Name  |
| ----------- | -------------- |
| 1           | Hardware       |
| 2           | Software       |
| 3           | Network        |
| 4           | Email          |
| 5           | Access Request |
| 6           | Other          |

---

## Ticket Priorities

The following ticket priorities are seeded into the database:

| Priority ID | Priority Name |
| ----------- | ------------- |
| 1           | Low           |
| 2           | Medium        |
| 3           | High          |
| 4           | Critical      |

---

## Ticket Statuses

The following ticket statuses are seeded into the database:

| Status ID | Status Name |
| --------- | ----------- |
| 1         | Open        |
| 2         | In Progress |
| 3         | Pending     |
| 4         | Resolved    |
| 5         | Closed      |

---

## Database

Database name:

```text
OmniDeskDb
```

Current tables:

* Users
* Roles
* Tickets
* Categories
* Priorities
* Statuses
* __EFMigrationsHistory

The database connection is configured in:

```text
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

## Authentication Endpoints

### Register User

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

### Login User

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

### Authenticated Profile

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

### Admin-Only Route

```http
GET /api/auth/admin-only
```

Protected route that requires the user to have the Admin role.

Expected response:

```text
Admin access granted.
```

---

## Ticket Endpoints

All ticket endpoints require a valid JWT Bearer Token.

### Get All Tickets

```http
GET /api/tickets
```

Returns all tickets with category, priority, status, creator, and creation date.

---

### Get Ticket by ID

```http
GET /api/tickets/{id}
```

Returns a single ticket by ID.

---

### Create Ticket

```http
POST /api/tickets
```

Example request body:

```json
{
  "title": "Internet problem",
  "description": "The internet connection is not working in my office.",
  "categoryId": 3,
  "priorityId": 3
}
```

Example response:

```json
{
  "message": "Ticket created successfully.",
  "ticketId": 1,
  "referenceNumber": "TCK-2026-XXXXXXXX"
}
```

---

### Update Ticket

```http
PUT /api/tickets/{id}
```

Example request body:

```json
{
  "title": "Internet problem updated",
  "description": "The connection is unstable and keeps disconnecting.",
  "categoryId": 3,
  "priorityId": 4,
  "statusId": 2
}
```

---

### Delete Ticket

```http
DELETE /api/tickets/{id}
```

Deletes a ticket by ID.

---

## Lookup Endpoints

### Get Categories

```http
GET /api/categories
```

### Get Priorities

```http
GET /api/priorities
```

### Get Statuses

```http
GET /api/statuses
```

---

## How to Run the Backend

Open Command Prompt from the project root:

```bash
cd backend\OmniDesk.Api
dotnet run
```

The backend runs on:

```text
http://localhost:5081
```

---

## How to Run the Frontend

Open another Command Prompt from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Frontend Pages Implemented

### Login Page

The login page allows an existing user to enter their email and password. After a successful login, the JWT token and user information are stored in local storage, and the user is redirected to the dashboard.

### Register Page

The register page allows a new user to create an account by entering:

* Full name
* Email
* Password
* Role

### Dashboard Page

The dashboard page displays the logged-in user’s name and role. It also includes a button to access the ticket management module.

### Ticket List Page

The ticket list page displays all created tickets with:

* Reference number
* Title
* Category
* Priority
* Status
* Created by
* Created date
* Edit action
* Delete action

### Create Ticket Page

The create ticket page allows users to create a new support ticket using:

* Title
* Description
* Category dropdown
* Priority dropdown

### Edit Ticket Page

The edit ticket page allows users to update:

* Title
* Description
* Category
* Priority
* Status

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

## Ticket Management Flow

1. User logs in.
2. User opens the dashboard.
3. User clicks View Tickets.
4. User can view existing tickets.
5. User can create a new ticket.
6. User can edit ticket details and status.
7. User can delete a ticket.
8. The frontend communicates with the ASP.NET Core backend using Axios.
9. The backend stores and retrieves ticket data from SQL Server.

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
* SQL Server ticket-related tables verified
* Categories seed data verified
* Priorities seed data verified
* Statuses seed data verified
* Get categories API tested
* Get priorities API tested
* Get statuses API tested
* Create ticket API tested
* Get tickets API tested
* Update ticket API tested
* Delete ticket API tested
* Frontend login tested successfully
* Dashboard displayed logged-in user name and role
* Ticket list page tested
* Create ticket page tested
* Edit ticket page tested
* Delete ticket button tested

---

## Screenshots to Include in Documentation

Recommended screenshots:

* Login page
* Register page
* Dashboard page
* Ticket list page
* Create ticket page
* Edit ticket page
* Postman login response with JWT token
* Postman create ticket response
* Postman get tickets response
* SQL Server Roles table
* SQL Server Tickets table
* SQL Server Categories table
* Backend running in terminal
* Frontend running in terminal

---

## Next Steps

The next phase of development will focus on Week 4 features:

* Ticket assignment workflow
* Assign tickets to IT support agents
* Reassign tickets
* Ticket comments
* Internal notes
* Ticket status workflow improvements
* Assignment history
* Audit trail for ticket actions

---

## Author

OmniDesk was developed as part of a full-stack web development internship project.

