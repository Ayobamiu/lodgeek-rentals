import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LodgeekNotification } from "../../models";
import { RootState } from "../store";

const initialState: LodgeekNotification & { visible: boolean } = {
  type: "default",
  description: "",
  title: "",
  visible: false,
  buttons: [],
};
export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<LodgeekNotification>) => {
      state.title = action.payload.title;
      state.visible = true;
      if (action.payload.description) {
        state.description = action.payload.description;
      }
      if (action.payload.type) {
        state.type = action.payload.type;
      }
      if (action.payload.buttons) {
        state.buttons = action.payload.buttons;
      }
    },
    closeNotification: (state) => {
      state.title = "";
      state.visible = false;
      state.type = "default";
      state.description = "";
      state.buttons = [];
    },
  },
});

export const { setNotification, closeNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification;

export default notificationSlice.reducer;
