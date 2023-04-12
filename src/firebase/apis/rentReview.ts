import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  RentReview,
  FirebaseCollections,
  RentReviewResponse,
} from "../../models";
import { rentReviewRef, db } from "../config";

export async function getUserRentReviews(email: string) {
  const q = query(
    rentReviewRef,
    (where("primaryOwner", "==", email), where("team", "array-contains", email))
  );
  let rentReviewList: RentReview[] = [];

  await getDocs(q).then((rentReviewSnapshot) => {
    rentReviewList = rentReviewSnapshot.docs.map((doc) =>
      doc.data()
    ) as RentReview[];
  });

  return rentReviewList;
}
export async function getRentReviewsForRentalRecord(id: string) {
  const q = query(rentReviewRef, where("rentalRecord", "==", id));
  let rentReviewList: RentReview[] = [];

  await getDocs(q).then((rentReviewSnapshot) => {
    rentReviewList = rentReviewSnapshot.docs.map((doc) =>
      doc.data()
    ) as RentReview[];
  });

  return rentReviewList;
}

export async function createRentReview(rentReview: RentReview) {
  return await setDoc(doc(rentReviewRef, rentReview.id), rentReview);
}

export async function getRentReview(id: string) {
  const docRef = doc(rentReviewRef, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as RentReview;
}

export const updateRentReviewInDatabase = async (rentReview: RentReview) => {
  const docRef = doc(db, FirebaseCollections.rentReview, rentReview.id);
  return await updateDoc(docRef, rentReview);
};
export const addResponseToRentReview = async (
  id: string,
  response: RentReviewResponse
) => {
  const docRef = doc(rentReviewRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data() as RentReview;
  const responses: RentReviewResponse[] = [...(data.responses || []), response];
  return await updateDoc(docRef, { ...doc, responses });
};
