import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-flash-latest';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY not found in environment variables",
        hasKey: false 
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    console.log(`Testing Gemini API with key: ${apiKey.substring(0, 10)}...`);
    console.log(`Testing model: ${GEMINI_MODEL}`);
    
    try {
      const result = await model.generateContent("Hello");
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini API Test successful:', text);
      return NextResponse.json({ success: true, response: text });
      
    } catch (error: any) {
      console.error(`Model ${GEMINI_MODEL} failed:`, error);
      return NextResponse.json({ 
        error: `Model ${GEMINI_MODEL} failed.`,
        details: error.message,
        hasKey: true,
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Gemini API Test Error:', error);
    return NextResponse.json({ 
      error: "An unexpected error occurred during the Gemini API test.",
      details: error.message,
      hasKey: !!process.env.GEMINI_API_KEY
    }, { status: 500 });
  }
}
