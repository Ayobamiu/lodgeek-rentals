import { Avatar, Button, List } from "antd";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";
import { updateNotificationInDatabase } from "../../firebase/apis/notification";
import { NotificationMessage } from "../../models";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useAppDispatch } from "../../app/hooks";
import { updateNotificationMessage } from "../../app/features/notificationMessage";

type Props = {
  item: NotificationMessage;
};

export function NotificationItem(props: Props) {
  const { item } = props;
  const status = item.status;
  const dispatch = useAppDispatch();
  const [sending, setSending] = useState(false);

  const markNotificationOnOpen = async () => {
    const updatedNotification: NotificationMessage = {
      ...item,
      status: "read",
    };
    await updateNotificationInDatabase(updatedNotification).then(() => {
      dispatch(updateNotificationMessage(updatedNotification));
    });
  };

  const markNotification = async () => {
    setSending(true);
    await markNotificationOnOpen().finally(() => {
      setSending(false);
    });
  };

  return (
    <List.Item
      extra={
        <Button
          type="text"
          title={status === "read" ? "Read" : "Mark as read"}
          icon={
            <CheckCircleTwoTone
              twoToneColor={status === "read" ? "#52c41a" : "grey"}
            />
          }
          disabled={status === "read" || sending}
          onClick={markNotification}
          loading={sending}
        />
      }
    >
      <List.Item.Meta
        avatar={item.icon ? <Avatar src={item.icon} /> : null}
        title={
          <Link onClick={markNotificationOnOpen} to={item.link || ""}>
            {item.title}
          </Link>
        }
        description={item.description}
      />
      <small>{moment(item.timestamp).fromNow()}</small>
    </List.Item>
  );
}
