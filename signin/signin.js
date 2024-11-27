// Preprogrammed accounts  
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
  
    const account = accounts.find(
      (acc) => acc.username === username && acc.password === password
    );
  
    if (account) {
      message.style.color = 'green';
      message.textContent = `Login successful! Welcome, ${account.role}.`;
  
      // Redirect to dashboard based on role
      if (account.role === 'teacher') {
        window.location.href = '../teacher-dashboard/teacher-dashboard.html';
      } else if (account.role === 'student') {
        window.location.href = '../student-dashboard/student-dashboard.html';
      }
    } else {
      message.style.color = 'red';
      message.textContent = 'Invalid username or password.';
    }
  });
  