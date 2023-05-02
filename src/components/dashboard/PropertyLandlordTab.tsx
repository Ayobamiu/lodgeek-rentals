import { Property } from "../../models";
import SinglePropertyDetail from "../property/SinglePropertyDetail";

const PropertyLandlordTab = ({ property }: { property: Property }) => {
  return (
    <div className="w-full ">
      {/* Property detail section */}
      <section className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5  border-b border-gray-200 pb-5 mt-5 ">
        <SinglePropertyDetail
          text={property.landLordFullName}
          title="Full Name"
        />
        <SinglePropertyDetail
          text={property.landLordContactPhoneNumber}
          title="Contact Phone Number"
        />
        <SinglePropertyDetail
          text={property.landLordEmailAddress}
          title="Email Address"
        />
        <SinglePropertyDetail
          text={property.landLordEmergencyContactInformation}
          title="Emergency Contact Information"
        />
        <SinglePropertyDetail
          text={property.landLordMailingAddress}
          title="Mailing Address"
        />
        <SinglePropertyDetail
          text={property.landLordTaxIdentificationNumber || "--"}
          title="Tax Identification Number"
        />
        <SinglePropertyDetail
          text={property.landLordPropertyManagementExperience || "--"}
          title="About"
        />
      </section>
    </div>
  );
};

export default PropertyLandlordTab;
