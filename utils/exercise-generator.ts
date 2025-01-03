import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateExercises(content: string, difficulty: string) {
    const prompt = `Create 5 multiple choice questions about: ${content}
      Format: JSON array of objects with properties:
      - question
      - options (array of 4 choices)
      - correct_answer
      - explanation
      Difficulty level: ${difficulty}`;
  
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
  
    return JSON.parse(response.choices[0].message.content || '[]');
  }