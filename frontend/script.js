const API_URL = window.location.origin;

const authMessage = document.getElementById("authMessage");
const taskList = document.getElementById("taskList");

function getToken() {
  return localStorage.getItem("token");
}

function setMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#f87171" : "#facc15";
}

async function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    setMessage("Completează email și parolă.", true);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.msg || data.message || "Eroare la register.", true);
      return;
    }

    setMessage(data.msg || data.message || "Cont creat cu succes.");
  } catch (error) {
    setMessage("Eroare server la register.", true);
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    setMessage("Completează email și parolă.", true);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.msg || data.message || "Login eșuat.", true);
      return;
    }

    localStorage.setItem("token", data.token);
    setMessage("Login reușit.");
    loadTasks();
  } catch (error) {
    setMessage("Eroare server la login.", true);
  }
}

function logout() {
  localStorage.removeItem("token");
  taskList.innerHTML = "";
  setMessage("Te-ai delogat.");
}

async function loadTasks() {
  const token = getToken();

  if (!token) {
    setMessage("Nu ești logată.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const tasks = await response.json();

    if (!response.ok) {
      setMessage(tasks.msg || "Nu s-au putut încărca task-urile.", true);
      return;
    }

    renderTasks(tasks);
  } catch (error) {
    setMessage("Eroare la încărcarea task-urilor.", true);
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
    setMessage("Trebuie să fii logată.", true);
    return;
  }

  if (!text) {
    setMessage("Scrie un task.", true);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.msg || "Nu s-a putut adăuga task-ul.", true);
      return;
    }

    document.getElementById("taskText").value = "";
    loadTasks();
  } catch (error) {
    setMessage("Eroare la adăugarea task-ului.", true);
  }
}

async function deleteTask(id) {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.msg || "Nu s-a putut șterge task-ul.", true);
      return;
    }

    loadTasks();
  } catch (error) {
    setMessage("Eroare la ștergere.", true);
  }
}

async function toggleTask(id, currentCompleted) {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        completed: !currentCompleted,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.msg || "Nu s-a putut actualiza task-ul.", true);
      return;
    }

    loadTasks();
  } catch (error) {
    setMessage("Eroare la actualizare.", true);
  }
}

window.onload = () => {
  if (getToken()) {
    loadTasks();
  }
};