Student Digital Hub – Backend

Django project for managing Student Digital Hub data.

Install dependencies
pip install -r requirements.txt

Apply migrations
python manage.py makemigrations
python manage.py migrate

Initialize data
python manage.py init_hub

This command creates Hub settings and sample activity directions.

Create an administrator
python manage.py createsuperuser

Enter a username and password (you may leave email blank by pressing Enter). After creation, log into the admin panel and assign the admin role to this user.

Start the server
python manage.py runserver

Open in your browser: http://127.0.0.1:8000/admin/

Next steps

Create additional activity directions (if needed beyond those created automatically)
Create laboratories
Assign lab leaders (create users with the lab_lead role and specify their managed_lab)
Create projects within labs
Add project participants (assign the manager role to project managers)
Project Structure

hub/ – main application directory
models.py – data models (User, Lab, Project, ProjectParticipant, Achievement, EventLog, HubSettings)
admin.py – admin panel configuration with role-based restrictions
utils.py – utility functions for logging
signals.py – Django signals for automatic event logging

User Roles

Admin (Administrator)

Full access to all data
Can manage all labs, projects, and participants
Access to the event log
Lab Lead (Laboratory Leader)

Can edit only their own laboratory
Can view and manage projects within their lab
Can manage participants of projects in their lab
Project Manager

Can edit only their own project (where they are assigned as manager)
Can submit reports for their project
Can view participants of their project
Student

No access to the admin panel
Admin Panel Features

CRUD Operations

Create, read, update, and delete all entities
Role-based access control (users see only data they are authorized to access)
Project Participant Management

When a participant is "deleted", they are not physically removed, but marked as having left by setting left_at
Multiple participants can be marked as having left via an admin action
Report Export

Excel export for:
Projects
Laboratories
Project participants
Achievements
Event logs
Available via custom admin actions
Event Log

Automatic logging of key actions:
Project creation/update
Report exports
Participant status changes to "former"
All events are viewable in the admin panel under "Event Log"
Standard Django actions are logged in django_admin_log
Data Models

User

Custom user model with roles
Fields: username, email, role, metaverse_link, managed_lab
Lab (Laboratory)

Fields: name, description, direction, active
Project

Fields: title, description, concept_file, lab, active
ProjectParticipant

Fields: user, project, role, joined_at, left_at
"Deletion" sets left_at instead of physically deleting the record
Achievement

Fields: title, description, image, lab or project (exactly one of these must be set)
EventLog

Logs key user actions
Fields: user, action, entity_type, entity_id, timestamp, details
HubSettings

Single record containing Hub description and settings
Accessible only to administrators
Configuration

Database settings

Database configuration can be modified in hub_backend/settings.py:

DATABASES = {
'default': {
'ENGINE': 'django.db.backends.postgresql',
'NAME': 'hub_db',
'USER': 'your_user',
'PASSWORD': 'your_password',
'HOST': 'localhost',
'PORT': '5432',
}
}

Media files

Uploaded files are stored in the media/ folder:

media/concepts/ – project concept files
media/achievements/ – achievement images
Notes

On first launch, create a superuser and assign them the admin role
For a lab lead, the managed_lab field must be set in their user profile
For a project manager, they must be added as a project participant with the manager role
The event log is automatically populated when key actions occur
Access Control Testing

Create a user with the lab_lead role
Assign them a laboratory via the managed_lab field
Log in as this user—they should see only their lab and its projects
Similarly for project_manager: create a project participant with the manager role.

API Endpoints

The project includes a full REST API built with Django REST Framework.

Base URL
http://127.0.0.1:8000/api/

Available endpoints:

GET /api/directions/ – List of activity directions
GET /api/labs/ – List of laboratories
GET /api/labs/{id}/projects/ – Projects within a specific lab
GET /api/projects/ – List of projects
GET /api/projects/{id}/participants/ – Project participants
GET /api/projects/{id}/active_participants/ – Active project participants
GET /api/users/ – List of users
GET /api/users/me/ – Current user's information
GET /api/participants/ – List of project participants
POST /api/participants/{id}/leave/ – Leave a project
GET /api/achievements/ – List of achievements
GET /api/events/ – Event log (read-only)
GET /api/settings/ – Hub settings

Authentication

The API requires authentication. Two methods are supported:

Session Authentication (for the web interface)
Basic Authentication (for API clients)
Permissions

Administrator: Full access to all data
Lab Lead: Access only to their own lab and its projects
Project Manager: Access only to their own project
Student: Read-only access to publicly available data
Filtering and Search

All endpoints support:

Field filtering (via ?field=value)
Full-text search (via ?search=query)
Sorting (via ?ordering=field)
Pagination (20 items per page)
Example requests

Get all laboratories
GET /api/labs/

Get active projects
GET /api/projects/?active=true

Search projects
GET /api/projects/?search=web

Get current user info
GET /api/users/me/

Leave a project
POST /api/participants/1/leave/

Dependencies

Django >= 4.2.0
djangorestframework >= 3.14.0
openpyxl >= 3.1.0 (for Excel export)
Pillow >= 10.0.0 (for image handling)
django-filter >= 23.0 (for API filtering)
python-decouple >= 3.8 (for configuration management)
django-cors-headers >= 4.3.0 (for CORS handling)
