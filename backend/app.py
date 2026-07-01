from flask import Flask, render_template, jsonify, request
from database import get_connection

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/tasks")
def get_tasks():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")

    rows = cursor.fetchall()

    conn.close()

    tasks = []

    for row in rows:

        tasks.append({

            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "status": row["status"],
            "priority": row["priority"],
            "tags": row["tags"].split(","),
            "due_date": row["due_date"]

        })

    search = request.args.get("search", "").lower().strip()

    if search:

        search_words = search.split()

        filtered = []

        for task in tasks:

            text = " ".join([

                task["title"],
                task["description"],
                task["status"],
                task["priority"],
                " ".join(task["tags"]),
                task["due_date"]

            ]).lower()

            # Whole Word Search
            words = text.replace(",", " ").split()

            if all(word in words for word in search_words):

                filtered.append(task)

        return jsonify(filtered)

    return jsonify(tasks)
@app.route("/api/tasks", methods=["POST"])
def add_task():

    data = request.get_json()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO tasks
    (title, description, status, priority, tags, due_date)

    VALUES (?, ?, ?, ?, ?, ?)

    """, (

        data["title"],
        data["description"],
        data["status"],
        data["priority"],
        ",".join(data["tags"]),
        data["due_date"]

    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task Added Successfully"
    }), 201

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM tasks WHERE id=?",
        (task_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task Deleted Successfully"
    })
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""

    UPDATE tasks

    SET title=?,
        description=?,
        status=?,
        priority=?,
        tags=?,
        due_date=?

    WHERE id=?

    """, (

        data["title"],
        data["description"],
        data["status"],
        data["priority"],
        ",".join(data["tags"]),
        data["due_date"],
        task_id

    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message":"Task Updated"
    })

if __name__ == "__main__":
    app.run(debug=True)