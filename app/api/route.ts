import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import OpenAI from "openai";

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
});

// Initialize OpenAI client with Deepseek configuration
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

async function handlePDFUpload(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Initialize PDF.js
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    // Load the PDF document
    const doc = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(' ');
      fullText += text + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
}

async function handleTigrayTutorAction(data: TigrayTutorInput): Promise<TigrayTutorOutput> {
  try {
    let content = data.userMessage;
    
    if (data.actionType === 'analyze_pdf' && data.lessonUpload) {
      const pdfText = await handlePDFUpload(data.lessonUpload);
      content = `Analyze this lesson content: "${pdfText}"`;
    }
    
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{
        role: "user",
        content: data.actionType === 'translate' 
          ? `Translate this text: "${content}" to Tigrinya.`
          : `Provide tutoring assistance on the following message: "${content}".`
      }],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content ?? "";
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

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data = await req.json();
    const result = await handleTigrayTutorAction(data);
    return NextResponse.json(result);

  } catch (error: any) {
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "DeepSeek API quota exceeded. Please try again later." },
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