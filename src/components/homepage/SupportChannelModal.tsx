import { Modal } from "antd";
import { MdCancel } from "react-icons/md";
import { supportChannels } from "../../utils/prodData";
import SingleSupportChannel from "./SingleSupportChannel";
const SupportChannelModal = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => {
  return (
    <>
      <Modal
        title="Our Support Channels"
        centered
        open={open}
        footer={null}
        onCancel={onCancel}
        cancelText={null}
        closeIcon={<MdCancel className="text-gray-500 text-3xl" />}
      >
        <div className="w-full border-t border-t-gray-200 pt-5">
          {supportChannels.map((item, index) => (
            <SingleSupportChannel
              {...item}
              key={index}
              className="lg:w-[70%] w-full"
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default SupportChannelModal;
