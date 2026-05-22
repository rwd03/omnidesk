# OmniDesk System Requirements

## 1. Project Objective

OmniDesk is a unified IT Help Desk and Ticket Management Platform designed to help employees submit technical support requests and allow IT support teams to manage, assign, track, and resolve tickets efficiently.

## 2. Functional Requirements

### Authentication & Authorization
- Users can register and log in securely.
- The system supports role-based access control.
- Supported roles:
  - Admin
  - Employee
  - IT Support Agent
  - Manager
- Each role has specific permissions and access levels.

### Ticket Management
- Employees can create support tickets.
- Employees can view and track their submitted tickets.
- Tickets contain:
  - Title
  - Description
  - Category
  - Priority
  - Status
- IT Support Agents can update ticket statuses.
- IT Support Agents can add comments and resolutions.
- Admins can assign tickets to IT Support Agents.

### Ticket Categories
- Hardware
- Software
- Network
- Email
- Access Request
- Other

### Ticket Priorities
- Low
- Medium
- High
- Critical

### Ticket Statuses
- Open
- In Progress
- Pending
- Resolved
- Closed

### Notifications
- Users receive notifications when tickets are updated.
- IT Support Agents receive notifications when tickets are assigned.
- The system keeps users informed about ticket activity.

### Dashboard & Reporting
- Display total open tickets.
- Display resolved tickets.
- Display pending tickets.
- Display tickets by category.
- Display tickets by priority.
- Provide basic analytics and reporting features.

### Admin Panel
- Admins can manage users.
- Admins can manage roles.
- Admins can manage ticket categories.
- Admins can monitor system activity and ticket workflows.

## 3. Non-Functional Requirements

- The system should provide secure authentication and authorization.
- Passwords must be encrypted securely.
- The interface should be responsive and mobile-friendly.
- The application should support search and filtering.
- The system should provide a clean and user-friendly experience.
- The database should maintain ticket history and activity logs.
- The application should be scalable and maintainable.
