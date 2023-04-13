import styled from "styled-components";
import { MdHelpCenter } from "react-icons/md";

const SupportFab = ({ onClick }: { onClick: () => void }) => {
  return (
    <FAB
      className="fixed bottom-2 right-10 flex flex-row items-center justify-center animate-bounce"

      onClick={onClick}
    >
      <MdHelpCenter className="text-white text-4xl" />
    </FAB>
  );
};

export default SupportFab;

const FAB = styled.button`
  background-color: #16a349;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  z-index: 1000;
`;
