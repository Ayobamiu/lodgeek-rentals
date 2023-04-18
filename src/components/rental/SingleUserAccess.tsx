import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FaChevronDown } from "react-icons/fa";
import {
  Menu,
  ControlledMenu,
  useClick,
  useMenuState,
  MenuHeader,
  MenuItem,
} from "@szhsin/react-menu";
import { DropdownWrapper } from "../styled";
import { useRef } from "react";

const SingleUserAccess = ({ email }: { email: string }) => {
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);
  return (
    <div className="w-full flex flex-row items-center justify-between border-b border-b-gray-200 pb-2 mb-4">
      <p className="text-xs sm:text-sm font-medium text-gray-500">{email}</p>
      <button type="button" ref={ref} {...anchorProps} className="block">
        <FaChevronDown className="text-xs text-gray-400" />
        <DropdownWrapper className="relative">
          <ControlledMenu
            {...menuState}
            anchorRef={ref}
            onClose={() => toggleMenu(false)}
            transition
            offsetY={10}
            align="end"
          >
            <MenuHeader className="text-sm">Select Access </MenuHeader>
            <MenuItem
              className="capitalize border-b border-b-gray-200"
              // onClick={() => setActiveMarket(item)}
            >
              <div>
                <h6 className="tex-left text-gray-600 font-semibold text-sm">
                  Can View
                </h6>
                <p className="text-xs text-gray-400">
                  The invitee can only view the records
                </p>
              </div>
            </MenuItem>
            <MenuItem
              className="capitalize border-b border-b-gray-200"
              // onClick={() => setActiveMarket(item)}
            >
              <div>
                <h6 className="tex-left text-gray-600 font-semibold text-sm">
                  Can Edit
                </h6>
                <p className="text-xs text-gray-400">
                  The invitee can only view the records
                </p>
              </div>
            </MenuItem>
          </ControlledMenu>
        </DropdownWrapper>
      </button>
    </div>
  );
};

export default SingleUserAccess;
