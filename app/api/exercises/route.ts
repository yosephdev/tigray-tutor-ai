import { NextResponse } from "next/server";
import { auth } from '@/lib/firebase';
import { aiClient } from '@/lib/ai-client';
import { dbService } from '@/lib/database';

export async function POST(req: Request) {
  try {
    const { content, difficulty } = await req.json();
    
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const exercises = await aiClient.generateExercises(content, difficulty);
    
    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Exercise generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate exercises" },
      { status: 500 }
    );
  }
}