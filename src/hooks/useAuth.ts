import { useCallback, useEffect, useState } from "react";
import { auth, db, USER_PATH } from "../firebase/config";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Company, FirebaseCollections, User } from "../models";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addUser as addUserToStore,
  selectUsers,
  setLoadingLoggedInUser,
  updateUser,
} from "../app/features/userSlice";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  selectSelectedCompany,
  setSelectedCompany,
  updateCompany,
} from "../app/features/companySlice";

const useAuth = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const usersRef = collection(db, FirebaseCollections.users);
  const [currentUser, setCurrentUser] = useState<any>();
  const users = useAppSelector(selectUsers);
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const dispatch = useAppDispatch();
  const getLoggedInUser = useCallback(
    async (email: string) => {
      const docRef = doc(db, FirebaseCollections.users, email);
      const docSnap = await getDoc(docRef);
      const user = docSnap.data() as User;
      dispatch(updateUser(user));
    },
    [dispatch]
  );

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email) {
          dispatch(setLoadingLoggedInUser(true));
          getLoggedInUser(user.email).finally(() => {
            dispatch(setLoadingLoggedInUser(false));
          });
        }
      } else {
        setCurrentUser(undefined);
        dispatch(updateUser(undefined));
      }
    });
    return () => {
      observer();
    };
  }, [dispatch, getLoggedInUser]);

  const addUser = async (data: User) => {
    await setDoc(doc(usersRef, data.email), data)
      .then(() => {
        return data;
      })
      .catch(() => {
        return null;
      });
  };

  const handleSignInUser = (email: string, password: string) => {
    setSigningIn(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Signed in
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      })
      .finally(() => {
        setSigningIn(false);
      });
  };

  const handleSignUpUser = (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => {
    setSigningUp(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        // Signed in

        const userData: User = {
          firstName,
          lastName,
          email,
          phone,
          createdDate: Date.now(),
          lastUpdated: Date.now(),
          balance: 0,
        };

        await addUser(userData);

        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ..
      })
      .finally(() => {
        setSigningUp(false);
      });
  };

  const handleSignOutUser = () => {
    // if (window.confirm(text) == true) {
    setSigningOut(true);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        dispatch(updateUser(undefined));
      })
      .catch(() => {
        // An error happened.
      })
      .finally(() => {
        setSigningOut(false);
      });
    // }
  };

  const getUserData = async (email: string): Promise<User | undefined> => {
    let user = users.find((i) => i.email === email);

    if (!user) {
      const docRef = doc(db, USER_PATH, email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        user = docSnap.data() as User;

        dispatch(addUserToStore(user));
      }
    }

    return user;
  };

  const updateDefaultRemittanceAccount = async (id: string) => {
    const selectedCompanyRef = doc(
      db,
      FirebaseCollections.companies,
      selectedCompany?.id || ""
    );
    const docSnap = await getDoc(selectedCompanyRef);
    if (docSnap.exists()) {
      const selectedCompanyDoc = docSnap.data() as Company;
      const updatedCompany: Company = {
        ...selectedCompanyDoc,
        remittanceAccount: id,
      };
      await updateDoc(selectedCompanyRef, updatedCompany)
        .then(() => {
          dispatch(updateCompany(updatedCompany));
          dispatch(setSelectedCompany(updatedCompany));
        })
        .finally(() => {});
    }
  };

  return {
    signingIn,
    signingUp,
    handleSignInUser,
    handleSignUpUser,
    currentUser,
    handleSignOutUser,
    signingOut,
    getUserData,
    updateDefaultRemittanceAccount,
  };
};
export default useAuth;
