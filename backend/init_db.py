from database import get_connection

# Create database connection
conn = get_connection()
cursor = conn.cursor()

# Create tasks table
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    priority TEXT,
    tags TEXT,
    due_date TEXT
)
""")

conn.commit()

# Sample data
sample_tasks = [
    ("Learn Flask", "Study Flask REST APIs", "Pending", "High", "python,backend", "2026-07-15"),
    ("Build Portfolio", "Create portfolio website", "In Progress", "Medium", "frontend,html", "2026-07-20"),
    ("Prepare Interview", "Practice Python interview questions", "Pending", "High", "python,interview", "2026-07-10"),
    ("Complete Assignment", "Finish company assignment", "Pending", "High", "assignment", "2026-07-08"),
    ("Fix Bug", "Resolve login issue", "Done", "Medium", "bugfix", "2026-07-01"),
    ("Learn JavaScript", "Understand ES6 concepts", "Pending", "Medium", "javascript", "2026-07-25"),
    ("Practice SQL", "Solve SQL queries", "Done", "Low", "sql,database", "2026-07-18"),
    ("Read Flask Docs", "Read official documentation", "Pending", "Low", "flask", "2026-07-30"),
    ("Team Meeting", "Project discussion", "Done", "Medium", "meeting", "2026-07-05"),
    ("Deploy Project", "Deploy to Render", "Pending", "High", "deployment", "2026-07-28"),
    ("Write README", "Update project documentation", "Done", "Low", "github", "2026-07-06"),
    ("Design UI", "Improve CSS", "In Progress", "Medium", "css,ui", "2026-07-22"),
    ("Learn Git", "Practice Git commands", "Done", "Low", "git", "2026-07-12"),
    ("Test API", "Check all API endpoints", "Pending", "High", "api,testing", "2026-07-17"),
    ("Code Review", "Review project code", "Pending", "Medium", "review", "2026-07-27")
]

# Check if table already contains data
cursor.execute("SELECT COUNT(*) FROM tasks")
count = cursor.fetchone()[0]

# Insert sample data only if table is empty
if count == 0:
    cursor.executemany("""
        INSERT INTO tasks (
            title,
            description,
            status,
            priority,
            tags,
            due_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, sample_tasks)

    conn.commit()

# Close resources
cursor.close()
conn.close()

print("Database created successfully!")