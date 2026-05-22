# OmniDesk Database Schema

## 1. Overview

OmniDesk uses a relational SQL database designed for an IT Help Desk and Ticket Management Platform.

The database supports:
- User authentication and role-based access
- Ticket creation and tracking
- Ticket assignment and reassignment
- Ticket comments and internal notes
- Ticket status history
- File attachments
- Notifications
- Activity/audit logs
- Dashboard and reporting data
- Optional AI-based ticket suggestions

The main entity is the `Tickets` table. Each ticket is created by an employee, assigned to an IT Support Agent, linked to a category, priority, and status, and tracked through history, comments, notifications, and activity logs.

---

## 2. Tables

## Roles

Stores user roles and access levels.

| Column | Type | Description |
|---|---|---|
| RoleId | INT PK | Unique role identifier |
| RoleName | NVARCHAR(50) | Role name |
| Description | NVARCHAR(255) | Role description |
| CreatedAt | DATETIME | Creation date |

Example roles:
- Admin
- Employee
- IT Support Agent
- Manager

Relationship:
- One role can belong to many users.

---

## Departments

Stores company departments.

| Column | Type | Description |
|---|---|---|
| DepartmentId | INT PK | Unique department identifier |
| DepartmentName | NVARCHAR(100) | Department name |
| Description | NVARCHAR(255) | Department description |
| IsActive | BIT | Department active status |

Example departments:
- IT
- HR
- Finance
- Operations
- Sales

Relationship:
- One department can have many users.

---

## Users

Stores system users.

| Column | Type | Description |
|---|---|---|
| UserId | INT PK | Unique user identifier |
| FullName | NVARCHAR(100) | User full name |
| Email | NVARCHAR(150) | Unique email address |
| PasswordHash | NVARCHAR(255) | Encrypted password |
| PhoneNumber | NVARCHAR(30) NULL | Optional phone number |
| RoleId | INT FK | User role |
| DepartmentId | INT FK NULL | User department |
| JobTitle | NVARCHAR(100) NULL | User job title |
| IsActive | BIT | Account status |
| LastLoginAt | DATETIME NULL | Last login timestamp |
| CreatedAt | DATETIME | Account creation date |
| UpdatedAt | DATETIME NULL | Last update date |

Relationships:
- One role can have many users.
- One department can have many users.
- One user can create many tickets.
- One IT Support Agent can be assigned many tickets.
- One user can write many comments.
- One user can receive many notifications.
- One user can create many activity logs.

---

## Categories

Stores ticket categories.

| Column | Type | Description |
|---|---|---|
| CategoryId | INT PK | Unique category identifier |
| CategoryName | NVARCHAR(100) | Category name |
| Description | NVARCHAR(255) | Category description |
| IsActive | BIT | Category active status |
| CreatedAt | DATETIME | Creation date |

Example categories:
- Hardware
- Software
- Network
- Email
- Access Request
- Other

Relationship:
- One category can have many tickets.

---

## Priorities

Stores ticket priority levels and SLA targets.

| Column | Type | Description |
|---|---|---|
| PriorityId | INT PK | Unique priority identifier |
| PriorityName | NVARCHAR(50) | Priority name |
| Description | NVARCHAR(255) | Priority description |
| SLAResponseHours | INT | Expected first response time |
| SLAResolutionHours | INT | Expected resolution time |
| SortOrder | INT | Display order |

Example priorities:
- Low
- Medium
- High
- Critical

Relationship:
- One priority can have many tickets.

---

## Statuses

Stores ticket workflow statuses.

| Column | Type | Description |
|---|---|---|
| StatusId | INT PK | Unique status identifier |
| StatusName | NVARCHAR(50) | Status name |
| Description | NVARCHAR(255) | Status description |
| IsClosedStatus | BIT | Indicates whether the status closes the ticket |
| SortOrder | INT | Display order |

Example statuses:
- Open
- In Progress
- Pending
- Resolved
- Closed

Relationship:
- One status can have many tickets.

---

## Tickets

Stores all support tickets.

| Column | Type | Description |
|---|---|---|
| TicketId | INT PK | Unique ticket identifier |
| TicketNumber | NVARCHAR(50) | Human-readable ticket reference number |
| Title | NVARCHAR(150) | Ticket title |
| Description | NVARCHAR(MAX) | Detailed issue description |
| CreatedByUserId | INT FK | Employee who created the ticket |
| AssignedToUserId | INT FK NULL | Current assigned IT Support Agent |
| CategoryId | INT FK | Ticket category |
| PriorityId | INT FK | Ticket priority |
| StatusId | INT FK | Current ticket status |
| DueAt | DATETIME NULL | SLA due date/time |
| CreatedAt | DATETIME | Ticket creation date |
| UpdatedAt | DATETIME NULL | Last update date |
| ResolvedAt | DATETIME NULL | Resolution date |
| ClosedAt | DATETIME NULL | Closure date |
| IsDeleted | BIT | Soft delete flag |

Relationships:
- One user can create many tickets.
- One IT Support Agent can be assigned many tickets.
- One category can have many tickets.
- One priority can have many tickets.
- One status can have many tickets.
- One ticket can have many comments.
- One ticket can have many attachments.
- One ticket can have many assignment history records.
- One ticket can have many status history records.
- One ticket can have many activity logs.

---

## TicketAssignments

Stores assignment and reassignment history.

| Column | Type | Description |
|---|---|---|
| AssignmentId | INT PK | Unique assignment record identifier |
| TicketId | INT FK | Related ticket |
| AssignedToUserId | INT FK | Agent assigned to the ticket |
| AssignedByUserId | INT FK | Admin/Manager who assigned the ticket |
| AssignedAt | DATETIME | Assignment date |
| UnassignedAt | DATETIME NULL | Date when assignment ended |
| AssignmentNote | NVARCHAR(500) NULL | Optional assignment note |

Purpose:
- Tracks manual and future automatic assignment.
- Supports reassignment history.
- Helps with audit and reporting.

---

## TicketComments

Stores ticket comments and replies.

| Column | Type | Description |
|---|---|---|
| CommentId | INT PK | Unique comment identifier |
| TicketId | INT FK | Related ticket |
| UserId | INT FK | User who wrote the comment |
| CommentText | NVARCHAR(MAX) | Comment content |
| IsInternal | BIT | Internal note visible only to support/admin roles |
| CreatedAt | DATETIME | Comment creation date |
| UpdatedAt | DATETIME NULL | Last edit date |

Purpose:
- Supports employee-agent communication.
- Supports internal support notes.

---

## TicketStatusHistory

Stores all ticket status changes.

| Column | Type | Description |
|---|---|---|
| StatusHistoryId | INT PK | Unique status history record |
| TicketId | INT FK | Related ticket |
| OldStatusId | INT FK NULL | Previous status |
| NewStatusId | INT FK | New status |
| ChangedByUserId | INT FK | User who changed the status |
| ChangeReason | NVARCHAR(500) NULL | Optional reason |
| ChangedAt | DATETIME | Date of status change |

Purpose:
- Supports ticket history tracking.
- Supports audit trail and reporting.

---

## TicketAttachments

Stores files uploaded to tickets.

| Column | Type | Description |
|---|---|---|
| AttachmentId | INT PK | Unique attachment identifier |
| TicketId | INT FK | Related ticket |
| UploadedByUserId | INT FK | User who uploaded the file |
| FileName | NVARCHAR(255) | Original file name |
| StoredFileName | NVARCHAR(255) | Stored system file name |
| FilePath | NVARCHAR(500) | Secure storage path |
| FileType | NVARCHAR(100) | File MIME type |
| FileSizeKB | INT | File size in KB |
| UploadedAt | DATETIME | Upload date |

Purpose:
- Supports screenshots, logs, and documents.
- Supports future validation by file size and file type.

---

## Notifications

Stores user notifications.

| Column | Type | Description |
|---|---|---|
| NotificationId | INT PK | Unique notification identifier |
| UserId | INT FK | User receiving the notification |
| TicketId | INT FK NULL | Related ticket |
| NotificationType | NVARCHAR(50) | Type of notification |
| Title | NVARCHAR(150) | Notification title |
| Message | NVARCHAR(500) | Notification message |
| IsRead | BIT | Read/unread status |
| ReadAt | DATETIME NULL | Read timestamp |
| CreatedAt | DATETIME | Notification creation date |

Example notification types:
- TicketCreated
- TicketAssigned
- TicketUpdated
- CommentAdded
- TicketResolved

Purpose:
- Supports notification center.
- Supports ticket update alerts.

---

## ActivityLogs

Stores user/system activity for audit tracking.

| Column | Type | Description |
|---|---|---|
| ActivityLogId | INT PK | Unique activity log identifier |
| UserId | INT FK NULL | User who performed the action |
| TicketId | INT FK NULL | Related ticket |
| ActionType | NVARCHAR(100) | Type of action |
| Description | NVARCHAR(500) | Activity description |
| IpAddress | NVARCHAR(50) NULL | User IP address |
| CreatedAt | DATETIME | Activity date |

Example actions:
- UserLogin
- TicketCreated
- TicketAssigned
- StatusChanged
- CommentAdded
- AttachmentUploaded
- UserRoleUpdated

Purpose:
- Supports audit trail.
- Supports system monitoring dashboard.
- Supports security/activity tracking.

---

## Reports

Stores generated report metadata.

| Column | Type | Description |
|---|---|---|
| ReportId | INT PK | Unique report identifier |
| ReportName | NVARCHAR(150) | Report name |
| ReportType | NVARCHAR(100) | Type of report |
| GeneratedByUserId | INT FK | User who generated the report |
| FilePath | NVARCHAR(500) NULL | Exported report file path |
| GeneratedAt | DATETIME | Generation date |

Example report types:
- MonthlyTickets
- AverageResolutionTime
- SLAReport
- EmployeeActivity

Purpose:
- Supports report generation history.
- Supports future PDF/Excel exports.

---

## SystemSettings

Stores configurable admin settings.

| Column | Type | Description |
|---|---|---|
| SettingId | INT PK | Unique setting identifier |
| SettingKey | NVARCHAR(100) | Setting key |
| SettingValue | NVARCHAR(500) | Setting value |
| Description | NVARCHAR(255) NULL | Setting description |
| UpdatedByUserId | INT FK NULL | Admin who updated the setting |
| UpdatedAt | DATETIME NULL | Last update date |

Example settings:
- MaxAttachmentSizeMB
- AllowedFileTypes
- EnableEmailNotifications
- EnableAIRecommendations

Purpose:
- Supports admin system settings.
- Supports configurable file upload rules and notification settings.

---

## AIRecommendations

Stores optional AI suggestions related to tickets.

| Column | Type | Description |
|---|---|---|
| AIRecommendationId | INT PK | Unique AI recommendation identifier |
| TicketId | INT FK | Related ticket |
| SuggestedCategoryId | INT FK NULL | AI-suggested category |
| SuggestedPriorityId | INT FK NULL | AI-suggested priority |
| SuggestedReply | NVARCHAR(MAX) NULL | AI-generated support reply |
| ConfidenceScore | DECIMAL(5,2) NULL | AI confidence percentage |
| CreatedAt | DATETIME | Suggestion creation date |
| AcceptedByUserId | INT FK NULL | User who accepted the suggestion |
| AcceptedAt | DATETIME NULL | Acceptance date |

Purpose:
- Supports AI ticket categorization.
- Supports AI priority suggestion.
- Supports AI suggested replies.

---

## 3. Relationship Summary

- Roles 1 → Many Users
- Departments 1 → Many Users
- Users 1 → Many Tickets created
- Users 1 → Many Tickets assigned
- Categories 1 → Many Tickets
- Priorities 1 → Many Tickets
- Statuses 1 → Many Tickets
- Tickets 1 → Many TicketAssignments
- Tickets 1 → Many TicketComments
- Tickets 1 → Many TicketStatusHistory
- Tickets 1 → Many TicketAttachments
- Tickets 1 → Many Notifications
- Tickets 1 → Many ActivityLogs
- Users 1 → Many TicketComments
- Users 1 → Many Notifications
- Users 1 → Many ActivityLogs
- Users 1 → Many Reports generated
- Tickets 1 → Many AIRecommendations

---

## 4. Notes

This database schema is designed to satisfy the Week 1 database planning requirement and support the main project modules:
- Authentication and user management
- Ticket management
- Ticket assignment workflow
- Comments and internal notes
- Notifications
- Dashboard and reporting
- File attachments
- Admin panel
- Activity logs
- Optional AI-powered features

The schema may be refined during implementation when creating Entity Framework Core models and SQL Server migration scripts.
