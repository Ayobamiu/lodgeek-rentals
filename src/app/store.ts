import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import propertyReducer from "./features/propertySlice";
import rentalRecordReducer from "./features/rentalRecordSlice";
import rentReducer from "./features/rentSlice";
import rentReviewReducer from "./features/rentReviewSlice";
import bankRecordReducer from "./features/bankRecordSlice";
import notificationReducer from "./features/notificationSlice";
import companyReducer from "./features/companySlice";
import companyUserReducer from "./features/companyUserSlice";
import invoiceReducer from "./features/invoiceSlice";
import paymentReducer from "./features/paymentSlice";

export const store = configureStore({
  reducer: {
    property: propertyReducer,
    user: userReducer,
    rentalRecord: rentalRecordReducer,
    rent: rentReducer,
    rentReview: rentReviewReducer,
    bankRecord: bankRecordReducer,
    notification: notificationReducer,
    company: companyReducer,
    companyUser: companyUserReducer,
    invoice: invoiceReducer,
    payment: paymentReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
