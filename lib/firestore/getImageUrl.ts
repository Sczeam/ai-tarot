import { storage } from "@/utils/firebase";
import { getDownloadURL, ref } from "firebase/storage";

export async function getImageUrl(name: string) {
  try {
    const imageRef = ref(storage, `tarot_images/${name}.webp`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error(`Error fetching image for ${name}:`, error);
    return null;
  }
}
