const searchBox = document.getElementById("search");
const taskList = document.getElementById("taskList");

async function loadTasks(search = "") {

    const response =
        await fetch(`/api/tasks?search=${search}`);

    const tasks = await response.json();

    taskList.innerHTML = "";

    if(tasks.length === 0){
        taskList.innerHTML =
            "<h3>No tasks found</h3>";
        return;
    }

    tasks.forEach(task => {

        taskList.innerHTML += `
        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Status: ${task.status}</p>
            <p>Priority: ${task.priority}</p>
            <p>Tags: ${task.tags.join(", ")}</p>
            <p>Due Date: ${task.due_date}</p>
        </div>
        `;
    });
}

searchBox.addEventListener("keyup", () => {
    loadTasks(searchBox.value);
});

loadTasks();