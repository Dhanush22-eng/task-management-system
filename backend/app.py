from flask import Flask, render_template, jsonify, request
from tasks import tasks

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/tasks')
def get_tasks():

    search = request.args.get('search', '').lower()

    if search:

        filtered = []

        for task in tasks:

            text = (
                task["title"] + " " +
                task["description"] + " " +
                task["status"] + " " +
                task["priority"] + " " +
                " ".join(task["tags"]) + " " +
                task["due_date"]
            ).lower()

            if search in text:
                filtered.append(task)

        return jsonify(filtered)

    return jsonify(tasks)


if __name__ == "__main__":
    app.run(debug=True)