// createaccount.js
document.getElementById('createForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const message = document.getElementById('message');

  // Validate role selection
  if (!role) {
    message.style.color = 'red';
    message.textContent = 'Please select a role.';
    return;
  }

  // Check if username already exists
  if (window.accounts.find((acc) => acc.username === email)) {
    message.style.color = 'red';
    message.textContent = 'Email already exists. Please use another.';
    return;
  }

  // Add new user account
  window.accounts.push({ username: email, password, role });
  message.style.color = 'green';
  message.textContent = 'Account created successfully! Redirecting...';

  // Redirect to dashboard based on role
  setTimeout(() => {
    if (role === 'teacher') {
      window.location.href = 'teacher-dashboard/teacher-dashboard.html';
    } else if (role === 'student') {
      window.location.href = 'student-dashboard/student-dashboard.html';
    }
  }, 1000);
});
