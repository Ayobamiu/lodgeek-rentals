import { FaHome, FaBath, FaBed, FaToilet } from "react-icons/fa";

type iconNameType = "home" | "bath" | "bed" | "toilet";

const SinglePropertyAmenities = ({
  iconName,
  text,
}: {
  iconName: iconNameType;
  text: string;
}) => {
  let Icon = null;

  if (iconName === "home") {
    Icon = <FaHome className="text-3xl text-gray-400" />;
  } else if (iconName === "bed") {
    Icon = <FaBed className="text-3xl text-gray-400" />;
  } else if (iconName === "toilet") {
    Icon = <FaToilet className="text-3xl text-gray-400" />;
  } else {
    Icon = <FaBath className="text-3xl text-gray-400" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mr-8">
      <div className="flex flex-row items-center justify-center border-2 border-gray-200 rounded-full w-[60px] h-[60px]">
        {Icon}
      </div>
      <span className="text-gray-500 font-medium sm:text-base text-xs text-center">
        {text}
      </span>
    </div>
  );
};

export default SinglePropertyAmenities;
