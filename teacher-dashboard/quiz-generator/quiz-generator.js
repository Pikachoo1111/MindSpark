const GOOGLE_API_KEY = "AIzaSyD_8BEHPanW5N2sqoxPHQNyK36fpFSPn-E";
const API_REQUEST_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`;

async function generateContent() {
    // Collect form inputc
    console.log("Generating quiz...");
    const quizName = document.getElementById("quiz-title").value.trim();
    const quizSpecifications = document.getElementById("quiz-specifications").value.trim();
    const quizQuestions = document.getElementById("num-questions").value.trim();
    const quizGrade = document.getElementById("quiz-grade").value;

    // Validate inputs
    if (!quizName || !quizSpecifications || !quizQuestions || !quizGrade) {
        alert("All fields are required. Please fill out the form completely.");
        return;
    }

    // Prepare Gemini prompt
    document.getElementById("returnContent").innerHTML = "Loading...";
    const inputPrompt = `Generate a quiz called "${quizName}" for grade ${quizGrade} that has ${quizQuestions} questions. The objective of the quiz is to ${quizSpecifications}. Please generate nothing except for the lesson itself, no header or footer text at all. Use absolutely no astreick in your answer, even to provide formatting I need this in plain text. This means no markdown, nothing. Do not provide an answer key at all. This is to be given to students`;
    const quiz = await generateGeminiResponse(inputPrompt);
    const moddedQuiz = quiz.replace(/\*\*/g, "");
    document.getElementById("returnContent").innerHTML = moddedQuiz;
    const answerKeyPrompt = `Write an answer key for the quiz ${moddedQuiz}.`
    const answerKeyOutput = await generateGeminiResponse(answerKeyPrompt);
    const moddedAnswerKeyOutput = answerKeyOutput.replace(/\*\*/g, "");
    document.getElementById("answerKey").innerHTML = moddedAnswerKeyOutput;
    // console.log(moddedOutput);
    
}
// Fetch quiz from Gemini
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

