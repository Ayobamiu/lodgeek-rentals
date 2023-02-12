import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

/**
 * Upload Photo to Firebase Storage, and return the Firebase DownloadUrl
 * @param filePath
 * @param file
 */
export async function UploadPhotoAsync(filePath: string, file: Blob) {
  return new Promise(
    async (
      resolve: (value?: string) => void,
      reject: (reason?: any) => void
    ) => {
      const storageRef = ref(storage, filePath);
      uploadBytes(storageRef, file).then((snapshot) => {
        const ref = snapshot!.ref;
        getDownloadURL(ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  );
}
