import admin = require("firebase-admin");
import { FirebaseCollections, Payout } from "../../models";
import { withdrawPayOutToRemittanceAccount } from "./withdrawFunds";

export const db = admin.firestore();

export const processPayouts = async () => {
  const unPaidPayoutsQuerySnapshot = await db
    .collection(FirebaseCollections.payout)
    .where("status", "!=", "success")
    .get();

  unPaidPayoutsQuerySnapshot.forEach(async (snapDoc) => {
    const payout = snapDoc.data() as Payout;
    withdrawPayOutToRemittanceAccount(payout);
  });
};
