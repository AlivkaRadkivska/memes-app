import { AiImageResponse } from '@/server/types/publication';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request): Promise<
  | NextResponse<AiImageResponse>
  | NextResponse<{
      error: string;
    }>
> {
  try {
    const { prompt }: { prompt: string } = await req.json();

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
      responseMimeType: 'text/plain',
    };

    const model = 'gemini-2.0-flash-preview-image-generation';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            data: '',
            text: `Generate an image according to this description: ${prompt}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    for await (const chunk of response) {
      const part = chunk?.candidates?.[0]?.content?.parts?.[0];
      const inlineData = part?.inlineData;

      if (inlineData?.data && inlineData?.mimeType) {
        return NextResponse.json({
          mimeType: inlineData.mimeType,
          base64: inlineData.data,
        });
      }
    }

    return NextResponse.json(
      { error: 'No image data returned' },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}
