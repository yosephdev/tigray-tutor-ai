import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';

interface TigrayTutorInput {
  lessonUpload?: File;
  userMessage: string;
  voiceInput: string;
  actionType: 'translate' | 'tutor' | 'analyze_pdf';
}

interface TigrayTutorOutput {
  response: string;
  translation: string;
  exercises: string[];
  progress: { 
    subject: string; 
    completed: number; 
    total: number; 
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function handleTigrayTutorAction(data: TigrayTutorInput): Promise<TigrayTutorOutput> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{
        role: "user" as const,
        content: data.actionType === 'translate' 
          ? `Translate this text: "${data.userMessage}" to Tigrinya.` 
          : `Provide tutoring assistance on the following message: "${data.userMessage}".`
      }],
      tools: [],
      tool_choice: "auto",
    });

    const responseContent = response.choices[0].message.content ?? "";
    const exercises: string[] = [];
    const translation = data.actionType === 'translate' ? responseContent : "";
    
    return {
      response: responseContent,
      translation,
      exercises,
      progress: { subject: "Language", completed: 5, total: 10 },
    };
  } catch (error) {
    console.error("Error in handleTigrayTutorAction:", error);
    throw error;
  }
}

async function handlePDFUpload(file: File) {
  // Implement PDF processing logic
}

export async function POST(req: Request) {
  try {
    const data: TigrayTutorInput = await req.json();
    const tutorResult = await handleTigrayTutorAction(data);
    return NextResponse.json(tutorResult, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to process the request.",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}