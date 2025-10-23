import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/** Upload a local image URI to Firebase Storage and return its download URL. */
export async function uploadImageAsync(localUri: string, remotePath: string): Promise<string> {
  // fetch works in Expo for file:// and content:// URIs
  const res = await fetch(localUri);
  if (!res.ok) throw new Error(`Failed to read local file: ${localUri}`);
  const blob = await res.blob();

  const storageRef = ref(storage, remotePath);
  await uploadBytes(storageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return await getDownloadURL(storageRef);
}
