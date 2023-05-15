import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationMessage } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface NotificationMessageState {
  notificationMessages: NotificationMessage[];
}

const initialState: NotificationMessageState = {
  notificationMessages: [],
};

export const notificationMessageSlice = createSlice({
  name: "notificationMessage",
  initialState,
  reducers: {
    updateNotificationMessage: (
      state,
      action: PayloadAction<NotificationMessage>
    ) => {
      const currentNotificationMessages = [...state.notificationMessages];
      const notificationMessageIndex = currentNotificationMessages.findIndex(
        (i) => i.id === action.payload.id
      );
      currentNotificationMessages.splice(
        notificationMessageIndex,
        1,
        action.payload
      );
      state.notificationMessages = currentNotificationMessages;
    },
    deleteNotificationMessage: (state, action: PayloadAction<string>) => {
      const currentNotificationMessages = [...state.notificationMessages];
      const notificationMessageIndex = currentNotificationMessages.findIndex(
        (i) => i.id === action.payload
      );
      currentNotificationMessages.splice(notificationMessageIndex, 1);
      state.notificationMessages = currentNotificationMessages;
    },
    addNotificationMessage: (
      state,
      action: PayloadAction<NotificationMessage>
    ) => {
      const currentNotificationMessages = [...state.notificationMessages];
      const exists = currentNotificationMessages.findIndex(
        (i) => i.id === action.payload.id
      );
      // if (!exists) {
      currentNotificationMessages.unshift(action.payload);
      state.notificationMessages = filterUniqueByKey(
        currentNotificationMessages,
        "id"
      );
      // }
    },
    addNotificationMessages: (
      state,
      action: PayloadAction<NotificationMessage[]>
    ) => {
      const currentNotificationMessages = [
        ...action.payload,
        ...state.notificationMessages,
      ];
      state.notificationMessages = filterUniqueByKey(
        currentNotificationMessages,
        "id"
      );
    },
    setNotificationMessages: (
      state,
      action: PayloadAction<NotificationMessage[]>
    ) => {
      state.notificationMessages = action.payload;
    },
  },
});

export const {
  addNotificationMessage,
  setNotificationMessages,
  updateNotificationMessage,
  deleteNotificationMessage,
  addNotificationMessages,
} = notificationMessageSlice.actions;

export const selectNotificationMessage = (state: RootState) =>
  state.notificationMessage;

export default notificationMessageSlice.reducer;
