# OmniDesk

## Unified IT Help Desk & Ticket Management Platform

## Overview

OmniDesk is a full-stack web application designed to manage IT support tickets, user roles, authentication, ticket workflows, dashboards, notifications, and reporting.

The system simulates an enterprise IT help desk environment where employees can submit support requests, while IT support agents, managers, and administrators can manage tickets, users, roles, and operational workflows.

This repository currently includes the work completed for Week 1, Week 2, Week 3, and Week 4 of the project.

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
* Ticket assignment to IT support agents
* Ticket status workflow updates
* Ticket comments and replies
* Ticket activity history tracking
* Activity logs for ticket actions
* Dashboard navigation
* Ticket details page
* Frontend connected with backend APIs

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
* SQL Server command-line testing using `sqlcmd`

### Tools

* GitHub
* Visual Studio Code
* Postman
* SQL Server Express
* Draw.io
* Figma

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
│   │   │   ├── EditTicket.jsx
│   │   │   └── TicketDetails.jsx
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
│       │       ├── TicketResponseDto.cs
│       │       ├── AssignTicketDto.cs
│       │       ├── UpdateTicketStatusDto.cs
│       │       └── CreateTicketCommentDto.cs
│       ├── Models/
│       │   ├── User.cs
│       │   ├── Role.cs
│       │   ├── Ticket.cs
│       │   ├── Category.cs
│       │   ├── Priority.cs
│       │   ├── Status.cs
│       │   ├── TicketComment.cs
│       │   └── ActivityLog.cs
│       ├── Migrations/
│       ├── Program.cs
│       └── appsettings.json
│
├── database/
├── docs/
└── README.md
```

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
* Dashboard page
* Frontend connected to backend API
* Backend tested using Postman
* Frontend login tested in browser

## Week 3 — Ticket Management System and CRUD Operations

### Objectives

* Build ticket management system
* Implement CRUD operations
* Connect frontend with backend APIs

### Completed Tasks

* Created Ticket model
* Created Category model
* Created Priority model
* Created Status model
* Created ticket DTOs
* Added ticket database migration
* Seeded ticket categories
* Seeded ticket priorities
* Seeded ticket statuses
* Implemented ticket creation API
* Implemented ticket listing API
* Implemented ticket details API
* Implemented ticket update API
* Implemented ticket delete API
* Implemented Categories API
* Implemented Priorities API
* Implemented Statuses API
* Tested ticket APIs using Postman
* Created React ticket API service
* Created ticket list page
* Created create ticket page
* Created edit ticket page
* Implemented delete ticket functionality
* Added dashboard button to access ticket module
* Added back button from ticket list to dashboard
* Connected React frontend with ASP.NET Core backend APIs using Axios
* Tested full frontend/backend ticket CRUD flow

## Week 4 — Ticket Assignment, Workflow, Comments, and Activity Logs

### Objectives

* Build ticket assignment system
* Add ticket workflow logic
* Implement comments and history tracking

### Completed Tasks

* Added ticket assignment functionality
* Added `AssignedToUserId` to the Ticket model
* Created `TicketComment` model
* Created `ActivityLog` model
* Added database migration for assignment, comments, and activity logs
* Created ticket assignment API endpoint
* Created ticket status update API endpoint
* Created add comment/reply API endpoint
* Created get comments API endpoint
* Created get ticket history API endpoint
* Added activity logs for ticket assignment
* Added activity logs for ticket status updates
* Added activity logs for new comments
* Updated React ticket API service with Week 4 endpoints
* Created Ticket Details page
* Added View Details button in the ticket list page
* Added ticket assignment section in frontend
* Added status update section in frontend
* Added comments section in frontend
* Added activity history section in frontend
* Tested assignment, status update, comments, and history using Postman
* Tested full Week 4 frontend/backend workflow in browser

## Implemented Roles

The system currently supports four roles:

| Role ID | Role Name        |
| ------- | ---------------- |
| 1       | Admin            |
| 2       | Employee         |
| 3       | IT Support Agent |
| 4       | Manager          |

The roles are seeded into the database using Entity Framework Core migrations.

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

## Ticket Priorities

The following ticket priorities are seeded into the database:

| Priority ID | Priority Name |
| ----------- | ------------- |
| 1           | Low           |
| 2           | Medium        |
| 3           | High          |
| 4           | Critical      |

## Ticket Statuses

The following ticket statuses are seeded into the database:

| Status ID | Status Name |
| --------- | ----------- |
| 1         | Open        |
| 2         | In Progress |
| 3         | Pending     |
| 4         | Resolved    |
| 5         | Closed      |

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
* TicketComments
* ActivityLogs
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

### Admin-Only Route

```http
GET /api/auth/admin-only
```

Protected route that requires the user to have the Admin role.

Expected response:

```text
Admin access granted.
```

## Ticket CRUD Endpoints

All ticket endpoints require a valid JWT Bearer Token.

### Get All Tickets

```http
GET /api/tickets
```

Returns all tickets with category, priority, status, creator, and creation date.

### Get Ticket by ID

```http
GET /api/tickets/{id}
```

Returns a single ticket by ID.

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

### Delete Ticket

```http
DELETE /api/tickets/{id}
```

Deletes a ticket by ID.

## Week 4 Workflow Endpoints

### Assign Ticket to Agent

```http
PUT /api/tickets/{id}/assign
```

Assigns a ticket to an IT Support Agent.

Example request body:

```json
{
  "assignedToUserId": 2
}
```

Example response:

```json
{
  "message": "Ticket assigned successfully.",
  "ticketId": 3,
  "assignedToUserId": 2,
  "assignedTo": "Support Agent"
}
```

### Update Ticket Status

```http
PUT /api/tickets/{id}/status
```

Updates the status of a ticket and creates an activity log.

Example request body:

```json
{
  "statusId": 2
}
```

Example response:

```json
{
  "message": "Ticket status updated successfully.",
  "ticketId": 3,
  "oldStatus": "Open",
  "newStatus": "In Progress"
}
```

### Add Ticket Comment

```http
POST /api/tickets/{id}/comments
```

Adds a comment or reply to a ticket and creates an activity log.

Example request body:

```json
{
  "message": "I checked the ticket and started troubleshooting the issue."
}
```

Example response:

```json
{
  "message": "Comment added successfully.",
  "ticketId": 3,
  "commentId": 1,
  "comment": "I checked the ticket and started troubleshooting the issue."
}
```

### Get Ticket Comments

```http
GET /api/tickets/{id}/comments
```

Returns all comments for a ticket.

Example response:

```json
[
  {
    "id": 1,
    "ticketId": 3,
    "commentedBy": "Admin User",
    "message": "I checked the ticket and started troubleshooting the issue.",
    "createdAt": "2026-06-13T20:34:20.6166884"
  }
]
```

### Get Ticket Activity History

```http
GET /api/tickets/{id}/history
```

Returns the activity history of a ticket.

Example response:

```json
[
  {
    "id": 1,
    "ticketId": 3,
    "performedBy": "Admin User",
    "action": "Ticket Assigned",
    "description": "Ticket assigned to Support Agent.",
    "createdAt": "2026-06-13T20:29:37.525522"
  },
  {
    "id": 2,
    "ticketId": 3,
    "performedBy": "Admin User",
    "action": "Status Updated",
    "description": "Ticket status changed from Open to In Progress.",
    "createdAt": "2026-06-13T20:32:22.8969668"
  },
  {
    "id": 3,
    "ticketId": 3,
    "performedBy": "Admin User",
    "action": "Comment Added",
    "description": "A new comment was added to the ticket.",
    "createdAt": "2026-06-13T20:34:20.6179466"
  }
]
```

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
* View details action
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

### Ticket Details Page

The ticket details page allows users to:

* View ticket information
* Assign the ticket to an IT Support Agent
* Update ticket status
* Add comments or replies
* View all ticket comments
* View activity history for the ticket

## Authentication Flow

1. User registers with full name, email, password, and role.
2. Backend hashes the password using BCrypt.
3. User logs in with email and password.
4. Backend validates credentials.
5. Backend generates a JWT token.
6. Frontend stores the JWT token in local storage.
7. Protected routes use the token as a Bearer Token.
8. Role-based authorization controls access to admin-only routes.

## Ticket Management Flow

1. User logs in.
2. User opens the dashboard.
3. User clicks View Tickets.
4. User can view existing tickets.
5. User can create a new ticket.
6. User can edit ticket details and status.
7. User can delete a ticket.
8. User can open the ticket details page.
9. User can assign a ticket to an IT Support Agent.
10. User can update ticket status.
11. User can add comments or replies.
12. User can view ticket activity history.
13. The frontend communicates with the ASP.NET Core backend using Axios.
14. The backend stores and retrieves ticket data from SQL Server.

## Activity Logs Implemented

The system now creates activity logs for:

* Ticket assignment
* Ticket status updates
* New ticket comments

Each activity log stores:

* Ticket ID
* User who performed the action
* Action name
* Action description
* Creation date

## Testing Completed

Testing was completed using Postman, SQL Server `sqlcmd`, and the browser.

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
* Assign ticket API tested
* Update ticket status API tested
* Add ticket comment API tested
* Get ticket comments API tested
* Get ticket history API tested
* SQL Server Tickets table verified using `sqlcmd`
* SQL Server Categories table verified using `sqlcmd`
* SQL Server TicketComments table verified using `sqlcmd`
* SQL Server ActivityLogs table verified using `sqlcmd`
* Frontend login tested successfully
* Dashboard displayed logged-in user name and role
* Ticket list page tested
* Create ticket page tested
* Edit ticket page tested
* Delete ticket button tested
* Ticket details page tested in browser
* Frontend assignment flow tested
* Frontend status update flow tested
* Frontend comments flow tested
* Frontend activity history display tested

## Screenshots to Include in Documentation

Recommended screenshots:

* Login page
* Register page
* Dashboard page
* Ticket list page
* Create ticket page
* Edit ticket page
* Ticket details page
* Assign ticket section
* Status update section
* Comments section
* Activity history section
* Postman login response with JWT token
* Postman assign ticket response
* Postman update status response
* Postman add comment response
* Postman get comments response
* Postman get history response
* SQL Server Tickets table
* SQL Server Categories table
* SQL Server TicketComments table
* SQL Server ActivityLogs table
* Backend running in terminal
* Frontend running in terminal

## Next Steps

The next phase of development will focus on:

* Notifications
* File uploads
* Dashboard analytics
* Reports and charts
* Export functionality

## Author

OmniDesk was developed as part of a full-stack web development internship project.
