function joinClassroom() {
    const code = document.getElementById('classroomCode').value;
    if (code) {
      alert(`You have joined the classroom: ${code}`);
    } else {
      alert('Please enter a valid classroom code.');
    }
  }
  
