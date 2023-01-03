import React from "react";
import ActivityIndicator from "./ActivityIndicator";

export default function DetailsBox({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | number | any;
  loading?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-coolGray-500 ">{label}</p>
      <h3 className="mb-1 font-medium text-lg text-coolGray-900 flex">
        {loading ? <ActivityIndicator color="black" /> : value || "--"}
      </h3>
    </div>
  );
}
