import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RentReview } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { initialRentReview } from "../initialValues";
import { RootState } from "../store";

interface RentReviewState {
  rentReviews: RentReview[];
  currentRentReview: RentReview;
}

const initialState: RentReviewState = {
  rentReviews: [],
  currentRentReview: initialRentReview,
};
export const propertySlice = createSlice({
  name: "rentReview",
  initialState,
  reducers: {
    deleteRentReview: (state, action: PayloadAction<RentReview>) => {
      const currentReviewRentReviews = [...state.rentReviews];
      const rentReviewIndex = currentReviewRentReviews.findIndex(
        (i) => i.id === action.payload.id
      );
      currentReviewRentReviews.splice(rentReviewIndex, 1);
      state.rentReviews = currentReviewRentReviews;
    },
    updateRentReview: (state, action: PayloadAction<RentReview>) => {
      const currentReviewRentReviews = [...state.rentReviews];
      const rentReviewIndex = currentReviewRentReviews.findIndex(
        (i) => i.id === action.payload.id
      );
      currentReviewRentReviews.splice(rentReviewIndex, 1, action.payload);
      state.rentReviews = currentReviewRentReviews;
    },
    updateCurrentRentReview: (
      state,
      action: PayloadAction<Partial<RentReview>>
    ) => {
      state.currentRentReview = {
        ...state.currentRentReview,
        ...action.payload,
      };
    },
    setCurrentRentReview: (state, action: PayloadAction<RentReview>) => {
      state.currentRentReview = action.payload;
    },
    resetCurrentRentReview: (state) => {
      state.currentRentReview = initialRentReview;
    },
    addRentReview: (state, action: PayloadAction<RentReview>) => {
      const currentReviewRentReviews = [...state.rentReviews];
      currentReviewRentReviews.push(action.payload);
      state.rentReviews = filterUniqueByKey(currentReviewRentReviews, "id");
    },
    setRentReviews: (state, action: PayloadAction<RentReview[]>) => {
      state.rentReviews = action.payload;
    },
  },
});

export const {
  addRentReview,
  updateRentReview,
  deleteRentReview,
  setRentReviews,
  setCurrentRentReview,
  updateCurrentRentReview,
  resetCurrentRentReview,
} = propertySlice.actions;

export const selectRentReview = (state: RootState) => state.rentReview;

export default propertySlice.reducer;
