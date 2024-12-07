function createClassroom() {
  const name = prompt('Enter classroom name:');
  if (!name) {
    alert('Classroom name cannot be empty.');
    return;
  }

  const code = generateUniqueCode();
  const teacher = auth.currentUser.email; // Authenticated teacher's email
  const students = prompt('Enter student emails separated by commas (optional):').split(',').map(email => email.trim()).filter(email => email);

  // Upload classroom to Firestore
  uploadClassroom(teacher, name, code, students)
    .then(() => {
      alert(`Classroom "${name}" created successfully! Code: ${code}`);
      displayClassrooms(); // Refresh classrooms list
    })
    .catch((error) => {
      console.error("Error creating classroom: ", error);
    });
}

function displayClassrooms() {
  const teacher = auth.currentUser.email; // Authenticated teacher's email
  const classroomsDiv = document.getElementById('classrooms');
  classroomsDiv.innerHTML = '<h3>Your Classrooms</h3>';

  db.collection('classrooms').where('teacher', '==', teacher)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const classroom = doc.data();
        const div = document.createElement('div');
        div.textContent = `${classroom.name} (Code: ${classroom.code})`;
        classroomsDiv.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching classrooms: ", error);
    });
}

function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Initialize the classroom display when the dashboard loads
auth.onAuthStateChanged((user) => {
  if (user) {
    displayClassrooms();
  } else {
    window.location.href = '../../signin/signin.html'; // Redirect to login if not authenticated
  }
});
