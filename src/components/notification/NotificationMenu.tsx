import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, Drawer, List } from "antd";
import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  addNotificationMessages,
  selectNotificationMessage,
  setNotificationMessages,
} from "../../app/features/notificationMessage";
import { selectUser } from "../../app/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUserNotifications } from "../../firebase/apis/notification";
import { notificationRef } from "../../firebase/config";
import { NotificationMessage } from "../../models";
import { sortNotificationsByTimestamp } from "../../utils/sort";
import { NotificationItem } from "./NotificationItem";

export const NotificationMenu = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { notificationMessages } = useAppSelector(selectNotificationMessage);
  const myEmail = loggedInUser?.email || "";

  const unreadNotifications = notificationMessages.filter(
    (i) => i.status !== "read"
  ).length;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const notifications_ = await getUserNotifications(myEmail).finally(() => {
        setLoading(false);
      });
      if (notifications_) {
        dispatch(setNotificationMessages(notifications_));
      }
    })();
  }, [loggedInUser]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const q = query(notificationRef, where("recipientId", "==", myEmail));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsList: NotificationMessage[] = [];

      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const notification = change.doc.data() as NotificationMessage;
          notificationsList.push(notification);
        }
      });

      dispatch(addNotificationMessages(notificationsList));
    });

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, [myEmail]);

  const sortedNotifications = sortNotificationsByTimestamp([
    ...notificationMessages,
  ]);

  return (
    <>
      <Button
        type="default"
        className="border-none shadow-none"
        onClick={showDrawer}
      >
        <Badge count={unreadNotifications} overflowCount={20}>
          <BellOutlined className="text-lg" />
        </Badge>
      </Button>
      <Drawer
        title="Notifications"
        placement="right"
        onClose={onClose}
        open={open}
        extra={<small>{unreadNotifications} Unread</small>}
      >
        <List
          itemLayout="vertical"
          dataSource={sortedNotifications}
          renderItem={(item) => <NotificationItem item={item} />}
          loading={loading}
        />
      </Drawer>
    </>
  );
};
