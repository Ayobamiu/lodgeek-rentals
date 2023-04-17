import { faExpand, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { useState } from "react";
import {
  selectNewProperty,
  updateNewProperty,
} from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ImageCard } from "../../models";

const SinglePropertyImage = ({ img }: { img: ImageCard }) => {
  const newProperty = useAppSelector(selectNewProperty);
  const dispatch = useAppDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewOpen(false);

  const deleteImage = (img: ImageCard) => {
    let newImages = newProperty.images.filter((item) => item.id !== img.id);
    dispatch(updateNewProperty({ images: newImages }));
  };

  const handlePreview = async () => {
    setPreviewImage(img.url);
    setPreviewOpen(true);
    setPreviewTitle(img.name);
  };

  return (
    <>
      <div className="group border-green-200 border rounded w-[100px] h-[100px] flex flex-row items-center justify-center relative">
        <div className="absolute h-full w-full bg-black hidden bg-opacity-50 rounded group-hover:flex flex-row items-center justify-center gap-x-3">
          <FontAwesomeIcon
            onClick={() => deleteImage(img)}
            icon={faTrash}
            className="text-xl text-white cursor-pointer"
            size="sm"
          />

          <FontAwesomeIcon
            onClick={handlePreview}
            icon={faExpand}
            className="text-xl text-white cursor-pointer"
            size="sm"
          />
        </div>
        <img
          src={img.url}
          alt="property"
          className="block w-[90%] h-[90%] rounded-md object-contain"
        />
      </div>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt={previewTitle} className="w-full" src={previewImage} />
      </Modal>
    </>
  );
};

export default SinglePropertyImage;
