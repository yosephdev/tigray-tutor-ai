import { NextResponse } from "next/server";
import { adminAuth } from '@/lib/firebase-admin';
import { aiClient } from '@/lib/ai-client';
import { dbService } from '@/lib/database';
import { z } from 'zod';

const inputSchema = z.object({
  userMessage: z.string().min(1).max(1000),
  actionType: z.enum(['translate', 'tutor', 'analyze_image']),
  imageData: z.string().optional(),
  voiceInput: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    console.log('API Route called');
    
    const data = await req.json();
    console.log('Request data:', data);
    
    const validatedData = inputSchema.parse(data);
    
    // Verify Firebase Auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No auth header found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Verifying token...');
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log('User authenticated:', userId);

    let response: string;
    
    if (validatedData.actionType === 'translate') {
      console.log('Processing translation request');
      response = await aiClient.translate(validatedData.userMessage, 'Tigrinya');
    } else if (validatedData.actionType === 'analyze_image' && validatedData.imageData) {
      console.log('Processing image analysis request');
      response = await aiClient.analyzeImage(validatedData.imageData, validatedData.userMessage);
    } else {
      console.log('Processing tutor request');
      response = await aiClient.generateResponse(validatedData.userMessage);
    }
    
    console.log('AI Response generated successfully');
    
    // Save interaction to Firestore (optional, can be disabled for testing)
    try {
      await dbService.saveUserProgress(userId, 'current_lesson', 50);
    } catch (dbError) {
      console.warn('Database save failed:', dbError);
      // Don't fail the request if DB save fails
    }
    
    return NextResponse.json({
      response,
      translation: validatedData.actionType === 'translate' ? response : undefined,
    });

  } catch (error: any) {
    console.error("API Error Details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
    }
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
    }
    
    if (error.code === 'app/invalid-credential') {
      return NextResponse.json({ error: "Authentication error" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Server error occurred", 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
