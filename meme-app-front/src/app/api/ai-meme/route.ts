import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:8080',
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt }: { prompt: string } = await req.json();

    console.log(prompt);

    const result = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'a white siamese cat',
      size: '1024x1024',
    });
    console.log(result);

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}
