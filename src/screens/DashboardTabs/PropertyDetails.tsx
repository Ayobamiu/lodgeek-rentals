import { useCallback, useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import Button from "../../components/shared/button/Button";
import { propertyOne } from "../../utils/devData";
import PropertyImageCarousel from "../../components/dashboard/PropertyImageCarousel";
import { MdLocationPin } from "react-icons/md";
import { Tabs } from "flowbite-react";
import PropertyDetailTab from "../../components/dashboard/PropertyDetailTab";
import { useParams } from "react-router-dom";
import { IProperty } from "../../models";
import { getProperty } from "../../firebase/apis/company";

const PropertyDetails = () => {
  const { images, title, rent, rentPer, location, description, address } =
    propertyOne;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tabsRef = useRef<any>(null);
  const { propertyId } = useParams();
  const [propertyDetail, setPropertyDetail] = useState<IProperty | null>(null);

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
        <div className="flex flex-wrap items-center -m-2">
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-wrap items-center -m-2">
              <div className="flex-1 p-2">
                <h2 className="font-semibold text-black text-3xl">
                  Property Detail
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-2">
            <div className="flex flex-wrap justify-end -m-2">
              <div className="w-full md:w-auto p-2"></div>
              <div className="w-full md:w-auto p-2">
                <Button title="Edit" />
              </div>
              <div className="w-full md:w-auto p-2"></div>
            </div>
          </div>
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
          <PropertyImageCarousel images={images} />
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
            {/* <Tabs.Item title="Dashboard">Dashboard content</Tabs.Item> */}
          </Tabs.Group>
        </div>
      </section>
    </DashboardWrapper>
  );
};

export default PropertyDetails;
