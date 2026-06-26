const searchBox = document.getElementById("search");
const taskList = document.getElementById("taskList");
const sortSelect = document.getElementById("sort");
const stats = document.getElementById("stats");

async function loadTasks(search = "") {

    const response = await fetch(`/api/tasks?search=${search}`);
    const tasks = await response.json();

    const sort = sortSelect.value;

    // Priority Sorting
    if (sort === "high") {

        const order = {
            "High": 3,
            "Medium": 2,
            "Low": 1
        };

        tasks.sort((a, b) => order[b.priority] - order[a.priority]);
    }

    if (sort === "low") {

        const order = {
            "High": 3,
            "Medium": 2,
            "Low": 1
        };

        tasks.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    // Due Date Sorting
    if (sort === "oldest") {

        tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    }

    if (sort === "newest") {

        tasks.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

    }

    // Clear old content
    taskList.innerHTML = "";

    // No Tasks
    if (tasks.length === 0) {

        stats.innerHTML = "";
        taskList.innerHTML = "<h2>No Tasks Found 😔</h2>";
        return;
    }

    // ===== Statistics =====

    const total = tasks.length;

    const pending = tasks.filter(task => task.status === "Pending").length;

    const progress = tasks.filter(task => task.status === "In Progress").length;

    const done = tasks.filter(task => task.status === "Done").length;

    stats.innerHTML = `

    <div class="stats">

        <div class="box">
            <h2>${total}</h2>
            <p>Total</p>
        </div>

        <div class="box">
            <h2>${pending}</h2>
            <p>Pending</p>
        </div>

        <div class="box">
            <h2>${progress}</h2>
            <p>In Progress</p>
        </div>

        <div class="box">
            <h2>${done}</h2>
            <p>Done</p>
        </div>

    </div>

    `;

    // ===== Display Tasks =====

    tasks.forEach(task => {

        const formattedDate = new Date(task.due_date).toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

        taskList.innerHTML += `

        <div class="task">

            <h2>${task.title}</h2>

            <p>${task.description}</p>

            <div class="badges">

                <span class="status ${task.status.toLowerCase().replace(" ", "-")}">
                    ${task.status}
                </span>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            <p>🏷 ${task.tags.join(", ")}</p>

            <p>📅 ${formattedDate}</p>

        </div>

        `;

    });

}

// Search
searchBox.addEventListener("keyup", () => {

    loadTasks(searchBox.value);

});

// Sorting
sortSelect.addEventListener("change", () => {

    loadTasks(searchBox.value);

});

// Initial Load
loadTasks();