const API = "http://localhost:3000/api";

const msg = t => document.getElementById("msg").innerText = t;
const token = () => localStorage.getItem("token");

function showApp() {
  document.getElementById("authBox").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

function showAuth() {
  document.getElementById("authBox").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
}

// LOGIN
async function login() {
  const email = emailInput();
  const password = passInput();

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    showApp();
    getTasks();
  } else msg(data.message);
}

// REGISTER
async function register() {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: emailInput(),
      password: passInput()
    })
  });

  const data = await res.json();
  msg(data.message);
}

// ADD TASK
async function addTask() {
  await fetch(API + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token()
    },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      deadline: document.getElementById("deadline").value
    })
  });

  getTasks();
}

// GET TASKS
async function getTasks() {
  const res = await fetch(API + "/tasks", {
    headers: { Authorization: "Bearer " + token() }
  });

  let tasks = await res.json();
  const filter = document.getElementById("filter").value;

  if (filter === "completed") tasks = tasks.filter(t => t.completed);
  if (filter === "active") tasks = tasks.filter(t => !t.completed);

  const list = document.getElementById("list");
  list.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="${t.completed ? "completed" : ""}">
        ${t.title}
      </div>
      <button onclick="toggle('${t._id}', ${!t.completed})">✔</button>
      <button onclick="del('${t._id}')">🗑</button>
    `;

    list.appendChild(li);
  });
}

// UPDATE
async function toggle(id, completed) {
  await fetch(API + "/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token()
    },
    body: JSON.stringify({ completed })
  });

  getTasks();
}

// DELETE
async function del(id) {
  await fetch(API + "/tasks/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token() }
  });

  getTasks();
}

// UTILS
function logout() {
  localStorage.removeItem("token");
  showAuth();
}

const emailInput = () => document.getElementById("email").value;
const passInput = () => document.getElementById("password").value;

// DARK MODE
const btn = document.getElementById("themeToggle");

btn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  if (token()) {
    showApp();
    getTasks();
  } else {
    showAuth();
  }
};