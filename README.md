# OmniDesk

## Unified IT Help Desk & Ticket Management Platform

---

## Overview

OmniDesk is a full-stack web application designed to manage IT support tickets, user roles, authentication, ticket workflows, dashboard analytics, notifications, file attachments, reports, export functionality, and basic AI-powered support assistance.

The system simulates an enterprise IT help desk environment where employees can submit support requests, while IT support agents, managers, and administrators can manage tickets, users, roles, operational workflows, analytics, and reporting.

This repository contains the completed internship project implementation.

---

## Main Features

- User authentication
- User registration and login
- JWT token-based authentication
- BCrypt password hashing
- Role-based access control
- Protected API routes
- Admin-only authorization route
- Ticket creation
- Ticket listing
- Ticket details
- Ticket editing and updating
- Ticket deletion
- Ticket categories
- Ticket priorities
- Ticket statuses
- Ticket assignment to IT support agents
- Ticket status workflow updates
- Ticket comments and replies
- Ticket activity history tracking
- Activity logs for ticket actions
- Dashboard navigation
- Dashboard analytics
- Dashboard KPI cards
- Ticket statistics
- Charts and visual reporting
- In-app notifications
- Notification center
- Ticket file attachments
- Secure file upload and download
- Reports module
- Monthly ticket reports
- Ticket status reports
- Ticket category reports
- Ticket priority reports
- Agent performance reports
- Average resolution time reports
- Export functionality
- Basic AI ticket category suggestion
- Basic AI ticket priority suggestion
- Basic AI support assistant
- Frontend connected with backend APIs

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router DOM
- CSS
- Reusable React components for layout, dashboard cards, charts, and page headers

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- JWT Bearer Authentication
- BCrypt password hashing
- Role-based authorization

### Database

- SQL Server Express
- Entity Framework Core migrations
- SQL Server command-line testing using sqlcmd

### Tools

- GitHub
- Visual Studio Code
- Postman
- SQL Server Express
- Draw.io
- Figma

---

## Project Structure

```txt
omnidesk/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── AuthLayout.jsx
│   │   │   ├── common/
│   │   │   │   └── PageHeader.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── ChartCard.jsx
│   │   │   │   ├── EmptyChart.jsx
│   │   │   │   ├── KpiCard.jsx
│   │   │   │   └── SummaryRow.jsx
│   │   │   └── layout/
│   │   │       ├── AppLayout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Topbar.jsx
│   │   ├── pages/
│   │   │   ├── AiAssistant.jsx
│   │   │   ├── CreateTicket.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditTicket.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── TicketDetails.jsx
│   │   │   └── TicketList.jsx
│   │   ├── App.css
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   └── OmniDesk.Api/
│       ├── DTOs/
│       │   ├── Ai/
│       │   │   ├── AiChatRequestDto.cs
│       │   │   ├── AiChatResponseDto.cs
│       │   │   ├── AiSuggestionRequestDto.cs
│       │   │   └── AiSuggestionResponseDto.cs
│       │   ├── Reports/
│       │   │   ├── ReportGroupItemDto.cs
│       │   │   └── ReportSummaryDto.cs
│       │   ├── Tickets/
│       │   │   ├── AssignTicketDto.cs
│       │   │   ├── CreateTicketCommentDto.cs
│       │   │   ├── CreateTicketDto.cs
│       │   │   ├── TicketResponseDto.cs
│       │   │   ├── UpdateTicketDto.cs
│       │   │   └── UpdateTicketStatusDto.cs
│       │   └── LoginDto.cs
│       ├── Migrations/
│       ├── Models/
│       │   ├── ActivityLog.cs
│       │   ├── Category.cs
│       │   ├── Notification.cs
│       │   ├── Priority.cs
│       │   ├── Role.cs
│       │   ├── Status.cs
│       │   ├── Ticket.cs
│       │   ├── TicketAttachment.cs
│       │   ├── TicketComment.cs
│       │   └── User.cs
│       └── Program.cs
│
├── database/
├── docs/
└── README.md
```

---

## Final Project Status

The project includes the completed work for the internship implementation.

| Week | Status | Main Focus |
|---|---|---|
| Week 1 | Completed | Requirements analysis, planning, wireframes, ERD |
| Week 2 | Completed | Project setup, authentication, roles |
| Week 3 | Completed | Ticket CRUD, categories, priorities, statuses |
| Week 4 | Completed | Assignment workflow, comments, activity logs |
| Week 5 | Completed | Notifications, file uploads, dashboard analytics |
| Week 6 | Completed | Reports, charts, export functionality, AI prototype |

---

## Week 1 — Requirements Analysis and Planning

### Completed Tasks

- Requirements analysis
- Project planning
- Workflow diagrams
- UI wireframes
- Database schema planning
- ERD planning
- Initial documentation

### Deliverables

- Project proposal
- Initial wireframes
- Initial ERD planning
- System workflow planning
- Initial README documentation

---

## Week 2 — Project Setup, Authentication, and Role Management

### Completed Tasks

- React frontend project setup
- ASP.NET Core Web API backend setup
- SQL Server database connection
- Entity Framework Core configuration
- User model
- Role model
- Database context setup
- Database migrations
- Seeded default roles
- JWT authentication
- BCrypt password hashing
- Role-based authorization
- Register endpoint
- Login endpoint
- Protected profile endpoint
- Admin-only protected endpoint
- Login page
- Register page
- Dashboard page
- Frontend connected to backend API
- Backend tested using Postman
- Frontend login tested in browser

### Features Implemented

- Users can register with full name, email, password, and role.
- User passwords are securely hashed using BCrypt.
- Users can log in and receive a JWT token.
- Protected backend routes require a valid Bearer Token.
- Role-based authorization is available for protected admin routes.
- The frontend stores authentication data and redirects users after login.

---

## Week 3 — Ticket Management System and CRUD Operations

### Objectives

- Build the ticket management system
- Implement CRUD operations
- Connect frontend with backend APIs

### Completed Tasks

- Created Ticket model
- Created Category model
- Created Priority model
- Created Status model
- Created ticket DTOs
- Added ticket database migration
- Seeded ticket categories
- Seeded ticket priorities
- Seeded ticket statuses
- Implemented ticket creation API
- Implemented ticket listing API
- Implemented ticket details API
- Implemented ticket update API
- Implemented ticket delete API
- Implemented Categories API
- Implemented Priorities API
- Implemented Statuses API
- Tested ticket APIs using Postman
- Created React ticket API service
- Created ticket list page
- Created create ticket page
- Created edit ticket page
- Implemented delete ticket functionality
- Added dashboard button to access ticket module
- Added back button from ticket list to dashboard
- Connected React frontend with ASP.NET Core backend APIs using Axios
- Tested full frontend/backend ticket CRUD flow

### Features Implemented

Users can create, view, update, and delete support tickets.

Each ticket includes:

- Reference number
- Title
- Description
- Category
- Priority
- Status
- Created by user
- Created date

---

## Week 4 — Ticket Assignment, Workflow, Comments, and Activity Logs

### Objectives

- Build ticket assignment system
- Add ticket workflow logic
- Implement comments and history tracking

### Completed Tasks

- Added ticket assignment functionality
- Added AssignedToUserId to the Ticket model
- Created TicketComment model
- Created ActivityLog model
- Added database migration for assignment, comments, and activity logs
- Created ticket assignment API endpoint
- Created ticket status update API endpoint
- Created add comment/reply API endpoint
- Created get comments API endpoint
- Created get ticket history API endpoint
- Added activity logs for ticket assignment
- Added activity logs for ticket status updates
- Added activity logs for new comments
- Updated React ticket API service with Week 4 endpoints
- Created Ticket Details page
- Added View Details button in the ticket list page
- Added ticket assignment section in frontend
- Added status update section in frontend
- Added comments section in frontend
- Added activity history section in frontend
- Tested assignment, status update, comments, and history using Postman
- Tested full Week 4 frontend/backend workflow in browser

### Features Implemented

The ticket details page allows users to:

- View ticket information
- Assign the ticket to an IT Support Agent
- Update ticket status
- Add comments or replies
- View all ticket comments
- View activity history for the ticket

The system creates activity logs for:

- Ticket assignment
- Ticket status updates
- New ticket comments

---

## Week 5 — Notifications, File Uploads, and Dashboard Analytics

### Objectives

- Implement in-app notifications
- Implement ticket file attachments
- Build dashboard analytics
- Improve visibility over ticket activity

### Completed Tasks

- Created Notification model
- Created TicketAttachment model
- Added database migration for notifications and ticket attachments
- Created notification API endpoints
- Created ticket attachment upload API endpoint
- Created ticket attachment download API endpoint
- Created get ticket attachments API endpoint
- Added file size validation
- Added supported file type validation
- Implemented secure file storage for uploaded ticket attachments
- Created dashboard analytics API endpoints
- Added dashboard summary statistics
- Added open tickets count
- Added pending tickets count
- Added resolved tickets count
- Added total tickets count
- Added tickets by category analytics
- Added tickets by priority analytics
- Added tickets by status analytics
- Added agent performance analytics
- Updated React frontend with dashboard analytics components
- Created dashboard analytics section in the frontend
- Added KPI cards to the dashboard
- Added ticket charts to the dashboard
- Created notification center page in the frontend
- Displayed unread and read notifications
- Added frontend support for ticket file uploads
- Added attachment section inside the ticket details page
- Tested notification APIs using Postman
- Tested file upload and download APIs using Postman
- Tested dashboard analytics APIs using Postman
- Tested dashboard analytics in the browser
- Tested notification display in the browser
- Tested file attachment upload and download from the frontend

### Features Implemented

The system supports in-app notifications for important ticket actions, including:

- Ticket assignment
- Ticket status updates
- New ticket comments
- Ticket workflow changes

The system also supports ticket attachments, allowing users to upload files related to support tickets, such as:

- Screenshots
- Documents
- Error logs
- Supporting files

The dashboard provides analytics and visual indicators for ticket activity, including:

- Total tickets
- Open tickets
- Pending tickets
- Resolved tickets
- Tickets grouped by category
- Tickets grouped by priority
- Tickets grouped by status
- Agent performance statistics

---

## Week 6 — Reports, Charts, Export Functionality, and AI Prototype

### Objectives

- Implement reporting features
- Add charts and data visualization
- Support export functionality
- Create a basic AI-powered ticket assistance prototype

### Completed Tasks

- Created reporting API endpoints
- Added monthly ticket report endpoint
- Added ticket status report endpoint
- Added ticket category report endpoint
- Added ticket priority report endpoint
- Added average resolution time calculation
- Added employee activity reporting
- Added agent performance reporting
- Created report DTOs for structured API responses
- Added chart-ready backend responses for frontend visualization
- Created reports page in the frontend
- Added charts for ticket statistics
- Added ticket status chart
- Added ticket category chart
- Added ticket priority chart
- Added monthly ticket trend chart
- Added report filters where needed
- Implemented export functionality
- Added export to Excel functionality
- Added export to PDF functionality
- Tested report APIs using Postman
- Tested chart data loading in the frontend
- Tested export functionality from the backend
- Tested report page in the browser
- Created initial AI-powered ticket assistance prototype
- Added AI ticket category suggestion
- Added AI priority suggestion
- Added AI assistant page
- Added basic AI support guidance flow
- Tested AI suggestion flow with sample ticket descriptions

### Features Implemented

The system includes a reporting module that helps administrators and managers analyze ticket activity and support performance.

Reports include:

- Monthly ticket reports
- Tickets by status
- Tickets by category
- Tickets by priority
- Average ticket resolution time
- Employee activity reports
- Agent performance reports

The frontend reports page includes charts and visual analytics to make the data easier to understand.

Export functionality allows reports to be downloaded for documentation and management review.

The initial AI prototype can suggest:

- A suitable ticket category based on the ticket description
- A suitable ticket priority based on the urgency of the reported issue
- Basic support guidance through the AI Assistant page

---

## Implemented Roles

The system currently supports four roles:

| Role ID | Role Name |
|---|---|
| 1 | Admin |
| 2 | Employee |
| 3 | IT Support Agent |
| 4 | Manager |

The roles are seeded into the database using Entity Framework Core migrations.

---

## Ticket Categories

The following ticket categories are seeded into the database:

| Category ID | Category Name |
|---|---|
| 1 | Hardware |
| 2 | Software |
| 3 | Network |
| 4 | Email |
| 5 | Access Request |
| 6 | Other |

---

## Ticket Priorities

The following ticket priorities are seeded into the database:

| Priority ID | Priority Name |
|---|---|
| 1 | Low |
| 2 | Medium |
| 3 | High |
| 4 | Critical |

---

## Ticket Statuses

The following ticket statuses are seeded into the database:

| Status ID | Status Name |
|---|---|
| 1 | Open |
| 2 | In Progress |
| 3 | Pending |
| 4 | Resolved |
| 5 | Closed |

---

## Database

Database name:

```txt
OmniDeskDb
```

Current tables:

```txt
Users
Roles
Tickets
Categories
Priorities
Statuses
TicketComments
ActivityLogs
Notifications
TicketAttachments
__EFMigrationsHistory
```

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

All protected endpoints require a valid JWT Bearer Token.

---

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

- JWT token
- User ID
- Full name
- Email
- Role

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

```txt
Admin access granted.
```

---

## Ticket CRUD Endpoints

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

## Ticket Workflow Endpoints

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

---

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

---

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

---

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

---

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

## Dashboard Endpoints

### Get Dashboard Summary

```http
GET /api/dashboard/summary
```

Returns general ticket statistics, such as:

- Total tickets
- Open tickets
- Pending tickets
- Resolved tickets
- Closed tickets

---

### Get Tickets by Category

```http
GET /api/dashboard/tickets-by-category
```

Returns the number of tickets grouped by category.

---

### Get Tickets by Priority

```http
GET /api/dashboard/tickets-by-priority
```

Returns the number of tickets grouped by priority.

---

### Get Tickets by Status

```http
GET /api/dashboard/tickets-by-status
```

Returns the number of tickets grouped by status.

---

### Get Agent Performance

```http
GET /api/dashboard/agent-performance
```

Returns support agent performance statistics.

---

## Notification Endpoints

### Get Notifications

```http
GET /api/notifications
```

Returns notifications for the logged-in user.

---

### Mark Notification as Read

```http
PUT /api/notifications/{id}/read
```

Marks a notification as read.

---

### Mark All Notifications as Read

```http
PUT /api/notifications/read-all
```

Marks all notifications as read for the logged-in user.

---

## Attachment Endpoints

### Upload Ticket Attachment

```http
POST /api/tickets/{ticketId}/attachments
```

Uploads a file attachment for a ticket.

Supported file examples:

- Images
- PDF documents
- Text files
- Log files

---

### Get Ticket Attachments

```http
GET /api/tickets/{ticketId}/attachments
```

Returns all attachments for a ticket.

---

### Download Attachment

```http
GET /api/attachments/{id}/download
```

Downloads a ticket attachment securely.

---

### Delete Attachment

```http
DELETE /api/attachments/{id}
```

Deletes a ticket attachment.

---

## Report Endpoints

### Monthly Ticket Report

```http
GET /api/reports/monthly
```

Returns monthly ticket statistics.

---

### Ticket Status Report

```http
GET /api/reports/status
```

Returns tickets grouped by status.

---

### Ticket Category Report

```http
GET /api/reports/category
```

Returns tickets grouped by category.

---

### Ticket Priority Report

```http
GET /api/reports/priority
```

Returns tickets grouped by priority.

---

### Agent Performance Report

```http
GET /api/reports/agent-performance
```

Returns support agent performance statistics.

---

### Average Resolution Time Report

```http
GET /api/reports/average-resolution-time
```

Returns average ticket resolution time.

---

### Export Reports to Excel

```http
GET /api/reports/export/excel
```

Exports report data to an Excel file.

---

### Export Reports to PDF

```http
GET /api/reports/export/pdf
```

Exports report data to a PDF file.

---

## AI Endpoints

### Suggest Ticket Category and Priority

```http
POST /api/ai/suggest
```

Suggests a ticket category and priority based on the ticket title and description.

Example request body:

```json
{
  "title": "Outlook not opening",
  "description": "Microsoft Outlook crashes every time I try to open it."
}
```

Example result:

```json
{
  "suggestedCategory": "Software",
  "suggestedPriority": "Medium"
}
```

---

### AI Chat Assistant

```http
POST /api/ai/chat
```

Provides basic support guidance based on the user's issue.

Example request body:

```json
{
  "message": "How can I connect to the company VPN?"
}
```

Example result:

```json
{
  "reply": "To connect to the company VPN, open the VPN client, enter your company credentials, select the correct server, and click Connect. If the issue continues, create a Network or Access Request ticket."
}
```

---

## How to Run the Backend

Open Command Prompt from the project root:

```bash
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

```bash
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

### Login Page

The login page allows an existing user to enter their email and password. After a successful login, the JWT token and user information are stored in local storage, and the user is redirected to the dashboard.

### Register Page

The register page allows a new user to create an account by entering:

- Full name
- Email
- Password
- Role

### Dashboard Page

The dashboard page displays the logged-in user’s name and role.

It also includes:

- Navigation to the ticket management module
- KPI cards
- Ticket analytics
- Ticket charts
- Summary statistics

### Ticket List Page

The ticket list page displays all created tickets with:

- Reference number
- Title
- Category
- Priority
- Status
- Created by
- Created date
- View details action
- Edit action
- Delete action

### Create Ticket Page

The create ticket page allows users to create a new support ticket using:

- Title
- Description
- Category dropdown
- Priority dropdown

### Edit Ticket Page

The edit ticket page allows users to update:

- Title
- Description
- Category
- Priority
- Status

### Ticket Details Page

The ticket details page allows users to:

- View ticket information
- Assign the ticket to an IT Support Agent
- Update ticket status
- Add comments or replies
- View all ticket comments
- View activity history for the ticket
- Upload ticket attachments
- View uploaded attachments
- Download attachments

### Notifications Page

The notifications page allows users to:

- View ticket-related notifications
- See unread and read notifications
- Mark notifications as read

### Reports Page

The reports page allows administrators and managers to:

- View ticket reports
- View charts
- Analyze ticket activity
- Review agent performance
- Export report data

### AI Assistant Page

The AI Assistant page allows users to test basic AI-powered support assistance.

It can help with:

- Suggesting a ticket category
- Suggesting a ticket priority
- Providing basic support guidance based on the user’s issue

---

## Authentication Flow

1. User registers with full name, email, password, and role.
2. Backend hashes the password using BCrypt.
3. User logs in with email and password.
4. Backend validates credentials.
5. Backend generates a JWT token.
6. Frontend stores the JWT token in local storage.
7. Protected routes use the token as a Bearer Token.
8. Role-based authorization controls access to protected routes.

---

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
12. User can upload attachments.
13. User can view ticket activity history.
14. The frontend communicates with the ASP.NET Core backend using Axios.
15. The backend stores and retrieves ticket data from SQL Server.

---

## Activity Logs Implemented

The system creates activity logs for:

- Ticket assignment
- Ticket status updates
- New ticket comments

Each activity log stores:

- Ticket ID
- User who performed the action
- Action name
- Action description
- Creation date

---

## Notifications Implemented

The system creates notifications for important ticket actions, such as:

- Ticket assignment
- Ticket status update
- New comment added
- Workflow changes

Each notification stores:

- Notification ID
- User ID
- Ticket ID
- Message
- Read/unread status
- Creation date

---

## File Attachments Implemented

The system allows users to upload supporting files to tickets.

Each attachment stores:

- Attachment ID
- Ticket ID
- Original file name
- Stored file name
- File path
- Content type
- File size
- Uploaded by user
- Upload date

Attachment functionality includes:

- Uploading files
- Viewing ticket attachments
- Downloading files
- File type validation
- File size validation

---

## Reports and Analytics Implemented

The reports module includes:

- Monthly ticket report
- Ticket status report
- Ticket category report
- Ticket priority report
- Average resolution time report
- Agent performance report
- Employee activity report
- Export functionality

The dashboard analytics module includes:

- Total tickets count
- Open tickets count
- Pending tickets count
- Resolved tickets count
- Closed tickets count
- Tickets by category
- Tickets by priority
- Tickets by status
- Agent performance statistics

---

## AI Prototype Implemented

The project includes a basic AI-powered support assistance prototype.

The AI prototype can suggest:

- Ticket category
- Ticket priority
- Basic support guidance

The purpose of this feature is to assist users and support agents when creating, reviewing, or troubleshooting tickets.

---

## Testing Completed

Testing was completed using:

- Postman
- SQL Server sqlcmd
- Browser testing

Completed tests:

- Register user using Postman
- Login user using Postman
- JWT token returned successfully
- Protected profile endpoint tested with Bearer Token
- Admin-only endpoint tested successfully
- SQL Server Roles table verified
- SQL Server ticket-related tables verified
- Categories seed data verified
- Priorities seed data verified
- Statuses seed data verified
- Get categories API tested
- Get priorities API tested
- Get statuses API tested
- Create ticket API tested
- Get tickets API tested
- Get ticket details API tested
- Update ticket API tested
- Delete ticket API tested
- Assign ticket API tested
- Update ticket status API tested
- Add ticket comment API tested
- Get ticket comments API tested
- Get ticket history API tested
- Dashboard summary API tested
- Tickets by category API tested
- Tickets by priority API tested
- Tickets by status API tested
- Agent performance API tested
- Notification APIs tested
- Mark notification as read tested
- Ticket attachment upload tested
- Ticket attachment download tested
- Ticket attachment listing tested
- Report APIs tested
- Monthly report tested
- Status report tested
- Category report tested
- Priority report tested
- Agent performance report tested
- Export functionality tested
- AI suggestion tested
- AI chat assistant tested
- SQL Server Tickets table verified using sqlcmd
- SQL Server Categories table verified using sqlcmd
- SQL Server TicketComments table verified using sqlcmd
- SQL Server ActivityLogs table verified using sqlcmd
- SQL Server Notifications table verified using sqlcmd
- SQL Server TicketAttachments table verified using sqlcmd
- Frontend login tested successfully
- Dashboard displayed logged-in user name and role
- Ticket list page tested
- Create ticket page tested
- Edit ticket page tested
- Delete ticket button tested
- Ticket details page tested in browser
- Frontend assignment flow tested
- Frontend status update flow tested
- Frontend comments flow tested
- Frontend activity history display tested
- Frontend dashboard analytics tested
- Frontend notifications page tested
- Frontend file upload tested
- Frontend reports page tested
- Frontend charts tested
- Frontend export actions tested
- Frontend AI assistant page tested

---

## Screenshots to Include in Documentation

Recommended screenshots:

- Login page
- Register page
- Dashboard page
- Dashboard KPI cards
- Dashboard charts
- Ticket list page
- Create ticket page
- Edit ticket page
- Ticket details page
- Assign ticket section
- Status update section
- Comments section
- Activity history section
- Attachment upload section
- Notification center
- Reports page
- Charts section
- Export functionality
- AI Assistant page
- Postman login response with JWT token
- Postman assign ticket response
- Postman update status response
- Postman add comment response
- Postman get comments response
- Postman get history response
- Postman dashboard summary response
- Postman notification response
- Postman attachment upload response
- Postman report response
- Postman AI response
- SQL Server Tickets table
- SQL Server Categories table
- SQL Server TicketComments table
- SQL Server ActivityLogs table
- SQL Server Notifications table
- SQL Server TicketAttachments table
- Backend running in terminal
- Frontend running in terminal

---

## Final Deliverables

The completed project includes:

- Full source code
- GitHub repository
- README documentation
- Database schema
- Entity Framework Core migrations
- API documentation
- Setup instructions
- Screenshots
- Frontend implementation
- Backend implementation
- SQL Server database integration
- Authentication and authorization
- Ticket management workflow
- Dashboard analytics
- Notifications
- File attachments
- Reports
- Export functionality
- Basic AI prototype
- Final project demonstration

---

## Author

OmniDesk was developed as part of a full-stack web development internship project.
