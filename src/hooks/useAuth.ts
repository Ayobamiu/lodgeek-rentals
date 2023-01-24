import { useCallback, useEffect, useState } from "react";
import { auth, db, USER_PATH } from "../firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../models";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addUser as addUserToStore,
  selectUsers,
  updateUser,
} from "../app/features/userSlice";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const useAuth = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const usersRef = collection(db, "users");
  const [currentUser, setCurrentUser] = useState<any>();
  const users = useAppSelector(selectUsers);

  const dispatch = useAppDispatch();
  const getLoggedInUser = useCallback(
    async (email: string) => {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      const user = docSnap.data() as User;
      console.log({ user });

      dispatch(updateUser(user));
    },
    [dispatch]
  );

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email) {
          getLoggedInUser(user.email);
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
      .then((c) => {
        return data;
      })
      .catch((error) => {
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
    lastName: string
  ) => {
    setSigningUp(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        // Signed in

        const userData = {
          firstName,
          lastName,
          email,
          createdDate: Date.now(),
          lastUpdated: Date.now(),
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
    let text = "Are you sure to Log out?";
    if (window.confirm(text) == true) {
      setSigningOut(true);
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          dispatch(updateUser(undefined));
        })
        .catch((error) => {
          // An error happened.
        })
        .finally(() => {
          setSigningOut(false);
        });
    }
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

  return {
    signingIn,
    signingUp,
    handleSignInUser,
    handleSignUpUser,
    currentUser,
    handleSignOutUser,
    signingOut,
    getUserData,
  };
};
export default useAuth;
