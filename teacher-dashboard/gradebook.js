import { auth, db } from "../firebase";

// Assign a grade to a student
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
        console.log("Assigning grade:", {
            student: studentEmail,
            classroom: classroomCode,
            assignment,
            grade,
            gradedBy: teacherEmail,
        });

        await db.collection("grades").add({
            student: studentEmail,
            classroom: classroomCode,
            assignment,
            grade,
            gradedBy: teacherEmail,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert("Grade assigned successfully!");
        displayGrades();
    } catch (error) {
        console.error("Error assigning grade:", error);
        alert("Failed to assign grade. Please try again.");
    }
}

// Display all grades assigned by the teacher
async function displayGrades() {
    const teacherEmail = auth.currentUser?.email;
    const gradesDiv = document.getElementById("grades");
    gradesDiv.innerHTML = "<h3>Assigned Grades</h3>";

    if (!teacherEmail) {
        alert("You must be logged in to view grades.");
        return;
    }

    try {
        const querySnapshot = await db.collection("grades")
            .where("gradedBy", "==", teacherEmail)
            .get();

        if (querySnapshot.empty) {
            gradesDiv.innerHTML += "<p>No grades assigned yet.</p>";
            return;
        }

        querySnapshot.forEach(doc => {
            const grade = doc.data();
            const div = document.createElement("div");
            div.className = "grade-item";
            div.innerHTML = `
                <p><strong>Student:</strong> ${grade.student}</p>
                <p><strong>Classroom:</strong> ${grade.classroom}</p>
                <p><strong>Assignment:</strong> ${grade.assignment}</p>
                <p><strong>Grade:</strong> ${grade.grade}</p>
            `;
            gradesDiv.appendChild(div);
        });

        console.log("Grades displayed successfully.");
    } catch (error) {
        console.error("Error fetching grades:", error);
        alert("Failed to fetch grades. Please try again.");
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

        console.log("Filtered grades displayed successfully.");
    } catch (error) {
        console.error("Error filtering grades:", error);
    }
}

// Initialize gradebook on page load
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Teacher authenticated:", user.email);
        displayGrades();
    } else {
        console.log("No teacher authenticated. Redirecting to sign-in.");
        window.location.href = "../../signin/signin.html";
    }
});
