// createaccount.js
document.getElementById('createForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;
  const role = document.getElementById('role').value;
  const message = document.getElementById('message');

  if (!role) {
    message.style.color = 'red';
    message.textContent = 'Please select a role.';
    return;
  }

  if (window.accounts.find((acc) => acc.username === newUsername)) {
    message.style.color = 'red';
    message.textContent = 'Username already exists. Please choose another.';
    return;
  }

  window.accounts.push({ username: newUsername, password: newPassword, role });
  message.style.color = 'green';
  message.textContent = 'Account created successfully! Redirecting...';

  setTimeout(() => {
    if (role === 'teacher') {
      window.location.href = '/teacher-dashboard/teacher-dashboard.html';
    } else if (role === 'student') {
      window.location.href = '/student-dashboard/student-dashboard.html';
    }
  }, 1000);
});
