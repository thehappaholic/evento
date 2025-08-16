document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // to save JWT cookie
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Welcome to Evento! 🎉");
      localStorage.setItem('userId', data.user._id);
      window.location.href = 'dashboard.html'; // or your preferred page
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("Something went wrong while registering");
  }
});