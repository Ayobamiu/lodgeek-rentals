import { useState } from "react";
import { ToastContainer } from "react-toastify";
import SupportChannelModal from "../homepage/SupportChannelModal";
import ReduceRentModal from "../rental/ReduceRentModal";
import SupportFab from "../shared/button/SupportFab";
import NotificationModal from "../shared/NotificationModal";
/**
 * Add all modals that are used App-wide here
 */
const AllAppWideModals = () => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <ToastContainer />
      <SupportFab onClick={() => setModal(!modal)} />
      <SupportChannelModal open={modal} onCancel={() => setModal(false)} />
      <NotificationModal />
      <ReduceRentModal />
    </>
  );
};

export default AllAppWideModals;
