import { auth, db } from '../firebase';

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

function displayStudentTodoList() {
  const studentEmail = auth.currentUser.email;
  const todoList = document.getElementById("student-todo-list");
  todoList.innerHTML = "";

  db.collection("todos")
    .where("student", "==", studentEmail)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = task.description;
        todoList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching student todos: ", error);
    });
}

// Initialize the student's classroom display and to-do list when the dashboard loads
auth.onAuthStateChanged((user) => {
  if (user) {
    displayStudentClassrooms();
    displayStudentTodoList();
  } else {
    window.location.href = "../../signin/signin.html"; // Redirect to login if not authenticated
  }
});
// Fetch and display the to-do list for the logged-in student
// Fetch and display the to-do list for the logged-in student
async function displayToDoList() {
  const studentEmail = auth.currentUser.email; // Authenticated student's email
  const todoListDiv = document.getElementById('todo-list');
  todoListDiv.innerHTML = "";

  try {
      const querySnapshot = await db.collection('todos')
          .where('student', '==', studentEmail)
          .get();

      querySnapshot.forEach((doc) => {
          const task = doc.data();
          const taskId = doc.id;
          const div = document.createElement('div');
          div.className = "task-item";
          div.innerHTML = `
              <input type="checkbox" id="${taskId}" ${task.completed ? "checked" : ""} 
                  onchange="toggleTaskCompletion('${taskId}', this.checked)">
              <label for="${taskId}">${task.task} (Due: ${task.dueDate})</label>
          `;
          todoListDiv.appendChild(div);
      });
  } catch (error) {
      console.error("Error fetching to-do list:", error);
  }
}

// Toggle task completion
async function toggleTaskCompletion(taskId, isCompleted) {
  try {
      await db.collection('todos').doc(taskId).update({
          completed: isCompleted,
      });
      alert("Task updated successfully!");
  } catch (error) {
      console.error("Error updating task completion:", error);
  }
}

// Initialize the to-do list display
auth.onAuthStateChanged((user) => {
  if (user) {
      displayToDoList();
  } else {
      window.location.href = "../../signin/signin.html"; // Redirect if not authenticated
  }
});
