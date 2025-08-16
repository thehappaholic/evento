document.getElementById('resetForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = localStorage.getItem('resetEmail'); // stored in forgetpw.js
  const otp = document.getElementById('otp').value;
  const newPassword = document.getElementById('newPassword').value;

  if (!email) {
    alert("Email missing. Please go back and request OTP again.");
    window.location.href = 'forgetpw.html';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/resetPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Password reset successful! Please login.");
      localStorage.removeItem('resetEmail');
      window.location.href = 'login.html';
    } else {
      alert(data.message || "Reset failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }
});
