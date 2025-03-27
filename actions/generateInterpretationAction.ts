"use server";

import { z } from "zod";
import { TarotCard, TarotInterpretation } from "@/utils/types";
import { geminiModel } from "@/utils/gemini";
import { uploadTarotReadingToFirestore } from "@/lib/firestore/uploadTarotReadingToFS";
import { redirect } from "next/navigation";

const formSchema = z.object({
  focusArea: z.enum([
    "Relationship",
    "Career",
    "Personal Growth",
    "Health",
    "Spirituality",
  ]),
  question: z.string().min(5),
  spreadType: z.enum([
    "Quick Guidance",
    "3 Cards Spread",
    "Celtic Cross Spread",
  ]),
});

type TarotReadingInput = z.infer<typeof formSchema> & {
  cards: TarotCard[];
};

const MAX_RETRIES = 3;

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = 500
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function submitTarotReading(data: TarotReadingInput) {
  const { focusArea, question, spreadType, cards } = data;
  const validatedData = formSchema.parse({ focusArea, question, spreadType });
  const readingId = crypto.randomUUID();

  try {
    const prompt = generatePrompt(
      cards,
      validatedData.focusArea,
      validatedData.question,
      validatedData.spreadType
    );

    // Generate interpretation with retry logic
    const interpretationPromise = retryOperation(async () => {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const trimedText = text.replace(/```json|```/g, "").trim();
      return JSON.parse(trimedText) as TarotInterpretation;
    });

    // Get interpretation and upload to Firestore in parallel
    const interpretation = await interpretationPromise;
    await Promise.all([
      Promise.resolve(interpretation), // if you need the interpretation result in parallel
      uploadTarotReadingToFirestore({
        id: readingId,
        summary: interpretation.summary,
        focusPoints: interpretation.focusPoints,
        detailedInterpretation: interpretation.detailedInterpretation,
        additionalInsights: interpretation.additionalInsights,
      }),
    ]);
  } catch (error) {
    console.error("Error generating tarot reading:", error);
    throw new Error("Failed to generate tarot reading");
  }
  redirect(`/reading-results?id=${readingId}`);
}

function generatePrompt(
  cards: TarotCard[],
  focusArea: string,
  question: string,
  spreadType: string
): string {
  const cardDescriptions = cards
    .map((card: TarotCard, index: number) => {
      return `Card ${index + 1}: ${card.name} (${card.orientation}) - ${
        card.meaning
      }`;
    })
    .join("\n");

  let spreadPurpose = "";
  if (spreadType === "Quick Guidance") {
    spreadPurpose =
      "This is a One-Card Spread for quick guidance on the focus area.";
  } else if (spreadType === "3 Cards Spread") {
    spreadPurpose =
      "This is a Three-Card Spread representing past, present, and future insights.";
  } else if (spreadType === "Celtic Cross Spread") {
    spreadPurpose =
      "This is a Celtic Cross Spread, providing a detailed overview of the current situation.";
  }

  return `You are an expert in tarot reading. You have deep knowledge concerning with Tarot. Answer the same Language as the question. Please generate a JSON-formatted personalized tarot interpretation based on the following details:
Focus Area: "${focusArea}"
Question: "${question}"
Spread Purpose: "${spreadPurpose}"

Cards Drawn:
${cardDescriptions}

The interpretation should follow this structure, with spread-specific guidelines applied to both the "summary" and "detailedInterpretation" fields. In the detailedInterpretation, clearly state each card's role (e.g., "Present," "Challenge," etc.) based on the spread type.

One-Card Spread:

Summary: Provide a brief overview of the reading as a whole.
DetailedInterpretation: Include the card's role as "Primary Insight" and interpret its core message and relevance to the querent's question.

Three-Card Spread:

Summary: Interpret the past, present, and future aspects relevant to the reading.
DetailedInterpretation: Label each card's interpretation by its position:
Past: Describe past influences relevant to the querent's question.
Present: Explain the current state or energies around the focus area.
Future: Outline potential future developments related to the focus area.

Celtic-Cross Spread:

Summary: Summarize the reading as a Celtic Cross spread, giving an overview of the querent’s journey and key influences.
DetailedInterpretation: Label each card's interpretation according to its Celtic Cross position:
Present Situation (Card 1 - Significator): Reflects the querent's current situation or mindset.
The Challenge (Card 2 - Crossing): Describes an obstacle or challenge in the querent’s path, such as past patterns or doubts.
Foundation (Card 3 - Beneath): Shows underlying beliefs or past experiences shaping the current situation.
Recent Past (Card 4 - Behind): Highlights recent events or influences.
Potential (Card 5 - Above): Indicates possible outcomes if the current path continues.
Near Future (Card 6 - Before): Suggests upcoming events or shifts.
Your Feelings (Card 7): Reflects internal feelings, fears, or expectations.
External Influences (Card 8): Shows outside factors impacting the querent’s journey.
Hopes and Fears (Card 9): Highlights aspirations and anxieties.
Outcome (Card 10): Indicates the long-term outlook or potential resolution.
JSON Structure:
{
  "summary": "A summary based on the spread type (see above for instructions)",
  "focusPoints": ["Key focus points relevant to the question and spread purpose"],
  "detailedInterpretation": [
    {
      "name": "Card Name",
      "orientation": "upright or reversed",
      "meaning": "Concise meaning of the card",
      "position": "Role of the card in the spread (e.g., Present Situation, Challenge, Past, etc.)",
      "details": "Detailed interpretation of this card according to its specific role in the spread type"
    }
  ],
  "additionalInsights": "Any extra relevant insights or advice"
}
`;
}
