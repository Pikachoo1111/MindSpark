async function generateContent() {
    // Collect form input
    const lessonName = document.getElementById("lesson-name").value.trim();
    const lessonObjective = document.getElementById("lesson-objective").value.trim();
    const lessonDuration = document.getElementById("lesson-duration").value.trim();
    const lessonGrade = document.getElementById("lesson-grade").value;

    // Validate inputs
    if (!lessonName || !lessonObjective || !lessonDuration || !lessonGrade) {
        alert("All fields are required. Please fill out the form completely.");
        return;
    }

    // Prepare OpenAI prompt
    const inputPrompt = `Generate a lesson called "${lessonName}" for grade ${lessonGrade} that lasts ${lessonDuration} minutes. The objective of the lesson is to ${lessonObjective}. Please generate nothing except for the lesson itself, no header or footer text at all. Just start with the lesson title and continue with the content.`;

    // Fetch lesson content from OpenAI
    try {
        const lessonContent = await fetchOpenAIResponse(inputPrompt);
        if (lessonContent) {
            console.log("Generated Lesson Content:", lessonContent);
            saveLessonToFirestore(lessonName, lessonObjective, lessonDuration, lessonGrade, lessonContent);
            alert("Lesson created and saved successfully!");
        } else {
            alert("Failed to generate lesson content.");
        }
    } catch (error) {
        console.error("Error generating lesson content:", error);
        alert("An error occurred while generating lesson content. Please try again later.");
    }
}

async function fetchOpenAIResponse(prompt) {
    const apiKey = 'your'; // Replace with your actual OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: "gpt-3.5-turbo", // Model selection
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2800, // Adjust based on your needs
        temperature: 0.7, // Creativity level
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        } else {
            console.error(`API Error: ${response.status} - ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Error connecting to OpenAI API:", error);
        return null;
    }
}

// Save lesson to Firestore
async function saveLessonToFirestore(name, objective, duration, grade, content) {
    const teacherEmail = auth.currentUser.email; // Get the current teacher's email

    try {
        await db.collection("lessons").add({
            teacher: teacherEmail,
            name,
            objective,
            duration,
            grade,
            content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        console.log("Lesson saved successfully!");
    } catch (error) {
        console.error("Error saving lesson to Firestore:", error);
    }
}

// Fetch and display lessons for the teacher
async function displayTeacherLessons() {
    const teacherEmail = auth.currentUser.email; // Get the current teacher's email
    const lessonsDiv = document.getElementById("saved-lessons");
    lessonsDiv.innerHTML = "<h3>My Lessons</h3>";

    try {
        const querySnapshot = await db.collection("lessons").where("teacher", "==", teacherEmail).get();
        querySnapshot.forEach((doc) => {
            const lesson = doc.data();
            const lessonDiv = document.createElement("div");
            lessonDiv.className = "lesson-card";
            lessonDiv.innerHTML = `
                <h4>${lesson.name}</h4>
                <p><strong>Grade:</strong> ${lesson.grade}</p>
                <p><strong>Duration:</strong> ${lesson.duration} minutes</p>
                <p><strong>Objective:</strong> ${lesson.objective}</p>
                <button onclick="viewLesson('${doc.id}')">View Lesson</button>
            `;
            lessonsDiv.appendChild(lessonDiv);
        });
    } catch (error) {
        console.error("Error fetching lessons:", error);
    }
}

// View a specific lesson
async function viewLesson(lessonId) {
    try {
        const lessonDoc = await db.collection("lessons").doc(lessonId).get();
        if (lessonDoc.exists) {
            const lesson = lessonDoc.data();
            alert(`Lesson Content:\n\n${lesson.content}`);
        } else {
            alert("Lesson not found.");
        }
    } catch (error) {
        console.error("Error viewing lesson:", error);
    }
}

// Initialize the lessons display when the page loads
auth.onAuthStateChanged((user) => {
    if (user) {
        displayTeacherLessons();
    } else {
        window.location.href = "../../signin/signin.html"; // Redirect to login if not authenticated
    }
});

