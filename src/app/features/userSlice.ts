import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

const doc = localStorage.getItem("user");
let user: User | undefined = undefined;
if (doc) {
  const storedUser = JSON.parse(doc || "");
  if (storedUser) {
    user = storedUser as User;
  }
}
interface UserState {
  user?: User;
  users: User[];
  loadingloggedInUser: boolean;
}

const initialState: UserState = {
  user,
  users: [],
  loadingloggedInUser: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      const currentUsers = [...state.users];
      currentUsers.push(action.payload);
      state.users = filterUniqueByKey(currentUsers, "email");
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoadingLoggedInUser: (state, action: PayloadAction<boolean>) => {
      state.loadingloggedInUser = action.payload;
    },
  },
});

export const { updateUser, addUser, setUsers, setLoadingLoggedInUser } =
  userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUsers = (state: RootState) => state.user.users;
export const selectLoadingloggedInUser = (state: RootState) =>
  state.user.loadingloggedInUser;

export default userSlice.reducer;
