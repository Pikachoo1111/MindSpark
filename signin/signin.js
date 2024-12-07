// Preprogrammed accounts  
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  // Find user account
  const account = window.accounts.find(
    (acc) => acc.username === email && acc.password === password
  );

  // Validate login credentials
  if (account) {
    message.style.color = 'green';
    message.textContent = `Login successful! Welcome, ${account.role}.`;

    // Redirect to dashboard based on role
    setTimeout(() => {
      if (account.role === 'teacher') {
        window.location.href = '/workspaces/ImpactXDraftRepo/teacher-dashboard/teacher-dashboard.html';
      } else if (account.role === 'student') {
        window.location.href = '/workspaces/ImpactXDraftRepo/student-dashboard/student-dashboard.html';
      }
    }, 1000);
  } else {
    message.style.color = 'red';
    message.textContent = 'Invalid email or password.';
  }
});
