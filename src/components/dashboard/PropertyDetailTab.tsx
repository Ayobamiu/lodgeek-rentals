import { Property } from "../../models";
import SinglePropertyAmenities from "../property/SinglePropertyAmenities";
import SinglePropertyDetail from "../property/SinglePropertyDetail";
import SinglePropertyFacility from "../property/SinglePropertyFacility";

const PropertyDetailTab = ({ property }: { property: Property | null }) => {
  console.log(property);

  return (
    <div className="w-full ">
      <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 items-center border-b border-gray-200 pb-5">
        <SinglePropertyAmenities
          iconName="home"
          text={`${property?.propertyType}`}
        />
        <SinglePropertyAmenities
          iconName="bed"
          text={`${property?.numberOfBedrooms} bedrooms`}
        />
        <SinglePropertyAmenities
          iconName="bath"
          text={`${property?.numberOfBathrooms} bathrooms`}
        />
        <SinglePropertyAmenities
          iconName="toilet"
          text={`${property?.numberOfToilets} toilets`}
        />
      </div>
      {/* Property detail section */}
      <section className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5  border-b border-gray-200 pb-5 mt-5 ">
        {/* Single detail sec */}
        {/* <div className="w-full flex flex-row justify-between"> */}
        <SinglePropertyDetail
          text={property ? property?.address : ""}
          title="PROPERTY ADDRESS"
        />
        <SinglePropertyDetail
          text={property ? property?.furnishing : ""}
          title="PROPERTY FURNISHING"
        />
        {/* </div> */}
        {/* Single detail sec */}
        {/* <div className="w-full flex flex-row mt-5 justify-between"> */}
        <SinglePropertyDetail
          text={
            property
              ? `${Number(property?.propertySize)?.toLocaleString()} sqm`
              : ""
          }
          title="PROPERTY SIZE"
        />
        <SinglePropertyDetail
          text={property ? property?.condition : ""}
          title="PROPERTY CONDITION"
        />
        {/* </div> */}
        {/* Single detail sec */}
        {property && property?.estateName && (
          <div className="w-full flex flex-row  justify-between">
            <SinglePropertyDetail
              text={property ? property?.estateName : ""}
              title="ESTATE NAME"
            />
          </div>
        )}
      </section>
      {/* Property facilities section */}
      <section className="w-full  grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-5 lg:gap-10  pb-5 mt-5">
        {property &&
          property?.facilities?.map((item, index) => (
            <SinglePropertyFacility key={index} text={item} />
          ))}
      </section>
      {/* Property facilities section */}
      <section className="w-full  flex flex-col border-b border-gray-200 pb-5 ">
        <p className="text-[#95bce3] font-semibold sm:text-sm text-[10px]">
          PROPERTY DESCRIPTION
        </p>
        <p className="sm:text-sm text-gray-800 font-medium text-wrap text-xs">
          {property?.description}
        </p>
      </section>
    </div>
  );
};

export default PropertyDetailTab;
