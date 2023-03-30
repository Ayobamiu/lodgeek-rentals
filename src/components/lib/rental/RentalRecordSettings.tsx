import { useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { ControlledMenu, MenuItem, useClick } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { DropdownWrapper } from "../../styled";

const RentalRecordSettings = ({ onClick }: { onClick: () => void }) => {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const anchorProps = useClick(isOpen, setOpen);
  return (
    <div>
      <button className="block ml-5" type="button" ref={ref} {...anchorProps}>
        <MdSettings className="text-3xl text-gray-500" />
      </button>
      <DropdownWrapper className="relative">
        <ControlledMenu
          state={isOpen ? "open" : "closed"}
          anchorRef={ref}
          onClose={() => setOpen(false)}
          direction="bottom"
          position="auto"
          transition
          offsetY={20}
          //   offsetX={100}
          align="end"
        >
          {/* <MenuHeader className="text-sm">Filter</MenuHeader> */}
          <MenuItem className="text-sm px-4">
            <div className="flex flex-row items-center">
              <p className="text-sm text-gray-500 font-medium">Edit</p>
            </div>
          </MenuItem>
          <MenuItem className="text-sm" onClick={onClick}>
            <div className="flex flex-row items-center">
              <p className="text-sm text-gray-500 font-medium">Share</p>
            </div>
          </MenuItem>
          <MenuItem className="text-sm">
            <div className="flex flex-row items-center">
              <p className="text-sm text-gray-500 font-medium">Delete</p>
            </div>
          </MenuItem>
        </ControlledMenu>
      </DropdownWrapper>
    </div>
  );
};

export default RentalRecordSettings;
