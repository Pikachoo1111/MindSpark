import { auth, db } from '../firebase';

// Join a classroom
async function joinClassroom() {
  const code = document.getElementById('classroomCode').value.trim();
  if (!code) {
    alert('Please enter a valid classroom code.');
    return;
  }

  const studentEmail = auth.currentUser.email; // Authenticated student's email

  try {
    // Find the classroom with the provided code
    const querySnapshot = await db.collection('classrooms').where('code', '==', code).get();
    if (querySnapshot.empty) {
      alert('Invalid classroom code.');
      return;
    }

    const classroomDoc = querySnapshot.docs[0]; // Assuming codes are unique
    const classroom = classroomDoc.data();
    const docId = classroomDoc.id;

    // Check if the student is already in the classroom
    if (classroom.students.includes(studentEmail)) {
      alert('You are already enrolled in this classroom.');
      return;
    }

    // Add the student to the classroom
    const updatedStudents = [...classroom.students, studentEmail];
    await db.collection('classrooms').doc(docId).update({ students: updatedStudents });

    alert(`Successfully joined classroom: ${classroom.name}`);
    displayStudentClassrooms(); // Refresh the classroom list
  } catch (error) {
    console.error('Error joining classroom:', error);
    alert('Failed to join classroom. Please try again.');
  }
}

// Display the classrooms the student has joined
async function displayStudentClassrooms() {
  const studentEmail = auth.currentUser.email; // Authenticated student's email
  const remindersDiv = document.getElementById('reminders');
  remindersDiv.innerHTML = '<h3>Your Classrooms</h3>';

  try {
    const querySnapshot = await db.collection('classrooms')
      .where('students', 'array-contains', studentEmail)
      .get();

    querySnapshot.forEach((doc) => {
      const classroom = doc.data();
      const div = document.createElement('div');
      div.textContent = `Classroom: ${classroom.name} (Code: ${classroom.code})`;
      remindersDiv.appendChild(div);
    });
  } catch (error) {
    console.error('Error fetching student classrooms:', error);
  }
}

// Display the to-do list for the student
async function displayToDoList() {
  const studentEmail = auth.currentUser.email; // Authenticated student's email
  const todoListDiv = document.getElementById('todo-list');
  todoListDiv.innerHTML = '<h3>My To-Do List</h3>';

  try {
    const querySnapshot = await db.collection('todos')
      .where('student', '==', studentEmail)
      .get();

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const taskId = doc.id;

      const div = document.createElement('div');
      div.className = 'task-item';
      div.innerHTML = `
        <input type="checkbox" id="${taskId}" ${task.completed ? 'checked' : ''} 
          onchange="toggleTaskCompletion('${taskId}', this.checked)">
        <label for="${taskId}">${task.task} (Due: ${task.dueDate})</label>
      `;
      todoListDiv.appendChild(div);
    });
  } catch (error) {
    console.error('Error fetching to-do list:', error);
  }
}

// Toggle task completion
async function toggleTaskCompletion(taskId, isCompleted) {
  try {
    await db.collection('todos').doc(taskId).update({
      completed: isCompleted,
    });
    alert('Task updated successfully!');
  } catch (error) {
    console.error('Error updating task completion:', error);
  }
}

// Initialize the dashboard
auth.onAuthStateChanged((user) => {
  if (user) {
    // Display classrooms and to-do list
    displayStudentClassrooms();
    displayToDoList();
  } else {
    window.location.href = '../../signin/signin.html'; // Redirect if not authenticated
  }
});

async function displayStudentGrades() {
  const studentEmail = auth.currentUser?.email; // Get authenticated student's email
  if (!studentEmail) {
    alert("You must be logged in to view your grades.");
    return;
  }

  const gradesDiv = document.getElementById("student-grades");
  gradesDiv.innerHTML = "<h3>My Grades</h3>";

  try {
    const querySnapshot = await db.collection("grades")
      .where("student", "==", studentEmail)
      .get();

    if (querySnapshot.empty) {
      gradesDiv.innerHTML += "<p>No grades available yet.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const grade = doc.data();
      const div = document.createElement("div");
      div.className = "grade-item";
      div.innerHTML = `
        <p><strong>Classroom:</strong> ${grade.classroom}</p>
        <p><strong>Assignment:</strong> ${grade.assignment}</p>
        <p><strong>Grade:</strong> ${grade.grade}</p>
      `;
      gradesDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    alert("Failed to fetch grades. Please try again.");
  }
}

// Initialize the student grades section when the page loads
auth.onAuthStateChanged((user) => {
  if (user) {
    displayStudentGrades();
  } else {
    window.location.href = "../../signin/signin.html"; // Redirect if not authenticated
  }
});
// Download grades as a CSV file
async function downloadStudentGrades() {
  const studentEmail = auth.currentUser?.email; // Authenticated student's email
  if (!studentEmail) {
    alert("You must be logged in to download your grades.");
    return;
  }

  try {
    // Fetch grades from Firestore
    const querySnapshot = await db.collection("grades").where("student", "==", studentEmail).get();

    if (querySnapshot.empty) {
      alert("No grades available to download.");
      return;
    }

    // Prepare data for CSV
    const rows = [["Classroom", "Assignment", "Grade"]]; // CSV header
    querySnapshot.forEach(doc => {
      const grade = doc.data();
      rows.push([grade.classroom, grade.assignment, grade.grade]);
    });

    // Convert data to CSV format
    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a link and download the CSV
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-grades.csv";
    link.click();

    alert("Your grades have been downloaded.");
  } catch (error) {
    console.error("Error downloading grades:", error);
    alert("Failed to download grades. Please try again.");
  }
}
