import { useAppSelector } from "../../app/hooks";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { selectReminder } from "../../app/features/reminderSlice";
import { Reminder } from "../../models";
import moment from "moment";
import { useParams } from "react-router-dom";
const RentalRecordReminder = () => {
  const { reminders } = useAppSelector(selectReminder);
  let { rentalRecordId } = useParams();

  const relatedreminders = reminders.filter(
    (i) => i.rentalRecordId === (rentalRecordId as string)
  );
  function sortReminders(reminders: Reminder[]) {
    reminders.sort((a, b) => {
      if (a.sent && !b.sent) {
        return 1;
      }
      if (!a.sent && b.sent) {
        return -1;
      }
      if (a.reminderDate < b.reminderDate) {
        return -1;
      }
      if (a.reminderDate > b.reminderDate) {
        return 1;
      }
      return 0;
    });
    return reminders;
  }

  const sortedReminders = sortReminders([...relatedreminders]);

  const columns: ColumnsType<Reminder> = [
    {
      title: "Rent",
      dataIndex: "name",
      key: "name",
      render: (_text, record) => (
        <div>
          <Tag>{record.type} reminder on</Tag>
          <br />
          <a>Rent for {moment(record.dueDate).format("ll")}</a>
        </div>
      ),
    },
    {
      title: "Reminder at",
      dataIndex: "reminderDate",
      key: "reminderDate",
      render: (reminderDate) => <Tag>{moment(reminderDate).format("ll")}</Tag>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <a>{type} reminder</a>,
    },

    {
      title: "Status",
      key: "sent",
      dataIndex: "sent",
      render: (_, { sent }) => (
        <>
          <Tag color={sent ? "green" : "default"}>
            {sent ? "Sent" : "Upcoming"}
          </Tag>
        </>
      ),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={sortedReminders} />
    </div>
  );
};

export default RentalRecordReminder;
