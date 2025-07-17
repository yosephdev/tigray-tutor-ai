import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "GOOGLE_GEMINI_API_KEY not found in environment variables",
        hasKey: false 
      });
    }

    console.log('Testing Gemini API with key:', apiKey.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-pro'];
    const results: any = {};
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello in Tigrinya and English');
        const response = await result.response;
        const text = response.text();
        
        results[modelName] = {
          success: true,
          response: text.substring(0, 200) + '...',
          error: null
        };
        
        // If first model works, return success
        return NextResponse.json({ 
          success: true, 
          response: text,
          hasKey: true,
          keyPreview: apiKey.substring(0, 10) + '...',
          modelUsed: modelName,
          allResults: results
        });
        
      } catch (error: any) {
        console.error(`Model ${modelName} failed:`, error.message);
        results[modelName] = {
          success: false,
          response: null,
          error: error.message,
          status: error.status
        };
      }
    }
    
    // If all models failed
    return NextResponse.json({ 
      error: "All models failed",
      hasKey: true,
      keyPreview: apiKey.substring(0, 10) + '...',
      allResults: results
    }, { status: 503 });
    
  } catch (error: any) {
    console.error('Gemini API Test Error:', error);
    return NextResponse.json({ 
      error: error.message,
      code: error.code,
      status: error.status,
      hasKey: !!process.env.GOOGLE_GEMINI_API_KEY
    });
  }
}
