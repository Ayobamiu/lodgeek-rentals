import { message, Modal, ModalFuncProps } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addReminder,
  addReminders,
  deleteReminder,
  selectReminder,
} from "../app/features/reminderSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createReminder,
  deleteReminderFromDatabase,
  getRemindersForCompany,
  getRemindersForRentalRecord,
} from "../firebase/apis/reminder";
import { Reminder } from "../models";

const useReminders = () => {
  const { reminders } = useAppSelector(selectReminder);
  const dispatch = useAppDispatch();
  const [addingReminder, setAddingReminder] = useState(false);
  let { companyId, rentalRecordId } = useParams();

  useEffect(() => {
    if (!reminders.length) {
      loadCompanyReminders();
    }
  }, [companyId as string]);

  useEffect(() => {
    if (rentalRecordId) {
      loadRentalRecordReminders(rentalRecordId);
    }
  }, [rentalRecordId as string]);

  const loadCompanyReminders = async () => {
    if (companyId as string) {
      const remindersList = await getRemindersForCompany(companyId as string);
      dispatch(addReminders(remindersList));
    }
  };
  const loadRentalRecordReminders = async (id: string) => {
    const remindersList = await getRemindersForRentalRecord(id);
    dispatch(addReminders(remindersList));
  };

  const addReminderToDatabaseAndStore = async (reminder: Reminder) => {
    setAddingReminder(true);
    await createReminder(reminder)
      .then(() => {
        dispatch(addReminder(reminder));
      })
      .finally(() => {
        setAddingReminder(false);
      });
  };

  const deleteReminderFromDatabaseAndStore = async (id: string) => {
    const config: ModalFuncProps = {
      title: "Delete Reminder!",
      content: "All data about this reminder will be lost.",
      okButtonProps: { className: "bg-blue-500", type: "primary" },
      onOk: async () => {
        await deleteReminderFromDatabase(id).then(() => {
          dispatch(deleteReminder(id));
          message.success("Reminder record deleted");
        });
      },
    };
    Modal.confirm(config);
  };

  return {
    addReminderToDatabaseAndStore,
    addingReminder,
    deleteReminderFromDatabaseAndStore,
  };
};
export default useReminders;
