const GOOGLE_API_KEY = "AIzaSyD_8BEHPanW5N2sqoxPHQNyK36fpFSPn-E";
const API_REQUEST_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`;

async function generateContent() {
    // Collect form inputc
    console.log("Generating lesson content...");
    const lessonName = document.getElementById("lesson-name").value.trim();
    const lessonObjective = document.getElementById("lesson-objective").value.trim();
    const lessonDuration = document.getElementById("lesson-duration").value.trim();
    const lessonGrade = document.getElementById("lesson-grade").value;

    // Validate inputs
    if (!lessonName || !lessonObjective || !lessonDuration || !lessonGrade) {
        alert("All fields are required. Please fill out the form completely.");
        return;
    }

    // Prepare Gemini prompt
    document.getElementById("returnContent").innerHTML = "Loading...";
    const inputPrompt = `Generate a lesson called "${lessonName}" for grade ${lessonGrade} that lasts ${lessonDuration} minutes. The objective of the lesson is to ${lessonObjective}. Please generate nothing except for the lesson itself, no header or footer text at all. Use absolutely no astreick in your answer, even to provide formatting I need this in plain text. This means no markdown, nothing`;
    const output = await generateGeminiResponse(inputPrompt);
    const moddedOutput = output.replace(/\*\*/g, "");
    document.getElementById("returnContent").innerHTML = moddedOutput;
    console.log(moddedOutput);
    
}
// Fetch lesson content from Gemini
const generateGeminiResponse = async (prompt) => {
    // const prompt = "What is your favorite color?";
    let responseText = null;
    console.log("Fetching Gemini API response...");

    try {
        const response = await fetch(API_REQUEST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            }),
        });

        // Check if the response is OK (status 200–299)
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error.message || "API request failed.");
        }

        const responseData = await response.json();
        // Extract the response text from the API response
        responseText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) throw new Error("Invalid API response.");

        console.log("Success!");
        console.log(responseText);

    } catch (error) {
        console.error("Error fetching Gemini API response:", error.message);
        responseText = `Error: ${error.message}`;
    }
    console.log(typeof responseText)
    return responseText;
};

