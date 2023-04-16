import { FaTrash } from "react-icons/fa";

const SinglePropertyImage = ({
  img,
  deleteImage,
}: {
  img: any;
  deleteImage: () => void;
}) => {
  console.log(img, "Image");

  return (
    <div className="border-green-200 border mr-5 rounded w-[300px] h-[300px] flex flex-row items-center justify-center relative">
      <button onClick={deleteImage} className="absolute top-5 right-5">
        <FaTrash className="text-xl text-red-400" />
      </button>
      <img
        src={URL.createObjectURL(img)}
        alt="property"
        className="block w-[90%] h-[90%] rounded-md object-contain"
      />
    </div>
  );
};

export default SinglePropertyImage;
