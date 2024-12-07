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
        const response = await fetchOpenAIResponse(inputPrompt);
        if (response) {
            console.log("Generated Lesson Content:", response);
            alert("Lesson content generated successfully. Check the console for details.");
        } else {
            alert("Failed to generate lesson content.");
        }
    } catch (error) {
        console.error("Error generating lesson content:", error);
        alert("An error occurred while generating lesson content. Please try again later.");
    }
}

async function fetchOpenAIResponse(prompt) {
    const apiKey = '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'; // Replace with your actual OpenAI API key
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
