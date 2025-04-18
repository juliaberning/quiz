# Quiz Backend

This is the backend service for the Quiz application, built with Django and Django REST framework.

## Features

- User authentication with JWT tokens
- RESTful API endpoints
- CORS enabled for frontend integration
- SQLite database (for development)

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Project Setup

1. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
python manage.py migrate
```

4. Create a superuser (admin):
```bash
python manage.py createsuperuser
```

## Development Server

To start the development server:
```bash
python manage.py runserver
```

The server will run at `http://localhost:8000`

## API Documentation

The API endpoints are available at:
- `http://localhost:8000/api/`

## Authentication

The backend uses JWT (JSON Web Tokens) for authentication. To authenticate:
1. Send a POST request to `/api/token/` with username and password
2. Use the returned access token in the Authorization header: `Bearer <token>`

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (Vue.js development server)

## Security Notes

- The `SECRET_KEY` in settings.py should be changed in production
- Debug mode is enabled by default - disable it in production
- Consider using environment variables for sensitive configuration

## Project Structure

- `quiz_backend/` - Main project directory
  - `settings.py` - Project settings and configuration
  - `urls.py` - URL routing configuration
  - `wsgi.py` - WSGI application entry point
  - `asgi.py` - ASGI application entry point
- `account/` - User account management app
- `manage.py` - Django management script

