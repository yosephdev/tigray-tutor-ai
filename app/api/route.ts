import { NextResponse } from "next/server";
import OpenAI from "openai";

// Define the structure of the incoming request for TigrayTutor
interface TigrayTutorInput {
  lessonUpload: File; // File upload for lesson materials
  userMessage: string; // User's message for AI processing
  voiceInput: string; // User's voice input
  actionType: 'translate' | 'tutor'; // Action type indicating the intended operation
}

// Define the structure of the output response
interface TigrayTutorOutput {
  response: string; // AI generated response for tutoring
  translation: string; // Translation result if actionType is 'translate'
  exercises: Array<string>; // List of exercises if actionType is 'tutor'
  progress: { subject: string; completed: number; total: number; }; // Progress indicator
}

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to call OpenAI API for tutoring and translation based on user input
async function handleTigrayTutorAction(data: TigrayTutorInput): Promise<TigrayTutorOutput> {
  console.log("Handling TigrayTutor action with data:", JSON.stringify(data));

  try {
    // Prepare messages for OpenAI API based on actionType
    const messages = [
      {
        role: "user",
        content: data.actionType === 'translate' 
          ? `Translate this text: "${data.userMessage}" to Tigrinya.` 
          : `Provide tutoring assistance on the following message: "${data.userMessage}".`,
      },
    ];

    // Call the OpenAI API with the appropriate model and messages
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the specified model
      messages: messages,
      tools: [], // Specify any tools if needed, currently empty
      tool_choice: "auto", // Let OpenAI choose tool if needed
    });

    console.log("OpenAI API response:", JSON.stringify(response));

    // Extract information from the API response
    const responseContent = response.choices[0].message.content; // Expected AI response content
    const exercises = []; // Mock exercises, in a real scenario this would come from AI response
    const translation = data.actionType === 'translate' ? responseContent : ""; // Set translation if applicable

    // Mock progress for demonstration; in a real scenario, this could be dynamically calculated
    const progress = { subject: "Language", completed: 5, total: 10 };

    // Construct the final output object
    const output: TigrayTutorOutput = {
      response: responseContent,
      translation: translation,
      exercises: exercises,
      progress: progress,
    };

    return output;
  } catch (error) {
    console.error("Error in handleTigrayTutorAction:", error);
    throw error; // Re-throw error to handle it in the main function
  }
}

// Main POST function to handle incoming requests
export async function POST(req: Request) {
  console.log("Received POST request");

  try {
    // Parse the incoming JSON request
    const data: TigrayTutorInput = await req.json();
    console.log("Parsed request data:", JSON.stringify(data));

    // Call OpenAI API to process user input
    const tutorResult = await handleTigrayTutorAction(data);

    console.log("Tutor action completed successfully");

    // Return the response with appropriate status code
    return NextResponse.json(tutorResult, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    // Handle errors and return a structured error response
    return NextResponse.json(
      {
        error: "Failed to process the request.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}