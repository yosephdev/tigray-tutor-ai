import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Replace with actual DeepSeek API URL
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function generateExercises(content: string, difficulty: string) {
    const prompt = `Create 5 multiple choice questions about: ${content}
      Format: JSON array of objects with properties:
      - question
      - options (array of 4 choices)
      - correct_answer
      - explanation
      Difficulty level: ${difficulty}`;
  
    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-chat', // Replace with the appropriate model
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = response.data as { choices: { message: { content: string } }[] };
        return JSON.parse(data.choices[0].message.content || '[]');
    } catch (error) {
        console.error("Error generating exercises:", error);
        throw error;
    }
}