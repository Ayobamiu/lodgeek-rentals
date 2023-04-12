import { useState } from "react";
import PropertyItem from "../../components/shared/PropertyItem";
import { useNavigate } from "react-router-dom";
import { selectProperties } from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useProperties from "../../hooks/useProperties";
import FuzzySearch from "fuzzy-search";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { selectSelectedCompany } from "../../app/features/companySlice";
import useRestrictions from "../../hooks/useRestrictions";
import { SubscriptionPlan } from "../../models";
import { setNotification } from "../../app/features/notificationSlice";

export default function Properties() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useProperties();
  const properties = useAppSelector(selectProperties);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const [searchQuery, setSearchQuery] = useState("");
  const searcher = new FuzzySearch(
    properties,
    ["title", "description", "address", "location", "rent"],
    {
      caseSensitive: false,
    }
  );
  let searchResults = properties;

  console.log(searchResults);

  if (searchQuery) {
    searchResults = searcher.search(searchQuery);
  }

  const { getPropertiesRestriction } = useRestrictions();
  const {
    canUploadMoreProperties,
    showAddPropertyButton,
    propertyRestrictionType,
  } = getPropertiesRestriction;

  const gotoAddNewProperty = () => {
    if (!canUploadMoreProperties) {
      const minProperties =
        propertyRestrictionType === SubscriptionPlan["Free Plan"]
          ? 5
          : propertyRestrictionType === SubscriptionPlan["Basic Plan"]
          ? 20
          : 50;

      return dispatch(
        setNotification({
          type: "default",
          title: `You can manage only ${minProperties} properties with the ${propertyRestrictionType}`,
          description: "Upgrade your plan to manage more properties.",
          buttons: [
            {
              text: "Upgrade your plan",
              onClick: () => {
                navigate(`/select-plans`);
              },
              type: "button",
            },
          ],
        })
      );
    }
    navigate(`/dashboard/${selectedCompany?.id}/properties/new`);
  };

  return (
    <DashboardWrapper>
      <div>
        <section className="bg-white p-8">
          <div className="flex flex-wrap items-center -m-2">
            <div className="w-full md:w-1/2 p-2">
              <div className="flex flex-wrap items-center -m-2">
                <div className="flex-1 p-2">
                  <h2 className="font-semibold text-black text-3xl">
                    Properties
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <div className="flex flex-wrap justify-end -m-2">
                <div className="w-full md:w-auto p-2"></div>
                {showAddPropertyButton && (
                  <div className="w-full md:w-auto p-2">
                    <button
                      onClick={gotoAddNewProperty}
                      className="flex flex-wrap items-center justify-center py-3 px-4 w-full text-base text-white font-medium bg-green-500 hover:bg-green-600 rounded-md shadow-button"
                    >
                      <svg
                        className="mr-2"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7363 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0V0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C18 12.1217 17.1572 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18V18ZM14 9H11V6C11 5.73478 10.8946 5.48043 10.7071 5.29289C10.5196 5.10536 10.2652 5 10 5C9.73479 5 9.48043 5.10536 9.2929 5.29289C9.10536 5.48043 9 5.73478 9 6V9H6C5.73479 9 5.48043 9.10536 5.2929 9.29289C5.10536 9.48043 5 9.73478 5 10C5 10.2652 5.10536 10.5196 5.2929 10.7071C5.48043 10.8946 5.73479 11 6 11H9V14C9 14.2652 9.10536 14.5196 9.2929 14.7071C9.48043 14.8946 9.73479 15 10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14V11H14C14.2652 11 14.5196 10.8946 14.7071 10.7071C14.8946 10.5196 15 10.2652 15 10C15 9.73478 14.8946 9.48043 14.7071 9.29289C14.5196 9.10536 14.2652 9 14 9Z"
                          fill="#D5DAE1"
                        ></path>
                      </svg>
                      <span>Add Property</span>
                    </button>
                  </div>
                )}
                <div className="w-full md:w-auto p-2">
                  <input
                    type="search"
                    name="searchProperties"
                    id="searchProperties"
                    className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                    placeholder="Search Properties"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-coolGray-50 py-4">
          <div className="container px-4 mx-auto">
            <div className="p-6 mx-auto bg-white border border-coolGray-100 rounded-md shadow-dashboard">
              <div className="flex flex-wrap -m-2">
                {searchResults.map((property, index) => (
                  <PropertyItem
                    onClick={() =>
                      navigate(
                        `/dashboard/${property.company}/properties/${property.id}`
                      )
                    }
                    key={index}
                    property={property}
                  />
                ))}
                {!searchResults.length && (
                  <div className="flex justify-center text-lg font-medium text-coolGray-500 mb-2 w-full">
                    No properties found
                  </div>
                )}
                {/* <div className="w-full p-2">
                  <button className="px-4 py-1 mt-1 font-medium text-sm text-coolGray-500 hover:text-coolGray-600 border border-coolGray-200 hover:border-coolGray-300 rounded-md shadow-button">
                    See all schedules
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
}
