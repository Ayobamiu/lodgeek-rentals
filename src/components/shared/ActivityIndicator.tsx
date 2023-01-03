import React from "react";

export default function ActivityIndicator({ color }: { color?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 ${
        color ? `border-[${color}]` : "border-white"
      } ml-2`}
      viewBox="0 0 24 24"
    ></svg>
  );
}
