function joinClassroom() {
  const code = document.getElementById('classroomCode').value.trim();
  if (!code) {
    alert('Please enter a valid classroom code.');
    return;
  }

  const studentEmail = auth.currentUser.email; // Authenticated student's email

  db.collection('classrooms').where('code', '==', code)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        alert('Invalid classroom code.');
        return;
      }

      querySnapshot.forEach((doc) => {
        const classroom = doc.data();
        const docId = doc.id;

        if (!classroom.students.includes(studentEmail)) {
          classroom.students.push(studentEmail);

          // Update Firestore with the new student list
          db.collection('classrooms').doc(docId).update({ students: classroom.students })
            .then(() => {
              alert(`Successfully joined classroom: ${classroom.name}`);
              displayStudentClassrooms(); // Refresh the student's classroom list
            })
            .catch((error) => {
              console.error("Error updating classroom: ", error);
            });
        } else {
          alert('You are already enrolled in this classroom.');
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching classroom: ", error);
    });
}

function displayStudentClassrooms() {
  const studentEmail = auth.currentUser.email; // Authenticated student's email
  const remindersDiv = document.getElementById('reminders');
  remindersDiv.innerHTML = '<h3>Your Classrooms</h3>';

  db.collection('classrooms').where('students', 'array-contains', studentEmail)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const classroom = doc.data();
        const div = document.createElement('div');
        div.textContent = `Classroom: ${classroom.name}`;
        remindersDiv.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching student classrooms: ", error);
    });
}

// Initialize the student's classroom display when the dashboard loads
auth.onAuthStateChanged((user) => {
  if (user) {
    displayStudentClassrooms();
  } else {
    window.location.href = '../../signin/signin.html'; // Redirect to login if not authenticated
  }
});

