import {
  closeNotification,
  selectNotification,
} from "../../app/features/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const NotificationModal = () => {
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(closeNotification());
  };
  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    }
    if (isEscape) {
      closeModal();
    }
  };
  if (!notification.visible) return null;
  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-black bg-opacity-80 z-50 ">
      <span
        className="absolute right-5 text-white top-5 cursor-pointer"
        onClick={closeModal}
      >
        close
      </span>
      <div className="lg:max-w-[50vw] min-w-[30%] max-w-[90%] lg:max-h-[50vh] max-h-[70%] bg-white rounded-2xl p-10 text-center flex flex-col justify-center items-center gap-5">
        <h1 className="text-xl font-bold">{notification.title}</h1>
        <p>{notification.description}</p>
        <div className="flex flex-wrap justify-center gap-5">
          {notification.buttons?.map((button) => {
            if (button.type && button.type === "link") {
              return (
                <a
                  href={button.link}
                  target="_blank"
                  className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
                >
                  {button.text}
                </a>
              );
            } else {
              return (
                <button
                  onClick={() => {
                    button.onClick && button.onClick();
                    closeModal();
                  }}
                  className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
                >
                  {button.text}
                </button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
