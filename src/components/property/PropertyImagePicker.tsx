import React, { ChangeEvent, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import { ImageCard } from "../../models";
import { v4 as uuidv4 } from "uuid";
import {
  selectNewProperty,
  updateNewProperty,
} from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const PropertyImagePicker = () => {
  const newProperty = useAppSelector(selectNewProperty);
  const dispatch = useAppDispatch();

  const [uploading, setUploading] = useState(false);
  const [count, setCount] = useState(0);
  const hiddenFileInput = React.useRef<any>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files || [])];
    setCount(files?.length || 0);
    const imageCards: ImageCard[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `/property-images/${file.name}`;

        await UploadPhotoAsync(filePath, file).then((url) => {
          if (url) {
            imageCards.push({
              id: uuidv4(),
              name: file.name,
              url: url,
              type: file.type,
              size: file.size,
            });
          }
        });
      }
    }
    setCount(0);
    let newImages = [...(newProperty.images || []), ...imageCards];
    dispatch(updateNewProperty({ images: newImages }));
  };

  const onChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setUploading(true);
    await handleChange(e).finally(() => {
      setUploading(false);
    });
  };

  return (
    <>
      <label htmlFor="addPropertyImages" className="h-[100px] w-[100px]">
        <div
          role="button"
          className="border border-gray-300 rounded-md flex flex-col gap-2 items-center justify-center w-full h-full"
          title="Add Image"
        >
          <FaPlusCircle className="text-3xl text-gray-400" />
          <p className="text-center text-xs text-gray-600 font-medium">
            Add Image
          </p>
        </div>
        <input
          type="file"
          id="addPropertyImages"
          multiple
          ref={hiddenFileInput}
          disabled={uploading}
          onChange={onChange}
          style={{ display: "none" }}
          accept="image/png, image/jpeg, image/jpg"
          title="Add Image"
        />
      </label>
      {uploading && (
        <div className="text-xs border-green-200 border rounded h-[100px] w-[100px] flex flex-col items-center justify-center relative">
          <span>
            {count} file{count > 1 ? "s" : ""}
          </span>
          <span>uploading..</span>
        </div>
      )}
    </>
  );
};

export default PropertyImagePicker;
