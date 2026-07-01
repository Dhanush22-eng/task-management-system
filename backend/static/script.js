const searchBox = document.getElementById("search");
const taskList = document.getElementById("taskList");
const sortSelect = document.getElementById("sort");
const stats = document.getElementById("stats");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const priorityInput = document.getElementById("priority");
const tagsInput = document.getElementById("tags");
const dueDateInput = document.getElementById("due_date");
const addBtn = document.getElementById("addBtn");

let editId = null;
let allTasks = [];

// ==============================
// Load Tasks
// ==============================

async function loadTasks(search = "") {

    try {

        const response = await fetch(
            `/api/tasks?search=${encodeURIComponent(search)}`
        );

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();

        allTasks = tasks;

        const sort = sortSelect.value;

        const order = {
            High: 3,
            Medium: 2,
            Low: 1
        };

        // Priority Sort
        if (sort === "high") {
            tasks.sort((a, b) => order[b.priority] - order[a.priority]);
        }

        if (sort === "low") {
            tasks.sort((a, b) => order[a.priority] - order[b.priority]);
        }

        // Due Date Sort
        if (sort === "oldest") {
            tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        }

        if (sort === "newest") {
            tasks.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
        }

        taskList.innerHTML = "";

        if (tasks.length === 0) {

            stats.innerHTML = "";
            taskList.innerHTML = "<h2>No Tasks Found 😔</h2>";

            return;
        }

        // ==========================
        // Statistics
        // ==========================

        const total = tasks.length;

        const pending =
            tasks.filter(task => task.status === "Pending").length;

        const progress =
            tasks.filter(task => task.status === "In Progress").length;

        const done =
            tasks.filter(task => task.status === "Done").length;

        stats.innerHTML = `

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

`;

        let html = "";
                // ==========================
        // Display Tasks
        // ==========================

        tasks.forEach(task => {

            const formattedDate = task.due_date
                ? new Date(task.due_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                  })
                : "No Due Date";

            const tags = Array.isArray(task.tags)
                ? task.tags.join(", ")
                : task.tags;

            html += `

            <div class="task">

                <h2>${task.title}</h2>

                <p>${task.description}</p>

                <div class="badges">

                    <span class="status ${task.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}">

                        ${task.status}

                    </span>

                    <span class="priority ${task.priority.toLowerCase()}">

                        ${task.priority}

                    </span>

                </div>

                <p>🏷 ${tags}</p>

                <p>📅 ${formattedDate}</p>

                <div style="display:flex;gap:10px;margin-top:15px;">

                    <button onclick="editTask(${task.id})">
                        ✏ Edit
                    </button>

                    <button onclick="deleteTask(${task.id})">
                        🗑 Delete
                    </button>

                </div>

            </div>

            `;

        });

        taskList.innerHTML = html;

    } catch (error) {

        console.error(error);

        stats.innerHTML = "";

        taskList.innerHTML =
            "<h2>❌ Failed to load tasks.</h2>";
    }
}
 // ==============================
 // Edit Task
 // ==============================

function editTask(id) {

    const task = allTasks.find(t => t.id === id);

    if (!task) return;

    editId = id;

    titleInput.value = task.title;
    descriptionInput.value = task.description;
    statusInput.value = task.status;
    priorityInput.value = task.priority;

    tagsInput.value = Array.isArray(task.tags)
        ? task.tags.join(",")
        : task.tags;

    // Fix date input
    dueDateInput.value = task.due_date
        ? task.due_date.split("T")[0]
        : "";

    addBtn.innerText = "✏ Update Task";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ==============================
// Delete Task
// ==============================

async function deleteTask(id) {

    const ok = confirm("Delete this task?");

    if (!ok) return;

    try {

        const response = await fetch(`/api/tasks/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        loadTasks(searchBox.value);

    } catch (error) {

        console.error(error);

        alert("❌ Failed to delete task.");

    }

}
// ==============================
// Add / Update Task
// ==============================

addBtn.addEventListener("click", addTask);

async function addTask() {

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const status = statusInput.value;
    const priority = priorityInput.value;

    const tags = tagsInput.value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    const due_date = dueDateInput.value;

    if (
        title === "" ||
        description === "" ||
        due_date === ""
    ) {
        alert("Please fill all required fields.");
        return;
    }

    const task = {
        title,
        description,
        status,
        priority,
        tags,
        due_date
    };

    let url = "/api/tasks";
    let method = "POST";

    if (editId !== null) {
        url = `/api/tasks/${editId}`;
        method = "PUT";
    }

    try {

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error("Save failed");
        }

        clearForm();

        loadTasks(searchBox.value);

    } catch (error) {

        console.error(error);

        alert("❌ Failed to save task. Mention the upcoming date ");

    }

}

// ==============================
// Clear Form
// ==============================

function clearForm() {

    editId = null;

    titleInput.value = "";
    descriptionInput.value = "";
    tagsInput.value = "";
    dueDateInput.value = "";

    statusInput.value = "Pending";
    priorityInput.value = "Medium";

    addBtn.innerText = "➕ Add Task";

}
// ==============================
// Search
// ==============================

searchBox.addEventListener("keyup", () => {
    loadTasks(searchBox.value);
});

// ==============================
// Sorting
// ==============================

sortSelect.addEventListener("change", () => {
    loadTasks(searchBox.value);
});

// ==============================
// Initial Load
// ==============================

loadTasks();