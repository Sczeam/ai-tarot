import { adminDb } from "@/utils/firebaseAdmin";
import { TarotInterpretation } from "@/utils/types";

export async function getReadingById(id: string) {
  const readingRef = await adminDb.collection("tarotReadings").doc(id);
  const readingDoc = await readingRef.get();
  const data = readingDoc.data();

  return data as TarotInterpretation;
}
