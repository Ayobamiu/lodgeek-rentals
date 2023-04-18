import React from "react";
import useAppRedirects from "../../hooks/useAppRedirects";
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
  return (
    <div>
      <DashboardNavbar />
      <DashboardSideBar />
      <div className={`p-4 sm:ml-64 pt-16 ${className}`}>{children}</div>
    </div>
  );
};

export default DashboardWrapper;
