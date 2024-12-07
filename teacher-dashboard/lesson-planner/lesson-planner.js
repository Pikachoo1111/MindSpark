function generateContent() {
    //get all information from html lesson plannign form
    lessonName = document.getElementById("lesson-name").value;
    lessonObjective = document.getElementById("lesson-objective").value;
    lessonDuration = document.getElementById("lesson-duration").value;
    lessonGrade = document.getElementById("lesson-grade").value;

    inputPrompt = "Generate a lesson called " + lessonName + " for grade " + lessonGrade + " that lasts " + lessonDuration + " minutes. The objective of the lesson is to " + lessonObjective + ". Please generate nothing except for the lesson itself, no header or footer text at all. just start with the lesson title and continue with the content ";
    console.log(fetchOpenAIResponseSync(inputPrompt));
}

function fetchOpenAIResponseSync(prompt) {
    console.log("Fetching OpenAI API synchronously...");
    const apiKey = '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'; // Replace with your API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: "gpt-3.5-turbo", // Change this to your desired model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2800, // Adjust based on your needs
        temperature: 0.7 // Adjust for more creative or deterministic responses
    };

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl, false); // Third parameter 'false' makes it synchronous

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${apiKey}`);

        xhr.send(JSON.stringify(requestBody));

        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            return data.choices[0].message.content;
        } else {
            throw new Error(`API request failed: ${xhr.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching OpenAI API:", error);
        return null;
    }
}