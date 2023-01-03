import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import propertyReducer from "./features/propertySlice";
import rentalRecordReducer from "./features/rentalRecordSlice";
import rentReducer from "./features/rentSlice";

export const store = configureStore({
  reducer: {
    property: propertyReducer,
    user: userReducer,
    rentalRecord: rentalRecordReducer,
    rent: rentReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
