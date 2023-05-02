import {
  Button,
  Col,
  Divider,
  Drawer,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { CompanyUser, CompanyUserStatusColor } from "../../models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteCompanyUser,
  selectCompanyUser,
  setCurrentCompanyUser,
} from "../../app/features/companyUserSlice";
import { useState } from "react";
import AddClientModal from "./AddClientModal";

const ClientsTable = ({ dataSource }: { dataSource: CompanyUser[] }) => {
  const dispatch = useAppDispatch();
  const { currentCompanyUser } = useAppSelector(selectCompanyUser);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
  }

  const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );

  const columns: ColumnsType<CompanyUser> = [
    {
      title: "MEMBER NAME",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      responsive: ["md"],
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
      responsive: ["md"],
    },
    {
      title: "MOBILE",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a>{text}</a>,
      responsive: ["md"],
    },
    {
      title: "REGISTERED ON",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (_, { createdAt }) => (
        <div className="border-none" key={createdAt}>
          {moment(createdAt).format("ll")}
        </div>
      ),
    },

    {
      title: "ROLES",
      key: "roles",
      dataIndex: "roles",
      render: (_, { roles }) => (
        <>
          {roles.map((role) => {
            return (
              <Tag color="default" key={role}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "STATUS",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => {
        const statusColor = CompanyUserStatusColor[status];
        return (
          <Tag className="border-none" color={statusColor} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="link"
              onClick={() => {
                showDrawer();
                dispatch(setCurrentCompanyUser(record));
              }}
            >
              View
            </Button>
            <Button
              type="link"
              onClick={() => {
                dispatch(setCurrentCompanyUser(record));
                setIsModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => {
                dispatch(deleteCompanyUser(record));
                message.success("User deleted");
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ type: "primary", className: "bg-blue-500" }}
            >
              <Button type="link">Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <AddClientModal
        isModalOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
        }}
      />
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24 }}
        >
          User Profile
        </p>
        <p className="site-description-item-profile-p">Personal</p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Full Name"
              content={currentCompanyUser.name}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Account"
              content={currentCompanyUser.email}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="City"
              content={currentCompanyUser.address}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Country"
              content={currentCompanyUser.address}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Birthday"
              content={currentCompanyUser.dob}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Website"
              content={currentCompanyUser.website}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Message"
              content={currentCompanyUser.about}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Copany"
              content={currentCompanyUser.company}
            />
          </Col>
        </Row>

        <Divider />
        <p className="site-description-item-profile-p">Contacts</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content={currentCompanyUser.email} />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Phone Number"
              content={currentCompanyUser.phone}
            />
          </Col>
        </Row>
      </Drawer>
      <Table
        size="large"
        columns={columns}
        dataSource={dataSource}
        pagination={{ defaultPageSize: 5 }}
        scroll={{ x: "100%" }}
      />
    </>
  );
};

export default ClientsTable;
