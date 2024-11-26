// Preprogrammed accounts
const accounts = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
  ];
  
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
  
    // Check credentials
    const account = accounts.find(acc => acc.username === username && acc.password === password);
  
    if (account) {
      message.style.color = 'green';
      message.textContent = 'Login successful!';
    } else {
      message.style.color = 'red';
      message.textContent = 'Invalid username or password.';
    }
  });
  