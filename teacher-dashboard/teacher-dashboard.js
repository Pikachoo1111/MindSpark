let classrooms = [];

function createClassroom() {
  const code = generateUniqueCode();
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
    div.textContent = `Classroom Code: ${code}`;
    classroomsDiv.appendChild(div);
  });
}

function openLessonPlanner() {
  alert('Lesson Planner is under construction.');
}

function openGradebook() {
  alert('Gradebook is under construction.');
}
