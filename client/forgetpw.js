document.getElementById('forgetForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/sendResetPasswordOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("OTP sent to your email!");

      // Save email to localStorage for use in next step
      localStorage.setItem('resetEmail', email);

      // Redirect to verify OTP page (you'll build this next)
      window.location.href = 'resetotp.html';
    } else {
      alert(data.message || 'Failed to send OTP');
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong while sending OTP");
  }
});