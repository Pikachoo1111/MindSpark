import { auth, db } from '../firebase';

function createClassroom() {
  const name = prompt("Enter classroom name:");
  if (!name) {
    alert("Classroom name cannot be empty.");
    return;
  }

  const code = generateUniqueCode();
  const teacher = auth.currentUser.email; // Get current teacher email

  // Upload classroom data to Firestore
  uploadClassroom(teacher, name, code)
    .then(() => {
      alert(`Classroom "${name}" created successfully! Code: ${code}`);
      displayClassrooms();
    })
    .catch((error) => {
      console.error("Error creating classroom:", error);
    });
}

function displayClassrooms() {
  const teacher = auth.currentUser.email; // Authenticated teacher email
  const classroomsDiv = document.getElementById("classrooms");
  classroomsDiv.innerHTML = "<h3>Your Classrooms</h3>";

  db.collection("classrooms")
    .where("teacher", "==", teacher)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const classroom = doc.data();
        const div = document.createElement("div");
        div.textContent = `${classroom.name} (Code: ${classroom.code})`;
        classroomsDiv.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching classrooms:", error);
    });
}

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
async function assignTask() {
  const studentEmail = document.getElementById('student-email').value.trim();
  const taskDescription = document.getElementById('task').value.trim();
  const dueDate = document.getElementById('due-date').value;

  if (!studentEmail || !taskDescription || !dueDate) {
      alert("Please fill out all fields.");
      return;
  }

  const teacherEmail = auth.currentUser.email; // Authenticated teacher's email

  try {
      await db.collection('todos').add({
          task: taskDescription,
          assignedBy: teacherEmail,
          student: studentEmail,
          dueDate,
          completed: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      alert("Task assigned successfully!");
      displayAssignedTasks(); // Refresh the assigned tasks list
  } catch (error) {
      console.error("Error assigning task:", error);
  }
}

// Display tasks assigned by the teacher
async function displayAssignedTasks() {
  const teacherEmail = auth.currentUser.email; // Authenticated teacher's email
  const assignedTasksDiv = document.getElementById('assigned-tasks');
  assignedTasksDiv.innerHTML = "<h4>Tasks Assigned</h4>";

  try {
      const querySnapshot = await db.collection('todos')
          .where('assignedBy', '==', teacherEmail)
          .get();

      querySnapshot.forEach((doc) => {
          const task = doc.data();
          const div = document.createElement('div');
          div.className = "task-item";
          div.textContent = `${task.task} (Due: ${task.dueDate}, Assigned to: ${task.student}, Completed: ${task.completed ? "Yes" : "No"})`;
          assignedTasksDiv.appendChild(div);
      });
  } catch (error) {
      console.error("Error fetching assigned tasks:", error);
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
