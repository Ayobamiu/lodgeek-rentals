import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface UserState {
  user?: User;
  users: User[];
}

const initialState: UserState = {
  user: undefined,
  users: [],
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
  },
});

export const { updateUser, addUser, setUsers } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUsers = (state: RootState) => state.user.users;

export default userSlice.reducer;
