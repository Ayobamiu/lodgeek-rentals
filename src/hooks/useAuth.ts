import { useEffect, useState } from "react";
import { auth, db, USER_PATH } from "../firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../models";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addUser as addUserToStore,
  selectUser,
  selectUsers,
  updateUser,
} from "../app/features/userSlice";

const useAuth = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const usersRef = collection(db, "users");

  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [currentUser, setCurrentUser] = useState<any>();
  const loggedInUser = useAppSelector(selectUser);
  const users = useAppSelector(selectUsers);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const observer = auth.onAuthStateChanged((user) => {
      console.log({ user: user?.email });

      if (user) {
        if (user.email) {
          getLoggedInUser(user.email);
        }
      } else {
        setCurrentUser(undefined);
        setLoggedIn(false);
        dispatch(updateUser(undefined));
      }
    });
    return () => {
      observer();
    };
  }, []);

  const addUser = async (data: User) => {
    await setDoc(doc(usersRef, data.email), data)
      .then((c) => {
        return data;
      })
      .catch((error) => {
        return null;
      });
  };

  const getLoggedInUser = async (email: string) => {
    console.log({ email });

    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data() as User;
    console.log({ user });

    dispatch(updateUser(user));
  };

  const handleSignInUser = (email: string, password: string) => {
    setSigningIn(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
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

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userData = {
          firstName,
          lastName,
          email,
          createdDate: Date.now(),
          lastUpdated: Date.now(),
        };
        console.log({ userData });

        await addUser(userData);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ..
      })
      .finally(() => {
        setSigningUp(false);
      });
  };

  const handleSignOutUser = () => {
    setSigningOut(true);
    auth
      .signOut()
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
