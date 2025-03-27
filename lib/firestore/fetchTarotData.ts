import { adminDb } from "@/utils/firebaseAdmin";
import { Card } from "@/utils/types";

export async function fetchTarotData(): Promise<Card[]> {
  const snapshot = await adminDb.collection("tarotDeck").get();
  const tarotData = snapshot.docs.map((doc) => ({
    ...doc.data(),
  }));

  return tarotData as Card[];
}
