import {
  collection,
  FieldPath,
  getDocs,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { FirebaseCollections } from "../../models";
import { db } from "../config";

/**
 * Retrieve documents from Firestore using an in query. X ids/values are passed and
 * we must break them into groups of 10 since Firestore IN query is maxed at 10 per operation.
 * @param path The collection to look at
 * @param fieldPath The object property to compare
 * @param opStr Filter conditions in a Query.where() clause are specified using the strings '<', '<=', '==', '>=', '>', 'array-contains', 'array-contains-any' or 'in'.
 * @param values List of values to compare to the provided field
 * @returns A list of Firebase documents
 */
export const getDocumentsFromListOfIds = async (
  path: FirebaseCollections,
  fieldPath: string | FieldPath,
  opStr: WhereFilterOp,
  values: string[]
) => {
  let count = 0;
  let valuesForDocumentsToRetrieve: string[] = [];
  let documents: any[] = [];

  for (let i = 0; i < values.length; i++) {
    if (count < 10) {
      count++;
      valuesForDocumentsToRetrieve.push(values[i]);
    }

    // At max criteria size or the end of the friends list
    if (count === 9 || values.length === i + 1) {
      const dataCol = collection(db, path);

      const q = query(
        dataCol,
        where(fieldPath, opStr, valuesForDocumentsToRetrieve)
      );
      await getDocs(q).then((querySnapshot) => {
        const dataDocs = querySnapshot.docs.map((doc) => doc.data());

        documents = [...documents, ...dataDocs];
      });

      if (count === 9) {
        valuesForDocumentsToRetrieve = [];
      }

      count = 0;
    }
  }
  return documents;
};
