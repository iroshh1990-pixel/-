
import { GoogleGenAI, Type } from "@google/genai";
import { GameType, GameQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuestions(type: GameType): Promise<GameQuestion[]> {
  const prompt = `Generate 5 interactive questions for first-grade children (age 6-7) in Hebrew for a game about phonological awareness. 
  Type of challenge: ${type}.
  - SYLLABLES: Ask how many syllables (הברות) are in a word. 
  - INITIAL_SOUND: Ask what is the starting sound (צליל פותח) of a word.
  - RHYMES: Provide a word and ask which of the options rhymes (מתחרז) with it.
  Use simple everyday Hebrew words.
  Return only valid JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            word: { type: Type.STRING },
            instruction: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
          },
          required: ["id", "type", "word", "instruction", "options", "correctAnswer"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data.map((q: any) => ({
      ...q,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(q.word)}/400/300`
    }));
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
