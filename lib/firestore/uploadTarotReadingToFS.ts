import { adminDb } from "@/utils/firebaseAdmin";
import { CardInterpretation } from "@/utils/types";

export async function uploadTarotReadingToFirestore(data: {
  id: string;
  summary: string;
  focusPoints: string[];
  detailedInterpretation: CardInterpretation[];
  additionalInsights: string;
}) {
  try {
    await adminDb.collection("tarotReadings").doc(data.id).set({
      summary: data.summary,
      focusPoints: data.focusPoints,
      detailedInterpretation: data.detailedInterpretation,
      additionalInsights: data.additionalInsights,
    });
    console.log(`Uploaded reading ${data.id} to Firestore`);
  } catch (error) {
    console.error("Error uploading tarot reading to Firestore:", error);
    throw error;
  }
}
