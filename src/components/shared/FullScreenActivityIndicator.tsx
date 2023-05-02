import { Spin } from "antd";
export default function FullScreenActivityIndicator() {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center bg-black opacity-80 z-50">
      <Spin size="large" />
    </div>
  );
}
