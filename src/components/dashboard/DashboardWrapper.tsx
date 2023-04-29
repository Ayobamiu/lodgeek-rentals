import React from "react";
import useAppRedirects from "../../hooks/useAppRedirects";
import useClient from "../../hooks/useClient";
import useInvoice from "../../hooks/useInvoice";
import usePayments from "../../hooks/usePayments";
import useProperties from "../../hooks/useProperties";
import useReminders from "../../hooks/useReminders";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSideBar } from "./DashboardSideBar";

const DashboardWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  useAppRedirects();
  useClient();
  useInvoice();
  usePayments();
  useProperties();
  useReminders();
  return (
    <div>
      <DashboardNavbar />
      <DashboardSideBar />
      <div className={`p-4 sm:ml-64 pt-16 ${className}`}>{children}</div>
    </div>
  );
};

export default DashboardWrapper;
