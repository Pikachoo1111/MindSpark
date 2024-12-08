import { auth, db } from '../firebase';


// Function to create a classroom
async function createClassroom() {
  const name = prompt("Enter classroom name:");
  if (!name) {
      alert("Classroom name cannot be empty.");
      return;
  }

  const code = generateUniqueCode();
  const teacher = auth.currentUser.email; // Get the logged-in teacher's email
  const studentsInput = prompt("Enter student emails separated by commas (optional):");
  const students = studentsInput ? studentsInput.split(",").map(email => email.trim()).filter(email => email) : [];

  try {
      // Add classroom to Firestore
      await db.collection('classrooms').add({
          name,
          code,
          teacher,
          students,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      alert(`Classroom "${name}" created successfully! Code: ${code}`);
      displayClassrooms(); // Refresh the list of classrooms
  } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Failed to create classroom. Please try again.");
  }
}

// Function to display classrooms created by the teacher
async function displayClassrooms() {
  const teacher = auth.currentUser.email; // Get the logged-in teacher's email
  const classroomsDiv = document.getElementById("classrooms");
  classroomsDiv.innerHTML = "<h3>Your Classrooms</h3>";

  try {
      const querySnapshot = await db.collection('classrooms').where('teacher', '==', teacher).get();
      querySnapshot.forEach((doc) => {
          const classroom = doc.data();
          const div = document.createElement('div');
          div.textContent = `${classroom.name} (Code: ${classroom.code}, Students: ${classroom.students.length})`;
          classroomsDiv.appendChild(div);
      });
  } catch (error) {
      console.error("Error fetching classrooms:", error);
  }
}

// Generate a unique classroom code
function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Initialize the classrooms display when the dashboard loads
auth.onAuthStateChanged((user) => {
  if (user) {
      displayClassrooms();
  } else {
      window.location.href = "../../signin/signin.html"; // Redirect to login if not authenticated
  }
});


function openGradebook() {
  window.location.href = "../gradebook/gradebook.html";
}

//please dont edit path, is working
function openLessonPlanner() {
  window.location.href = "../teacher-dashboard/lesson-planner/lesson-planner.html";
}

function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function addStudentTodo() {
  const studentIndex = document.getElementById("student-select").value;
  const newTodo = document.getElementById("new-todo").value;
  if (newTodo === "") {
    alert("Please enter a task.");
    return;
  }

  const studentEmail = students[studentIndex].email; // Get the student's email

  db.collection("todos").add({
    student: studentEmail,
    description: newTodo,
  })
  .then(() => {
    alert("Task added successfully!");
    document.getElementById("new-todo").value = "";
  })
  .catch((error) => {
    console.error("Error adding task: ", error);
  });
}

// Initialize display when the dashboard loads
auth.onAuthStateChanged((user) => {
  if (user) {
    displayClassrooms();
    // Populate student select dropdown (assuming you have a way to get student data)
    populateStudentSelect(); 
  } else {
    window.location.href = "../../signin/signin.html"; // Redirect to login if not authenticated
  }
});

// Function to populate the student select dropdown (replace with actual data retrieval)
function populateStudentSelect() {
  const select = document.getElementById("student-select");
  select.innerHTML = "";
  // Replace with actual code to get students from your database or other source
  const students = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" }
  ]; 

  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.email; // Use email as the value for easier identification
    option.text = student.name;
    select.appendChild(option);
  });
}
// Assign a task to a student with a due date
// Function to assign a task
async function assignTask() {
  const studentEmail = document.getElementById("student-email").value.trim();
  const taskDescription = document.getElementById("task").value.trim();
  const dueDate = document.getElementById("due-date").value;

  if (!studentEmail || !taskDescription || !dueDate) {
    alert("Please fill out all fields before assigning a task.");
    return;
  }

  const teacherEmail = auth.currentUser?.email; // Authenticated teacher's email
  if (!teacherEmail) {
    alert("You must be logged in to assign a task.");
    return;
  }

  try {
    await db.collection("todos").add({
      task: taskDescription,
      assignedBy: teacherEmail,
      student: studentEmail,
      dueDate,
      completed: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("Task assigned successfully!");
    displayAssignedTasks(); // Refresh task list
  } catch (error) {
    console.error("Error assigning task:", error);
    alert("Failed to assign task. Please try again.");
  }
}

// Display tasks assigned by the teacher
async function displayAssignedTasks() {
  const teacherEmail = auth.currentUser?.email;
  const assignedTasksDiv = document.getElementById("assigned-tasks");
  assignedTasksDiv.innerHTML = "<h4>Tasks Assigned</h4>";

  try {
    const querySnapshot = await db.collection("todos")
      .where("assignedBy", "==", teacherEmail)
      .get();

    if (querySnapshot.empty) {
      assignedTasksDiv.innerHTML += "<p>No tasks assigned yet.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const div = document.createElement("div");
      div.className = "task-item";
      div.innerHTML = `
        <p><strong>Task:</strong> ${task.task}</p>
        <p><strong>Student:</strong> ${task.student}</p>
        <p><strong>Due Date:</strong> ${task.dueDate}</p>
        <p><strong>Completed:</strong> ${task.completed ? "Yes" : "No"}</p>
      `;
      assignedTasksDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    alert("Failed to fetch assigned tasks. Please try again.");
  }
}

// Filter tasks by student email
async function filterTasks() {
  const studentEmail = document.getElementById("filter-tasks").value.trim();
  const filteredTasksDiv = document.getElementById("filtered-tasks");
  filteredTasksDiv.innerHTML = "";

  if (!studentEmail) {
    alert("Please enter a student email to filter.");
    return;
  }

  try {
    const querySnapshot = await db.collection("todos")
      .where("student", "==", studentEmail)
      .get();

    if (querySnapshot.empty) {
      filteredTasksDiv.innerHTML = "<p>No tasks found for this student.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const div = document.createElement("div");
      div.className = "filtered-task-item";
      div.innerHTML = `
        <p><strong>Task:</strong> ${task.task}</p>
        <p><strong>Due Date:</strong> ${task.dueDate}</p>
        <p><strong>Completed:</strong> ${task.completed ? "Yes" : "No"}</p>
      `;
      filteredTasksDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error filtering tasks:", error);
  }
}


// Notify teacher of completed tasks
function setupCompletionNotifications() {
  const teacherEmail = auth.currentUser.email; // Authenticated teacher's email

  db.collection('todos')
      .where('assignedBy', '==', teacherEmail)
      .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
              if (change.type === 'modified') {
                  const task = change.doc.data();
                  if (task.completed) {
                      alert(`Task Completed: "${task.task}" by ${task.student}`);
                  }
              }
          });
      });
}

// Initialize tasks and notifications
auth.onAuthStateChanged((user) => {
  if (user) {
      displayAssignedTasks();
      setupCompletionNotifications();
  } else {
      window.location.href = "../../signin/signin.html"; // Redirect if not authenticated
  }
});

// Assign a grade
async function assignGrade() {
  const studentEmail = document.getElementById("grade-student-email").value.trim();
  const classroomCode = document.getElementById("grade-classroom").value.trim();
  const assignment = document.getElementById("grade-assignment").value.trim();
  const grade = document.getElementById("grade").value.trim();

  if (!studentEmail || !classroomCode || !assignment || !grade) {
    alert("Please fill out all fields before assigning a grade.");
    return;
  }

  const teacherEmail = auth.currentUser?.email;
  if (!teacherEmail) {
    alert("You must be logged in to assign a grade.");
    return;
  }

  try {
    await db.collection("grades").add({
      student: studentEmail,
      classroom: classroomCode,
      assignment,
      grade,
      gradedBy: teacherEmail,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("Grade assigned successfully!");
    displayGradebook(); // Refresh gradebook
  } catch (error) {
    console.error("Error assigning grade:", error);
    alert("Failed to assign grade. Please try again.");
  }
}

// Display grades assigned by the teacher
async function displayGradebook() {
  const teacherEmail = auth.currentUser?.email;
  const gradebookDiv = document.getElementById("gradebook");
  gradebookDiv.innerHTML = "<h4>Grades Assigned</h4>";

  try {
    const querySnapshot = await db.collection("grades")
      .where("gradedBy", "==", teacherEmail)
      .get();

    if (querySnapshot.empty) {
      gradebookDiv.innerHTML += "<p>No grades assigned yet.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const grade = doc.data();
      const div = document.createElement("div");
      div.className = "grade-item";
      div.innerHTML = `
        <p><strong>Student:</strong> ${grade.student}</p>
        <p><strong>Classroom:</strong> ${grade.classroom}</p>
        <p><strong>Assignment:</strong> ${grade.assignment}</p>
        <p><strong>Grade:</strong> ${grade.grade}</p>
        <button onclick="editGrade('${doc.id}', '${grade.grade}')">Edit</button>
        <button onclick="deleteGrade('${doc.id}')">Delete</button>
      `;
      gradebookDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching gradebook:", error);
    alert("Failed to fetch the gradebook. Please try again.");
  }
}

// Filter grades by classroom code
async function filterGrades() {
  const classroomCode = document.getElementById("filter-grades").value.trim();
  const filteredGradesDiv = document.getElementById("filtered-grades");
  filteredGradesDiv.innerHTML = "";

  if (!classroomCode) {
    alert("Please enter a classroom code to filter.");
    return;
  }

  try {
    const querySnapshot = await db.collection("grades")
      .where("classroom", "==", classroomCode)
      .get();

    if (querySnapshot.empty) {
      filteredGradesDiv.innerHTML = "<p>No grades found for this classroom.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const grade = doc.data();
      const div = document.createElement("div");
      div.className = "filtered-grade-item";
      div.innerHTML = `
        <p><strong>Student:</strong> ${grade.student}</p>
        <p><strong>Assignment:</strong> ${grade.assignment}</p>
        <p><strong>Grade:</strong> ${grade.grade}</p>
      `;
      filteredGradesDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error filtering grades:", error);
  }
}

// Edit a grade
async function editGrade(gradeId, currentGrade) {
  const newGrade = prompt("Enter the new grade:", currentGrade);
  if (!newGrade) {
    alert("Grade update canceled.");
    return;
  }

  try {
    await db.collection("grades").doc(gradeId).update({ grade: newGrade });
    alert("Grade updated successfully!");
    displayGradebook();
  } catch (error) {
    console.error("Error updating grade:", error);
  }
}

// Delete a grade
async function deleteGrade(gradeId) {
  if (!confirm("Are you sure you want to delete this grade?")) return;

  try {
    await db.collection("grades").doc(gradeId).delete();
    alert("Grade deleted successfully!");
    displayGradebook();
  } catch (error) {
    console.error("Error deleting grade:", error);
  }
}
