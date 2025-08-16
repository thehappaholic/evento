document.getElementById('verifyForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const otp = document.getElementById('otp').value;
  const userId = localStorage.getItem('userId');

  const res = await fetch('http://localhost:3000/api/auth/verifyEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, otp })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Email verified successfully!");
    window.location.href = 'login.html';
  } else {
    alert(data.message || 'Verification failed');
  }
});
