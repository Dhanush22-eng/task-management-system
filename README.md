# Task Manager with Search

A simple Task Manager web application built with **Flask, HTML, CSS, and JavaScript**. The application allows users to view and search tasks through a single search interface.

## Features

* View all tasks
* Search tasks by:

  * Title
  * Description
  * Status
  * Priority
  * Tags
  * Due Date
* Dynamic search without page refresh
* REST API-based architecture
* In-memory task storage (no database required)

## Tech Stack

* Python
* Flask
* HTML
* CSS
* JavaScript

## Project Structure

```
backend/
├── app.py
├── tasks.py
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## How to Run

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Create a Virtual Environment (Optional)

```bash
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install flask
```

### 4. Run the Application

```bash
cd backend
python app.py
```

### 5. Open in Browser

```
http://127.0.0.1:5000
```

## Search Examples

* `python`
* `backend`
* `pending`
* `high`
* `frontend`
* `2026-07`

## Design Decisions

* Used Flask for a lightweight backend API.
* Stored tasks in memory as per assignment requirements.
* Implemented a single search box for a simple and intuitive user experience.
* Search is performed across multiple task fields to improve usability.

## Future Improvements

* Database integration (MySQL/PostgreSQL)
* User authentication
* Task creation and editing
* Advanced filtering and sorting
* Pagination for large datasets
