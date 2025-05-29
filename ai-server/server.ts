import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface AiImageResponse {
  mimeType: string;
  base64: string;
}

app.post("/api/ai-image", async (req, res) => {
  try {
    const { prompt }: { prompt: string } = req.body || {};

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const config = {
      responseModalities: ["IMAGE", "TEXT"],
      responseMimeType: "text/plain",
    };

    const model = "gemini-2.0-flash-preview-image-generation";
    const contents = [
      {
        role: "user",
        parts: [
          {
            data: "",
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
        res.json({
          mimeType: inlineData.mimeType,
          base64: inlineData.data,
        } as AiImageResponse);
        return;
      }
    }

    res.status(500).json({ error: "No image data returned" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
    return;
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
