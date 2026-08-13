# MYWEBPAGE — COMPLETE BEGINNER SETUP GUIDE
# ==========================================
#
# This file is intentionally located in the project root so it is easy to find.
# It is both documentation and an executable help file. To display it, run:
#
#     python directions.py
#
# The application consists of:
#   • React frontend: http://localhost:3000
#   • Django REST API: http://127.0.0.1:8000
#   • PostgreSQL database
#   • JWT login, verified signup, and password-reset email workflows
#   • Separate Home, Skills, Projects, Experience, Education, and Contact Info
#     data for every authenticated account
#   • Automatic local Wi-Fi link detection for verification and password reset
#
# All commands below are for Windows PowerShell. Run one command at a time.
#
#
# 1. INSTALL THE REQUIRED SOFTWARE
# --------------------------------
#
# Download and install these programs if they are not already installed:
#
#   • Git:        https://git-scm.com/download/win
#   • Python:     https://www.python.org/downloads/
#   • Node.js LTS:https://nodejs.org/
#   • PostgreSQL: https://www.postgresql.org/download/windows/
#
# During Python installation, select “Add Python to PATH.”
# Remember the PostgreSQL password chosen during installation.
#
# Close and reopen PowerShell, then verify everything:
#
#     git --version
#     python --version
#     node --version
#     npm --version
#     psql --version
#
# Python 3.12+, Node.js 20+, and PostgreSQL 15+ are recommended.
#
#
# 2. DOWNLOAD AND OPEN THE PROJECT
# --------------------------------
#
# If using Git, replace YOUR_REPOSITORY_URL with the repository URL:
#
#     git clone YOUR_REPOSITORY_URL
#     cd "MyWebPage-MyWebPage-v1.1"
#
# If using a ZIP file, extract it, open PowerShell in the extracted folder, and
# confirm that package.json, src, api, and this directions.py file are visible:
#
#     Get-ChildItem
#
# All remaining frontend commands use this project-root folder.
#
#
# 3. CREATE THE POSTGRESQL DATABASE
# ---------------------------------
#
# Option A — local PostgreSQL
#
# Open PostgreSQL's SQL Shell (psql), or run:
#
#     psql -U postgres
#
# At the postgres=# prompt, choose your own strong password and run:
#
#     CREATE USER mywebpage_user WITH PASSWORD 'REPLACE_WITH_A_STRONG_PASSWORD';
#     CREATE DATABASE "MyWebPage" OWNER mywebpage_user;
#     GRANT ALL PRIVILEGES ON DATABASE "MyWebPage" TO mywebpage_user;
#     \q
#
# In PowerShell, configure Django for this PowerShell window:
#
#     $env:DB_NAME="MyWebPage"
#     $env:DB_USER="mywebpage_user"
#     $env:DB_PASSWORD="REPLACE_WITH_A_STRONG_PASSWORD"
#     $env:DB_HOST="127.0.0.1"
#     $env:DB_PORT="5432"
#
# Option B — hosted PostgreSQL (Neon, Supabase, or another provider)
#
# Copy the separate values from the provider's connection information:
#
#     $env:DB_NAME="YOUR_DATABASE_NAME"
#     $env:DB_USER="YOUR_DATABASE_USER"
#     $env:DB_PASSWORD="YOUR_DATABASE_PASSWORD"
#     $env:DB_HOST="YOUR_DATABASE_HOST"
#     $env:DB_PORT="5432"
#
# The connection must support SSL because this project uses sslmode=require.
# Never commit database passwords to Git.
#
#
# 4. CREATE THE PYTHON ENVIRONMENT AND INSTALL THE API
# -----------------------------------------------------
#
# From the project root:
#
#     python -m venv .venv
#     .\.venv\Scripts\Activate.ps1
#
# If PowerShell blocks activation, run this once in the same window, then retry:
#
#     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#     .\.venv\Scripts\Activate.ps1
#
# Install the backend packages:
#
#     python -m pip install --upgrade pip
#     python -m pip install -r .\api\requirements.txt
#
# Create a unique Django secret for this PowerShell window:
#
#     $env:DJANGO_SECRET_KEY = python -c "from secrets import token_urlsafe; print(token_urlsafe(50))"
#
# Move into the folder containing manage.py and prepare PostgreSQL:
#
#     cd .\api\MyWebPageAPI
#     python manage.py migrate
#     python manage.py check --database default
#
# The final check should say “System check identified no issues.”
#
#
# 5. CREATE THE FIRST ADMINISTRATOR ACCOUNT
# ------------------------------------------
#
# Still inside api\MyWebPageAPI, run:
#
#     python manage.py createsuperuser
#
# Enter a username, email address, and strong password when prompted. The email
# address is important because this app supports login by email and password
# reset by email.
#
# The account is stored in PostgreSQL. Passwords are stored as secure hashes,
# never as plain text. Portfolio records also contain an owner relationship, so
# each account can read and change only its own information.
#
#
# 6. CONFIGURE EMAIL
# ------------------
#
# Development-only option (no email provider required)
#
# Leave EMAIL_BACKEND unset. Verification and password-reset messages will print
# in the Django terminal. Copy the link from that terminal into your browser.
#
# Real email option
#
# Obtain SMTP credentials from an email provider. Providers often require an app
# password or SMTP API key instead of the normal account password. Set:
#
#     $env:FRONTEND_URL="http://localhost:3000"
#     $env:EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
#     $env:EMAIL_HOST="YOUR_SMTP_HOST"
#     $env:EMAIL_PORT="587"
#     $env:EMAIL_HOST_USER="YOUR_SMTP_USERNAME"
#     $env:EMAIL_HOST_PASSWORD="YOUR_SMTP_PASSWORD_OR_API_KEY"
#     $env:EMAIL_USE_TLS="true"
#     $env:EMAIL_USE_SSL="false"
#     $env:DEFAULT_FROM_EMAIL="MyWebPage <no-reply@yourdomain.com>"
#
# AOL example (AOL requires a generated app password, not the account password):
#
#     $env:EMAIL_HOST="smtp.aol.com"
#     $env:EMAIL_PORT="465"
#     $env:EMAIL_HOST_USER="YOUR_FULL_AOL_ADDRESS"
#     $env:EMAIL_HOST_PASSWORD="YOUR_AOL_APP_PASSWORD"
#     $env:EMAIL_USE_TLS="false"
#     $env:EMAIL_USE_SSL="true"
#
# api\.env.example documents the available variables. Django also automatically
# loads api\.env when it exists. The repository ignores .env files. Never share
# app passwords or commit real database/email credentials to Git.
#
#
# 7. START THE DJANGO API (TERMINAL 1)
# ------------------------------------
#
# Open PowerShell, go to the project root, reactivate the environment, set the
# DB_* and email variables described above, then run:
#
#     .\.venv\Scripts\Activate.ps1
#     cd .\api\MyWebPageAPI
#     python manage.py runserver 0.0.0.0:8000
#
# Keep this terminal open. Confirm the API at:
#
#     http://127.0.0.1:8000/
#
# Using 0.0.0.0 allows phones and other devices on the same private Wi-Fi to
# reach Django. If Windows Firewall asks, allow Python on private networks only.
#
#
# 8. INSTALL AND START REACT (TERMINAL 2)
# ---------------------------------------
#
# Open a second PowerShell window in the project root:
#
#     npm install
#     npm start
#
# The browser should open http://localhost:3000/login automatically.
# Keep this terminal open while using the application.
#
# To open the app on another device, find the computer's Wi-Fi address:
#
#     Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }
#
# On a phone connected to the same Wi-Fi, open http://COMPUTER_WIFI_IP:3000.
# The frontend selects that hostname for API calls automatically. Verification
# and reset emails also replace localhost with the host computer's detected LAN
# address, so their links can open on another device on the same Wi-Fi.
#
#
# 9. USE AUTHENTICATION
# ---------------------
#
# Existing account:
#   1. Open http://localhost:3000/login.
#   2. Enter either the username or email address.
#   3. Enter the password and select Log in.
#
# New account:
#   1. Select Sign Up.
#   2. Enter an email address and preliminary password.
#   3. Open the verification email (or copy its link from Terminal 1).
#   4. Follow the link within 24 hours.
#   5. Choose the final username and password.
#   6. Return to Login.
#
# Forgotten password:
#   1. Select Forgot password?.
#   2. Enter the account email address.
#   3. Follow the emailed reset link and choose a new password.
#
# JWT access and refresh tokens are kept in browser session storage. Selecting
# Log out clears them and returns to Login.
#
# Account data isolation:
#   • Every new account begins with clean, empty portfolio collections.
#   • Skills, Projects, Experience, Education, and Contact Info records belong
#     only to the account that created them.
#   • Education files and downloads are protected by the same ownership check.
#   • Each account has its own uploaded Home professional picture.
#   • Only the two explicitly configured legacy email accounts receive the
#     bundled default picture; other accounts begin with a blank 3:4 image slate.
#
#
# 10. NORMAL COMMANDS AFTER THE FIRST SETUP
# -----------------------------------------
#
# Backend terminal, from the project root (set DB_* variables first if they are
# not permanently configured):
#
#     .\.venv\Scripts\Activate.ps1
#     cd .\api\MyWebPageAPI
#     python manage.py runserver 0.0.0.0:8000
#
# Frontend terminal, from the project root:
#
#     npm start
#
# After changing Django models:
#
#     python manage.py makemigrations
#     python manage.py migrate
#
# Run checks and build the frontend:
#
#     python manage.py check
#     cd ..\..
#     npm run build
#
#
# 11. IMPORTANT FILE LOCATIONS
# ----------------------------
#
#   directions.py                         Root copy of this guide
#   api\directions.py                    Identical API-folder copy
#   package.json                          React dependencies and commands
#   src\                                  React pages and authentication UI
#   src\Variables.js                     API and media server URLs
#   api\requirements.txt                 Python dependencies
#   api\.env.example                     SMTP environment-variable example
#   api\MyWebPageAPI\manage.py           Django command entry point
#   api\MyWebPageAPI\MyWebPageAPI\settings.py  Django/PostgreSQL settings
#   api\MyWebPageAPI\MyWebPage\          Models, API views, and authentication
#
#
# 12. TROUBLESHOOTING
# -------------------
#
# “python is not recognized”
#   Reinstall Python and select “Add Python to PATH,” then reopen PowerShell.
#
# “npm is not recognized”
#   Install Node.js LTS and reopen PowerShell.
#
# PostgreSQL connection error
#   Confirm PostgreSQL is running and recheck DB_NAME, DB_USER, DB_PASSWORD,
#   DB_HOST, and DB_PORT in the same terminal that starts Django.
#
# HTTP 401 Unauthorized
#   Log in again. The API intentionally requires a valid JWT.
#
# Verification/reset email did not arrive
#   Check the Django terminal when using the console backend. With SMTP, verify
#   the host, port, username, password/API key, TLS setting, spam folder, and
#   sender-address authorization.
#
# React cannot reach Django
#   Confirm Django was started with "runserver 0.0.0.0:8000" and React with
#   "npm start". On another device, use the computer's Wi-Fi IP and ensure both
#   devices use the same network. Allow Python and Node.js through Windows
#   Firewall on private networks. src\Variables.js selects the current hostname.
#
# Verification page says “Failed to fetch”
#   Django is usually listening only on 127.0.0.1. Stop it with Ctrl+C and run:
#
#     python manage.py runserver 0.0.0.0:8000
#
# Verification link says “site can't be reached” on a phone
#   Open the newest email, keep both servers running, use the same Wi-Fi, and
#   confirm the link contains the computer's private address rather than
#   localhost. Private Wi-Fi links are not publicly accessible over mobile data.
#
# Reset an administrator password:
#
#     python manage.py changepassword YOUR_USERNAME
#
#
# 13. PRODUCTION WARNING
# ----------------------
#
# The included Django and React development servers are not production servers.
# Before public deployment: set DEBUG=False, configure ALLOWED_HOSTS and exact
# CORS origins, use HTTPS, rotate any exposed credentials, use a production
# WSGI/ASGI server, serve React's production build, secure media storage, use a
# real SMTP provider, back up PostgreSQL, and keep all secrets in the hosting
# platform's environment-variable/secret manager.

from pathlib import Path


def display_guide():
    """Print the commented setup guide stored in this file."""
    lines = Path(__file__).read_text(encoding="utf-8").splitlines()
    for line in lines:
        if not line.startswith("#"):
            break
        print(line[2:] if line.startswith("# ") else "")


if __name__ == "__main__":
    display_guide()
