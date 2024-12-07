let classrooms = [];

function createClassroom() {
  const code = generateUniqueCode();
  const teacher = firebase.auth().currentUser.email;
  const name = prompt('Enter classroom name:');
  const students = prompt('Enter student emails separated by commas:').split(',');
  //check that all students are valid students
  //if not, alert and return
  for (let i = 0; i < students.length; i++) {
    db.collection("users")
      .where("email", "==", students[i])
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          alert('One or more students are not valid students.');
          return;
        }
      })
      .catch(error => {
        console.error("Error checking student:", error);
      });
  }
  
  window.createClassroom(teacher, name, code, students);
  classrooms.push(code);
  alert(`Classroom created! Code: ${code}`);
  displayClassrooms();
}

function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function displayClassrooms() {
  const classroomsDiv = document.getElementById('classrooms');
  classroomsDiv.innerHTML = '<h3>Your Classrooms</h3>';
  classrooms.forEach((code) => {
    const div = document.createElement('div');
    div.textContent = `Classroom Code: ${codes}`;
    classroomsDiv.appendChild(div);
  });
}
//Attach displayClassrooms to window so it can be called from firebase.js
window.displayClassrooms = displayClassrooms;
function openLessonPlanner() {
  //go to lesson-planner.html
  window.location.href = 'lesson-planner/lesson-planner.html';
}

function openGradebook() {
  alert('Gradebook is under construction.');
}

function checkAllStudents() {
  db.collection("users")
    .where("role", "==", "student")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
      });
    })
    .catch(error => {
      console.error("Error getting documents: ", error);
    });
}