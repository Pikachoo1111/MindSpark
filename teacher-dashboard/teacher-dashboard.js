// Create a classroom
const createClassroomButton = document.getElementById("create-classroom-button");
createClassroomButton.addEventListener("click", async () => {
    createClassroom();
  });
document.addEventListener("DOMContentLoaded", function() {displayClassrooms()});

async function createClassroom() {
    const name = prompt("Enter classroom name:");
    if (!name) {
        alert("Please enter a classroom name.");
        return;
    }

    const studentsInput = prompt("Enter student emails separated by commas (optional):");
    const students = studentsInput
        ? studentsInput.split(",").map(email => email.trim()).filter(email => email)
        : [];

    const teacherEmail = auth.currentUser?.email;

    try {
        const classroomCode = Math.random().toString(36).slice(2).slice(0, 6);
        console.log("Creating classroom:", { name, code: classroomCode, teacher: teacherEmail, students });

        await db.collection("classrooms").add({
            name,
            code: classroomCode,
            teacher: teacherEmail,
            students,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        alert(`Classroom "${name}" created successfully! Code: ${classroomCode}`);
        displayClassrooms();
    } catch (error) {
        console.error("Error creating classroom:", error);
        alert("Failed to create classroom. Please try again.");
    }
}

// Display classrooms
async function displayClassrooms() {
    const teacherEmail = auth.currentUser?.email;
    if (!teacherEmail) {
        displayClassrooms();
    }

    const classroomsDiv = document.getElementById("classrooms");
    classroomsDiv.innerHTML = "<h3>Your Classrooms</h3>";

    try {
        const querySnapshot = await db.collection("classrooms").where("teacher", "==", teacherEmail).get();

        if (querySnapshot.empty) {
            classroomsDiv.innerHTML += "<p>No classrooms created yet.</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const classroom = doc.data();
            const div = document.createElement("div");
            div.textContent = `${classroom.name} (Code: ${classroom.code}) - Students: ${classroom.students.length}`;
            classroomsDiv.appendChild(div);

            updateStudentSelect(classroom.students); // Update student dropdown
        });
    } catch (error) {
        console.error("Error fetching classrooms:", error);
    }
}

// Update the student dropdown for assigning tasks
function updateStudentSelect(students) {
    const studentSelect = document.getElementById("student-select");
    studentSelect.innerHTML = ""; // Clear existing options

    students.forEach(studentEmail => {
        const option = document.createElement("option");
        option.value = studentEmail;
        option.textContent = studentEmail;
        studentSelect.appendChild(option);
    });
}

// Add a to-do for a specific student
async function addStudentTodo() {
    const studentEmail = document.getElementById("student-select").value;
    const todo = document.getElementById("new-todo").value.trim();

    if (!studentEmail || !todo) {
        alert("Please select a student and enter a task.");
        return;
    }

    const teacherEmail = auth.currentUser?.email;
    if (!teacherEmail) {
        alert("You must be logged in to assign tasks.");
        return;
    }

    try {
        await db.collection("todos").add({
            task: todo,
            assignedBy: teacherEmail,
            student: studentEmail,
            completed: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert("Task added successfully!");
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task. Please try again.");
    }
}

// Assign a task
async function assignTask() {
    const studentEmail = document.getElementById("student-email").value.trim();
    const taskDescription = document.getElementById("task").value.trim();
    const dueDate = document.getElementById("due-date").value;

    if (!studentEmail || !taskDescription || !dueDate) {
        alert("Please fill out all fields before assigning a task.");
        return;
    }

    const teacherEmail = auth.currentUser?.email;
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
    } catch (error) {
        console.error("Error assigning task:", error);
        alert("Failed to assign task. Please try again.");
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
        const querySnapshot = await db.collection("todos").where("student", "==", studentEmail).get();

        if (querySnapshot.empty) {
            filteredTasksDiv.innerHTML = "<p>No tasks found for this student.</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const task = doc.data();
            const div = document.createElement("div");
            div.className = "filtered-task-item";
            div.innerHTML = `
                <p><strong>Task:</strong> ${task.task}</p>
                <p><strong>Due Date:</strong> ${task.dueDate}</p>
                <p><strong>Completed:</strong> ${task.completed ? "Yes" : "No"}</p>
                <hr>
            `;
            filteredTasksDiv.appendChild(div);
        });
    } catch (error) {
        console.error("Error filtering tasks:", error);
    }
}

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
    } catch (error) {
        console.error("Error assigning grade:", error);
        alert("Failed to assign grade. Please try again.");
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
        const querySnapshot = await db.collection("grades").where("classroom", "==", classroomCode).get();

        if (querySnapshot.empty) {
            filteredGradesDiv.innerHTML = "<p>No grades found for this classroom.</p>";
            return;
        }

        querySnapshot.forEach(doc => {
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

// Initialize dashboard on page load
auth.onAuthStateChanged(user => {
    if (user) {
        displayClassrooms();
    } else {
        window.location.href = "../../signin/signin.html";
    }
});
