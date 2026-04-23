async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("authMessage").textContent =
        data.msg || data.message || "Eroare la login";
      return;
    }

    localStorage.setItem("token", data.token);
    document.getElementById("authMessage").textContent = "Login reușit!";
    loadTasks();
  } catch (err) {
    document.getElementById("authMessage").textContent = "Eroare server la login.";
    console.error(err);
  }
}