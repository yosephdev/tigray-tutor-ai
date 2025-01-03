import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
});

async function handleTigrayTutorAction(data: TigrayTutorInput): Promise<TigrayTutorOutput> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: data.actionType === 'translate' 
          ? `Translate this text: "${data.userMessage}" to Tigrinya.` 
          : `Provide tutoring assistance on the following message: "${data.userMessage}".`
      }],
      temperature: 0.7,
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
    // Check rate limit
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: data.actionType === 'translate' 
          ? `Translate this text: "${data.userMessage}" to Tigrinya.` 
          : `Provide tutoring assistance on the following message: "${data.userMessage}".`
      }],
      temperature: 0.7,
    });

    return NextResponse.json(response.choices[0].message);

  } catch (error: any) {
    if (error?.response?.status === 429) {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}