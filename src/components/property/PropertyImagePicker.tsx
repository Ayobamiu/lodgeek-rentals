import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const PropertyImagePicker = ({
  handleImage,
}: {
  handleImage: (val: any) => void;
}) => {
  const hiddenFileInput = React.useRef<any>(null);
  const handleClick = (event: any) => {
    hiddenFileInput?.current?.click();
  };
  const handleChange = (event: any) => {
    // const fileUploaded = event.target.files[0];
    handleImage(event);
  };

  return (
    <div className="h-[100px] w-[100px]">
      <div
        role="button"
        className="border border-gray-300 rounded-md flex flex-row items-center justify-center w-full h-full"
        onClick={handleClick}
      >
        <FaPlusCircle className="text-3xl text-gray-400" />
      </div>
      <p className="text-center text-xs text-gray-600 font-medium">Add Image</p>
      <input
        type="file"
        multiple
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>
  );
};

export default PropertyImagePicker;
