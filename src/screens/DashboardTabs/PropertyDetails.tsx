import { useCallback, useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { propertyOne } from "../../utils/devData";
import PropertyImageCarousel from "../../components/dashboard/PropertyImageCarousel";
import { MdLocationPin } from "react-icons/md";
import { Tabs } from "flowbite-react";
import PropertyDetailTab from "../../components/dashboard/PropertyDetailTab";
import { useNavigate, useParams } from "react-router-dom";
import { Property } from "../../models";
import { getProperty } from "../../firebase/apis/company";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import PropertyLandlordTab from "../../components/dashboard/PropertyLandlordTab";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const selectedCompany = useAppSelector(selectSelectedCompany);

  const { images, title, rent, rentPer, location, description, address } =
    propertyOne;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tabsRef = useRef<any>(null);
  const { propertyId } = useParams();
  const [propertyDetail, setPropertyDetail] = useState<Property | null>(null);

  const getPropertyDetail = useCallback(async () => {
    setLoading(true);
    setError("");
    const property = await getProperty(propertyId);
    if (property) {
      setLoading(false);
      setError("");
      setPropertyDetail(property);
      return;
    }
    if (!property) {
      setLoading(false);
      setError("Error occured while getting the property detail");
      return;
    }
  }, [propertyId]);

  useEffect(() => {
    getPropertyDetail();
  }, [getPropertyDetail]);

  return (
    <DashboardWrapper className="lg:ml-56 xl:ml-40">
      <section className="container mx-auto bg-white py-8 px-4 md:px-10 lg:px-20 xl:px-40 border-b print:hidden">
        <div className="flex flex-wrap items-center justify-between">
          <button
            onClick={() => {
              navigate(`/dashboard/${selectedCompany?.id}/properties`);
            }}
            className="flex items-center gap-x-3 text-blue-500 cursor-pointer"
          >
            <FontAwesomeIcon icon={faAngleLeft} className="" />
            go to properties
          </button>
          <FontAwesomeIcon
            icon={faEdit}
            size="lg"
            className="cursor-pointer"
            onClick={() => {
              navigate(
                `/dashboard/${selectedCompany?.id}/properties/edit/${propertyId}`
              );
            }}
          />
        </div>
        {/* Content */}
      </section>
      <section className="container mx-auto bg-white py-8 px-4 md:px-10 lg:px-20 xl:px-40  print:hidden w-full">
        <div className="w-full flex flex-row  justify-between mb-10 ">
          <div className="w-[80%] md:w-[70%]">
            <h1 className="text-lg md:text-2xl  text-gray-400 font-semibold">
              {propertyDetail?.title}
            </h1>
            <div className="flex flex-row items-center">
              <MdLocationPin className="text-gray-500" />
              &nbsp;{" "}
              <p className="text-gray-500 font-semibold">
                {propertyDetail?.location}
              </p>
            </div>
          </div>
          {/* Price */}
          <div className="">
            <h6 className="text:xl md:text-2xl xl:text-3xl text-gray-800 font-bold">
              ₦{propertyDetail?.rent?.toLocaleString()}
            </h6>
            <span className="text-gray-500 font-semibold lowercase">
              / per&nbsp;{propertyDetail?.rentPer}
            </span>
          </div>
        </div>
        <div className="w-full">
          <PropertyImageCarousel images={propertyDetail?.images || []} />
        </div>
        {/* Others */}
        <div className="w-full mt-10">
          <Tabs.Group
            aria-label="Default tabs"
            style="default"
            ref={tabsRef}
            onActiveTabChange={(tab) => setActiveTab(tab)}
          >
            <Tabs.Item active title="Detail">
              <PropertyDetailTab property={propertyDetail} />
            </Tabs.Item>
            <Tabs.Item active title="Landlord">
              {propertyDetail && (
                <PropertyLandlordTab property={propertyDetail} />
              )}
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </section>
    </DashboardWrapper>
  );
};

export default PropertyDetails;
