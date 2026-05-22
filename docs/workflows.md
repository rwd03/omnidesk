# OmniDesk System Workflows

## 1. Login / Authentication Workflow

### Description
This workflow describes how a user logs in to the OmniDesk platform.

### Steps
1. User opens the login page.
2. User enters email and password.
3. The frontend sends the login request to the backend API.
4. The backend validates the credentials.
5. If the credentials are invalid, the system displays an error message.
6. If the credentials are valid, the backend generates a JWT token.
7. The system checks the user role.
8. The user is redirected to the correct dashboard based on their role.

### Flow
Start  
↓  
Open Login Page  
↓  
Enter Email and Password  
↓  
Validate Credentials  
↓  
Credentials Valid?  
- No → Show Error Message  
- Yes → Generate JWT Token  
↓  
Check User Role  
↓  
Redirect to Dashboard  
↓  
End

## 2. Ticket Creation Workflow

### Description
This workflow describes how an employee creates a new IT support ticket.

### Steps
1. Employee opens the Create Ticket page.
2. Employee enters ticket title, description, category, and priority.
3. Employee optionally uploads an attachment.
4. The frontend sends the ticket data to the backend API.
5. The backend validates the required fields.
6. If validation fails, the system displays an error message.
7. If validation succeeds, the ticket is saved in the database.
8. The ticket receives the default status: Open.
9. The system creates an activity log.
10. Admins or IT Support Agents receive a notification.
11. The ticket appears in the ticket list.

### Flow
Employee Opens Create Ticket Page  
↓  
Enter Ticket Details  
↓  
Upload Attachment Optional  
↓  
Submit Ticket  
↓  
Validate Required Fields  
↓  
Valid?  
- No → Show Error Message  
- Yes → Save Ticket in Database  
↓  
Set Status to Open  
↓  
Create Activity Log  
↓  
Notify Admin / Agent  
↓  
Display Ticket in Ticket List  
↓  
End

## 3. Ticket Assignment and Resolution Workflow

### Description
This workflow describes how a ticket is assigned to an IT Support Agent and resolved.

### Steps
1. Admin or Manager opens the ticket details page.
2. Admin or Manager assigns the ticket to an IT Support Agent.
3. The system updates the assigned agent in the database.
4. The assigned agent receives a notification.
5. The agent reviews the ticket details.
6. The agent changes the ticket status to In Progress.
7. The agent adds comments or troubleshooting notes.
8. If the issue is not solved, the ticket remains Pending or In Progress.
9. If the issue is solved, the agent marks the ticket as Resolved.
10. The employee receives a notification.
11. The ticket can be closed after confirmation.

### Flow
Admin / Manager Opens Ticket  
↓  
Assign Ticket to Agent  
↓  
Update Assignment in Database  
↓  
Notify Assigned Agent  
↓  
Agent Reviews Ticket  
↓  
Set Status to In Progress  
↓  
Add Comments / Troubleshooting Notes  
↓  
Issue Solved?  
- No → Keep Pending / In Progress  
- Yes → Mark as Resolved  
↓  
Notify Employee  
↓  
Close Ticket  
↓  
End
