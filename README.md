# Student Digital Hub - Backend

A comprehensive Django REST API backend for managing student projects, laboratories, and participants in a digital hub platform.

- **Role-based Access Control** - Admin, Lab Lead, Project Manager, and Student roles
- **RESTful API** - Full CRUD operations with Django REST Framework
- **Admin Panel** - Customized Django admin with role-based filtering
- **Event Logging** - Automatic tracking of key actions
- **Excel Export** - Export reports for projects, labs, participants, and achievements
- **File Management** - Upload and manage project concept files and achievement images
- **Advanced Filtering** - Search, filter, and pagination for all endpoints
##Installation

### Prerequisites

- Python 3.8+
- pip
- PostgreSQL (optional, SQLite by default)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Fxshtro/webSiteForHub.git
cd webSiteForHub
git checkout Backend
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment

Create a `.env` file in the project root (optional):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_ENGINE=django.db.backends.sqlite3
```

### Step 4: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Initialize Data

```bash
python manage.py init_hub
```

This creates default Hub settings and sample activity directions.

### Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

After creation, log in to the admin panel and set the `admin` role for this user.

### Step 7: Run Development Server

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000/admin/ for the admin panel or http://127.0.0.1:8000/api/ for the API root.

## Project Structure

```
hub_backend/
├── hub/                    # Main application
│   ├── models.py           # Data models
│   ├── viewsets.py         # API viewsets
│   ├── serializers.py      # API serializers
│   ├── permissions.py      # Custom permissions
│   ├── admin.py            # Admin panel configuration
│   ├── urls.py             # API URL routing
│   ├── views.py            # Additional views
│   ├── signals.py          # Django signals
│   └── utils.py            # Utility functions
├── hub_backend/            # Project settings
│   ├── settings.py         # Django settings
│   └── urls.py             # Root URL configuration
├── media/                  # Uploaded files
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

## User Roles

### Administrator
- Full access to all data and settings
- Can manage all laboratories, projects, and participants
- Access to event logs and system settings
- Can export reports

### Laboratory Leader
- Can edit only their assigned laboratory
- Sees and manages projects within their laboratory
- Can manage participants of their laboratory's projects
- Limited access to other data

### Project Manager
- Can edit only projects where they are assigned as manager
- Can submit reports for their projects
- Sees participants of their managed projects
- Read-only access to other data

### Student
- Read-only access to available data
- No admin panel access
- Can view projects, labs, and achievements through API

## API Documentation

### Base URL
```
http://127.0.0.1:8000/api/
```

### Authentication

All API endpoints require authentication. Two methods are supported:

- **Session Authentication** - For web interface
- **Basic Authentication** - For API clients

### Endpoints

#### Directions
- `GET /api/directions/` - List all activity directions
- `POST /api/directions/` - Create direction (Admin only)
- `GET /api/directions/{id}/` - Get direction details
- `PUT /api/directions/{id}/` - Update direction (Admin only)
- `DELETE /api/directions/{id}/` - Delete direction (Admin only)

#### Laboratories
- `GET /api/labs/` - List laboratories
- `POST /api/labs/` - Create laboratory (Admin only)
- `GET /api/labs/{id}/` - Get laboratory details
- `GET /api/labs/{id}/projects/` - Get laboratory projects
- `PUT /api/labs/{id}/` - Update laboratory
- `DELETE /api/labs/{id}/` - Delete laboratory

#### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Get project details
- `GET /api/projects/{id}/participants/` - Get project participants
- `GET /api/projects/{id}/active_participants/` - Get active participants
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

#### Users
- `GET /api/users/` - List users
- `GET /api/users/me/` - Get current user information
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user (own profile or Admin)

#### Participants
- `GET /api/participants/` - List project participants
- `POST /api/participants/` - Add participant to project
- `GET /api/participants/{id}/` - Get participant details
- `POST /api/participants/{id}/leave/` - Leave project
- `PUT /api/participants/{id}/` - Update participant
- `DELETE /api/participants/{id}/` - Remove participant

#### Achievements
- `GET /api/achievements/` - List achievements
- `POST /api/achievements/` - Create achievement
- `GET /api/achievements/{id}/` - Get achievement details
- `PUT /api/achievements/{id}/` - Update achievement
- `DELETE /api/achievements/{id}/` - Delete achievement

#### Events
- `GET /api/events/` - List event log entries (read-only)
- `GET /api/events/{id}/` - Get event details

#### Settings
- `GET /api/settings/` - Get Hub settings
- `PUT /api/settings/` - Update Hub settings (Admin only)

### Query Parameters

All list endpoints support:

- **Filtering**: `?field=value` (e.g., `?active=true`)
- **Search**: `?search=query` (searches in relevant fields)
- **Ordering**: `?ordering=field` or `?ordering=-field` (descending)
- **Pagination**: `?page=1` (20 items per page)

### Example Requests

```bash
# Get all active laboratories
curl -u username:password http://127.0.0.1:8000/api/labs/?active=true

# Search projects
curl -u username:password http://127.0.0.1:8000/api/projects/?search=web

# Get current user info
curl -u username:password http://127.0.0.1:8000/api/users/me/

# Leave a project
curl -X POST -u username:password http://127.0.0.1:8000/api/participants/1/leave/
```

## Configuration

### Database

By default, the project uses SQLite. To use PostgreSQL, update `hub_backend/settings.py` or set environment variables:

```env
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=hub_db
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### CORS Settings

Configure allowed origins in `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Media Files

Uploaded files are stored in the `media/` directory:
- `media/concepts/` - Project concept files
- `media/achievements/` - Achievement images

##Dependencies

- **Django** >= 4.2.0 - Web framework
- **djangorestframework** >= 3.14.0 - REST API framework
- **django-filter** >= 23.0 - Advanced filtering
- **django-cors-headers** >= 4.3.0 - CORS support
- **openpyxl** >= 3.1.0 - Excel export
- **Pillow** >= 10.0.0 - Image processing
- **python-decouple** >= 3.8 - Environment variables
