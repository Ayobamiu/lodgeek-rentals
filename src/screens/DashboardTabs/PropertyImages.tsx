import PropertyImagePicker from "../../components/property/PropertyImagePicker";
import SinglePropertyImage from "../../components/property/SinglePropertyImage";
import { selectNewProperty } from "../../app/features/propertySlice";
import { useAppSelector } from "../../app/hooks";

export function PropertyImages() {
  const newProperty = useAppSelector(selectNewProperty);
  return (
    <section className=" mt-10 ">
      <div className="flex flex-row items-center whitespace-nowrap gap-3 flex-wrap max-h-52 overflow-y-scroll">
        <PropertyImagePicker />
        {newProperty.images?.map((item, index) => (
          <SinglePropertyImage img={item} key={index} />
        ))}
      </div>
    </section>
  );
}
