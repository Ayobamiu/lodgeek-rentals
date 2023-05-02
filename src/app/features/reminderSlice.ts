import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reminder } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface ReminderState {
  reminders: Reminder[];
}

const initialState: ReminderState = {
  reminders: [],
};
export const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    deleteReminder: (state, action: PayloadAction<string>) => {
      const currentReminders = [...state.reminders];
      const reminderIndex = currentReminders.findIndex(
        (i) => i.id === action.payload
      );
      currentReminders.splice(reminderIndex, 1);
      state.reminders = currentReminders;
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const currentReminders = [...state.reminders];
      const reminderIndex = currentReminders.findIndex(
        (i) => i.id === action.payload.id
      );
      currentReminders.splice(reminderIndex, 1, action.payload);
      state.reminders = currentReminders;
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      const currentReminders = [...state.reminders];
      currentReminders.push(action.payload);
      state.reminders = filterUniqueByKey(currentReminders, "id");
    },
    addReminders: (state, action: PayloadAction<Reminder[]>) => {
      const currentReminders = [...state.reminders, ...action.payload];
      state.reminders = filterUniqueByKey(currentReminders, "id");
    },
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = filterUniqueByKey(action.payload, "id");
    },
  },
});

export const {
  addReminder,
  deleteReminder,
  setReminders,
  updateReminder,
  addReminders,
} = reminderSlice.actions;

export const selectReminder = (state: RootState) => state.reminder;

export default reminderSlice.reducer;
