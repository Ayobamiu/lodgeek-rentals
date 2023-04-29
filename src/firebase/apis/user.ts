import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseCollections, User } from "../../models";
import { db, usersRef } from "../config";

export const updateUserInDatabase = async (updatedUser: User) => {
  const userRef = doc(db, FirebaseCollections.users, updatedUser.email);
  return await updateDoc(userRef, updatedUser);
};
export async function getUser(id: string) {
  const docRef = doc(usersRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as User;
}
