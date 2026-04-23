const API_URL = window.location.origin;

const authMessage = document.getElementById("authMessage");
const taskList = document.getElementById("taskList");

function showMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#ff6b6b" : "#22c55e";
}

function getToken() {
  return localStorage.getItem("token");
}

async function register() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Completează email și parolă.", true);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.msg || "Eroare la register.", true);
      return;
    }

    showMessage(data.msg || "Cont creat cu succes.");
  } catch (err) {
    showMessage("Eroare server la register.", true);
  }
}

async function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Completează email și parolă.", true);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.msg || "Eroare la login.", true);
      return;
    }

    localStorage.setItem("token", data.token);
    showMessage("Login reușit.");
    loadTasks();
  } catch (err) {
    showMessage("Eroare server la login.", true);
  }
}

function logout() {
  localStorage.removeItem("token");
  taskList.innerHTML = "";
  showMessage("Te-ai delogat.");
}

async function loadTasks() {
  const token = getToken();

  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.msg || "Nu s-au putut încărca task-urile.", true);
      return;
    }

    renderTasks(data);
  } catch (err) {
    showMessage("Eroare la încărcarea task-urilor.", true);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (!tasks.length) {
    taskList.innerHTML = "<li>Nu ai task-uri momentan.</li>";
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <span class="task-text ${task.completed ? "completed" : ""}">
          ${task.text}
        </span>
      </div>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleTask('${task._id}', ${task.completed})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

async function addTask() {
  const token = getToken();
  const text = document.getElementById("taskText").value.trim();

  if (!token) {
    showMessage("Trebuie să fii logată.", true);
    return;
  }

  if (!text) {
    showMessage("Scrie un task.", true);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.msg || "Nu s-a putut adăuga task-ul.", true);
      return;
    }

    document.getElementById("taskText").value = "";
    loadTasks();
  } catch (err) {
    showMessage("Eroare la adăugarea task-ului.", true);
  }
}

async function deleteTask(id) {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.msg || "Nu s-a putut șterge task-ul.", true);
      return;
    }

    loadTasks();
  } catch (err) {
    showMessage("Eroare la ștergere.", true);
  }
}

async function toggleTask(id, currentCompleted) {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ completed: !currentCompleted })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.msg || "Nu s-a putut actualiza task-ul.", true);
      return;
    }

    loadTasks();
  } catch (err) {
    showMessage("Eroare la actualizare.", true);
  }
}

window.onload = () => {
  if (getToken()) {
    loadTasks();
  }
};