"use server";
import { geminiModel } from "@/utils/gemini";

export async function getCardInterpretation(
  focusArea: string,
  question: string,
  cardName: string,
  orientation: string,
  position: string,
  spreadType: string
) {
  try {
    const prompt = `
        You are a wise and insightful Tarot reader with centuries of experience. 
        Interpret the following Tarot card in a specific spread position:
  
        Focus Area: ${focusArea}
        Question: ${question}
        Card: ${cardName}
        orientation: ${orientation}
        Position: ${position}
        Spread Type: ${spreadType}
  
        Provide a 2-3 sentence interpretation that is:
        - Answer the same Language as the question.
        - Mystical yet practical
        - Insightful and specific to the position
        - be honest, be truthful
        - Focused on ${focusArea}
        
        Your response should be poetic but clear, avoiding clichés and overly dramatic language.
        Do not include any disclaimers or warnings.
      `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: unknown) {
    if (error instanceof Error)
      if (error.message?.includes("API key")) {
        throw new Error(
          "Invalid or missing API key. Please check your configuration."
        );
      }
    throw new Error(
      "Failed to generate interpretation. Please try again later."
    );
  }
}
