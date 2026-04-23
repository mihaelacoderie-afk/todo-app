async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Eroare la login");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Login reușit!");
  } catch (err) {
    console.error(err);
    alert("Eroare server la login.");
  }
}