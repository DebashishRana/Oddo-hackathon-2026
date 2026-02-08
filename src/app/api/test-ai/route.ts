import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createChatCompletion } from '@/lib/openrouter';

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Simple test message
    const testMessages = [
      {
        role: 'user' as const,
        content: 'Hello! Please respond with "AI integration is working correctly!" to confirm the connection.'
      }
    ];

    // Call OpenRouter API
    const completion = await createChatCompletion(testMessages, {
      temperature: 0.1,
      max_tokens: 50,
    });

    // Return the response
    return NextResponse.json({
      success: true,
      message: completion.choices[0]?.message?.content,
      model: completion.model,
      usage: completion.usage,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI Test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
