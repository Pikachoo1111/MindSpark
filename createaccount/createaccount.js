// createaccount.js
document.getElementById('createForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission behavior
  
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const message = document.getElementById('message');
  
    if (!newUsername || !newPassword) {
      message.style.color = 'red';
      message.textContent = 'Please fill out both fields.';
      return;
    }
  
    // Check if the username already exists
    if (window.accounts.some(acc => acc.username === newUsername)) {
      message.style.color = 'red';
      message.textContent = 'Username already exists. Please choose another.';
    } else {
      // Add the new account to the accounts array
      window.accounts.push({ username: newUsername, password: newPassword });
      message.style.color = 'green';
      message.textContent = 'Account created successfully! You can now login.';
      
      // Optionally log the updated accounts array for debugging
      console.log('Updated accounts:', window.accounts);
  
      // Clear the form fields
      document.getElementById('newUsername').value = '';
      document.getElementById('newPassword').value = '';
    }
  });
  