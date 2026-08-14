See FinalizedDjangoReactMyPortfolio Branch for full project...
Go to this website to see a Github Pages deployed sample: https://nextlevelprogramming0.github.io/MyWebPage/

# MyWebPage

A full-stack personal portfolio web application built with **React, Django REST Framework, PostgreSQL, and JWT authentication**.

The project serves as both my professional portfolio and a demonstration of full-stack software development, including REST API development, relational database integration, user authentication, account registration, email verification, protected functionality, and a responsive React frontend.

## Overview

MyWebPage was developed as a full-stack portfolio application to showcase my software development projects, technical skills, education, and professional experience.

The application uses a **React frontend** that communicates with a **Django REST Framework backend** through RESTful API endpoints. Application and portfolio data is stored in **PostgreSQL**, while **JWT authentication** is used to securely authenticate users.

The application includes a complete account workflow with:

* User registration
* User login
* JWT authentication
* Email verification
* Authenticated user functionality
* Backend API integration
* Dynamic frontend behavior based on authentication state

This architecture allows the project to demonstrate both frontend and backend development while maintaining a clear separation between the user interface, API, authentication system, and database.

## Tech Stack

### Frontend

* React
* JavaScript
* HTML5
* CSS3
* React Components
* React Hooks
* REST API integration
* Authentication state management

### Backend

* Python
* Django
* Django REST Framework
* Django ORM
* RESTful APIs
* JWT Authentication
* User Registration
* Email Verification

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

## Application Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│ Portfolio                    │
│ Login                        │
│ Sign Up                      │
│ Email Verification           │
│ Authenticated Functionality  │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               │ JWT
               ▼
┌──────────────────────────────┐
│    Django REST Framework     │
│                              │
│ REST API                     │
│ Authentication               │
│ User Management              │
│ Email Verification           │
│ Serializers / Views          │
└──────────────┬───────────────┘
               │
               │ Django ORM
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
│                              │
│ Users                        │
│ Skills                       │
│ Projects                     │
│ Experience                   │
│ Education                    │
│ Contact Information          │
└──────────────────────────────┘
```

React handles the user interface and sends requests to the Django REST API.

Django REST Framework processes API requests, performs authentication and authorization checks, and communicates with PostgreSQL through the Django ORM.

## Key Features

### User Registration

The application includes a fully functional **Sign Up page** that allows new users to create an account.

Registration information is sent from the React frontend to the Django backend, where the account is created and stored in the application's database.

### User Login

Registered users can authenticate through the application's **Login page**.

Login credentials are sent to the Django backend for validation. After successful authentication, JWT tokens are used to maintain the authenticated session between the React frontend and Django REST API.

### JWT Authentication

The application uses **JSON Web Tokens (JWT)** for authentication between the frontend and backend.

JWT authentication allows the REST API to identify authenticated users without relying on traditional server-side sessions for API authentication.

The general authentication flow is:

```text
User
  │
  ▼
React Login Page
  │
  │ Email / Username + Password
  ▼
Django REST API
  │
  │ Validate Credentials
  ▼
JWT Generated
  │
  ▼
React Application
  │
  │ Authenticated API Request + JWT
  ▼
Protected Django API
```

This provides practical experience implementing token-based authentication in a separated frontend/backend architecture.

### Email Verification

New user accounts use an **email verification workflow**.

The application includes a dedicated Email Verification page that allows the account verification process to be completed before the user gains access to applicable account functionality.

This adds an additional validation step to the account registration process.

### Authentication-Aware Frontend

The React frontend responds dynamically to the user's authentication state.

This allows the application to provide different functionality depending on whether a user is authenticated.

The frontend integrates directly with the Django authentication API to manage the user experience across registration, login, verification, and authenticated functionality.

## Portfolio Functionality

In addition to authentication, the application manages portfolio information including:

* Skills
* Projects
* Professional experience
* Education
* Contact information

Portfolio data is stored in PostgreSQL and accessed through Django REST Framework API endpoints rather than being entirely hardcoded into the React frontend.

## REST API

The backend uses Django REST Framework to expose application functionality through RESTful endpoints.

The API handles areas such as:

```text
Portfolio Data
      │
      ├── Skills
      ├── Projects
      ├── Experience
      ├── Education
      └── Contact Information

User Accounts
      │
      ├── Registration
      ├── Login
      ├── Authentication
      └── Email Verification
```

Standard CRUD operations are supported where applicable.

| HTTP Method | Purpose                                        |
| ----------- | ---------------------------------------------- |
| GET         | Retrieve resources                             |
| POST        | Create resources or submit authentication data |
| PUT         | Update resources                               |
| DELETE      | Delete resources                               |

API functionality can be tested independently using **Postman** before being integrated with the React frontend.

## Django Admin

Django's built-in administration interface provides backend management capabilities for application data.

The admin interface can be used to manage database records without directly modifying PostgreSQL tables.

## Project Structure

```text
MyWebPage/
│
├── api/
│   └── MyWebPageAPI/
│       └── Django REST Framework backend
│
├── app/
│   └── React frontend
│
└── README.md
```

### Backend Responsibilities

The Django backend handles:

* REST API endpoints
* PostgreSQL communication
* Django ORM operations
* User management
* User registration
* JWT authentication
* Email verification
* Data serialization
* CRUD operations
* Django Admin

### Frontend Responsibilities

The React frontend handles:

* Portfolio user interface
* Login page
* Sign Up page
* Email Verification page
* Authentication state
* User interactions
* REST API requests
* Authenticated functionality
* Dynamic data rendering
* Reusable React components

## Local Development

### Prerequisites

Install the following before running the application locally:

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

Navigate to the Django backend:

```bash
cd api/MyWebPageAPI
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it in Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Configure the PostgreSQL database connection and required application environment variables.

Run the Django migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create an administrator account if needed:

```bash
python manage.py createsuperuser
```

Start Django:

```bash
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000/
```

## Frontend Setup

Open another PowerShell window and navigate to the React application:

```bash
cd app
```

Install the frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

## Development Goals

This project was created to demonstrate practical experience with:

* Full-stack application development
* React frontend development
* Python and Django development
* Django REST Framework
* PostgreSQL
* REST API design
* JWT authentication
* User registration and login
* Email verification
* Authentication-aware frontend development
* CRUD operations
* Django ORM
* API testing
* Frontend/backend integration
* Git and GitHub version control

## Project Status

**Active Development**

The application continues to be developed as additional functionality, UI improvements, security features, testing, and portfolio content are added.

## Future Improvements

Potential future improvements include:

* Automated frontend and backend testing
* Expanded authenticated user functionality
* Additional authorization controls
* Improved error handling
* Password reset functionality
* Additional account security features
* Responsive UI improvements
* Production deployment
* CI/CD integration

## Author

**Darius Quick**

Computer Science graduate with a Software Engineering focus and hands-on experience developing full-stack applications using technologies including **Python, Django, React, JavaScript, PostgreSQL, MongoDB, Node.js, Express, REST APIs, and JWT authentication**.

GitHub: `NextLevelProgramming0`

## Purpose

MyWebPage serves as both my professional portfolio and a practical demonstration of my full-stack development skills.

The project demonstrates experience working across the application stack, including building React interfaces, developing Django REST APIs, integrating PostgreSQL, implementing JWT authentication, creating registration and login workflows, implementing email verification, testing APIs, debugging application issues, and managing source code with Git and GitHub.

