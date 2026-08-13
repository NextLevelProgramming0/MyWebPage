# MyWebPage

A full-stack personal portfolio website built to showcase my software development projects, technical skills, education, and professional experience.

The project demonstrates the development of a modern web application using **React** for the frontend, **Django and Django REST Framework** for the backend, and **PostgreSQL** for persistent data storage.

## Overview

MyWebPage was created as a personal software engineering portfolio and as a hands-on full-stack development project.

Rather than storing all portfolio information directly in the frontend, the application uses a Django REST API to retrieve portfolio data from a PostgreSQL database. This allows information such as projects, skills, education, and experience to be managed through the backend and dynamically displayed by the React frontend.

The project demonstrates experience working across the complete application stack, including frontend development, backend API development, database integration, CRUD operations, and API testing.

## Tech Stack

### Frontend

* React
* JavaScript
* HTML5
* CSS3
* React Components
* React Hooks
* Fetch/API requests

### Backend

* Python
* Django
* Django REST Framework
* Django ORM
* RESTful APIs

### Database

* PostgreSQL
* Neon PostgreSQL
* pgAdmin

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Windows PowerShell 7
* Postman
* Django Admin

## Architecture

The application follows a three-tier full-stack architecture:

```text
┌───────────────────────────┐
│      React Frontend       │
│                           │
│ Components / UI / Hooks   │
└─────────────┬─────────────┘
              │
              │ HTTP / JSON
              ▼
┌───────────────────────────┐
│    Django REST Backend    │
│                           │
│ Views / Serializers / API │
└─────────────┬─────────────┘
              │
              │ Django ORM
              ▼
┌───────────────────────────┐
│        PostgreSQL         │
│                           │
│    Portfolio Data Store   │
└───────────────────────────┘
```

The React frontend sends HTTP requests to the Django REST API.

Django REST Framework processes the requests and uses the Django ORM to communicate with PostgreSQL. Data is serialized into JSON and returned to React for display.

## Portfolio Data

The backend is designed to manage several categories of portfolio information, including:

* Skills
* Projects
* Professional experience
* Education
* Contact information

This separates portfolio content from the frontend presentation layer and allows the information to be updated through the backend.

## REST API

The project uses Django REST Framework to expose portfolio information through RESTful API endpoints.

Example:

```text
/skills/
```

The API supports standard CRUD operations where applicable.

| HTTP Method | Purpose          |
| ----------- | ---------------- |
| GET         | Retrieve records |
| POST        | Create records   |
| PUT         | Update records   |
| DELETE      | Delete records   |

API requests can be tested using tools such as **Postman** before being integrated with the React frontend.

## Django Admin

Django's built-in administration interface can also be used to manage application data.

The admin interface provides a convenient way to add, modify, and remove portfolio information stored in PostgreSQL without directly modifying database records.

## Project Structure

The repository is organized into frontend and backend portions.

```text
MyWebPage/
│
├── api/
│   └── MyWebPageAPI/
│       └── Django backend / REST API
│
├── app/
│   └── React frontend
│
└── README.md
```

### Backend

The Django backend is responsible for:

* Database models
* REST API endpoints
* Data serialization
* CRUD operations
* PostgreSQL communication
* Django Admin

### Frontend

The React frontend is responsible for:

* User interface
* Reusable components
* Portfolio sections
* API requests
* Rendering data returned by Django
* Responsive page content

## Key Features

* Full-stack React and Django architecture
* RESTful API built with Django REST Framework
* PostgreSQL database integration
* Django ORM for database operations
* API-driven React components
* CRUD functionality
* Dynamic portfolio data
* Django Admin data management
* API testing with Postman
* Git and GitHub version control

## Local Development

### Prerequisites

Install the following before running the project locally:

* Python
* Node.js
* npm
* PostgreSQL
* Git

## Clone the Repository

```bash
git clone https://github.com/NextLevelProgramming0/MyWebPage.git
cd MyWebPage
```

## Backend Setup

Navigate to the Django backend directory.

```bash
cd api/MyWebPageAPI
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Configure the PostgreSQL database connection in the Django settings or environment configuration.

Run the database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a Django administrator account if needed:

```bash
python manage.py createsuperuser
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000/
```

## Frontend Setup

Open another terminal and navigate to the React application.

```bash
cd app
```

Install the Node.js dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will normally be available at:

```text
http://localhost:3000/
```

## Development Goals

This project was created to strengthen and demonstrate practical experience with:

* Full-stack web application development
* React frontend development
* Python backend development
* Django REST Framework
* REST API design
* PostgreSQL database integration
* Object-relational mapping with Django ORM
* CRUD operations
* Frontend/backend communication
* API testing and debugging
* Git-based version control

## Project Status

**In Development**

The application is actively being developed as additional frontend functionality, backend capabilities, portfolio content, and improvements are added.

## Future Improvements

Potential future improvements include:

* Expanded portfolio sections
* Improved responsive design
* Additional REST API functionality
* Contact form integration
* Authentication and authorization
* Improved error handling
* Automated testing
* Production deployment
* CI/CD integration

## Author

**Darius Quick**

Computer Science graduate with a Software Engineering focus and experience building applications with Python, Django, React, JavaScript, PostgreSQL, MongoDB, Node.js, Express, and REST APIs.

GitHub: `NextLevelProgramming0`

## Purpose

This repository serves both as my personal portfolio website and as a demonstration of my full-stack development experience.

It highlights my ability to work across the application stack, including designing frontend interfaces, developing backend APIs, integrating relational databases, testing endpoints, debugging application issues, and managing source code with Git and GitHub.
