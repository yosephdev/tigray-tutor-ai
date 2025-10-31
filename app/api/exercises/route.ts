import { NextResponse } from "next/server";
import { getAdminAuth } from '@/lib/firebase-admin';
import { aiClient } from '@/lib/ai-client';
import { chatService } from '@/lib/chat-service';
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
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No auth header found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Verifying token...');
    
    const adminAuth = getAdminAuth();
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
    
    // Save user message to Realtime Database
    await chatService.saveMessage(userId, {
      content: validatedData.userMessage,
      isUser: true,
      timestamp: new Date().getTime(),
      type: validatedData.imageData ? 'image' : 'text',
      imageUrl: validatedData.imageData
    });

    // Save AI response to Realtime Database
    await chatService.saveMessage(userId, {
      content: response,
      isUser: false,
      timestamp: new Date().getTime(),
      type: 'text',
    });
    
    return NextResponse.json({
      response,
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

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const messages = await chatService.getMessages(userId);
    return NextResponse.json(messages);

  } catch (error: any) {
    console.error("API Error Details:", error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
