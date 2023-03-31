import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseCollections, User } from "../../models";
import { db } from "../config";

export const updateUserInDatabase = async (updatedUser: User) => {
  const userRef = doc(db, FirebaseCollections.users, updatedUser.email);
  return await updateDoc(userRef, updatedUser);
};
