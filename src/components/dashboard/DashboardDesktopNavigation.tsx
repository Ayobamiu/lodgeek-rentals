import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { selectSelectedCompany } from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";

const DashboardDesktopNavigation = () => {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const { pathname } = useLocation();

  const styleActiveTab = useMemo(
    () =>
      (name: string): string => {
        if (pathname.includes(name)) {
          return "text-green-500 border-green-500 flex flex-wrap items-center py-8 text-base font-medium  hover:text-green-500 border-b-2  hover:border-green-500";
        } else {
          return "text-coolGray-500 border-transparent flex flex-wrap items-center py-8 text-base font-medium  hover:text-green-500 border-b-2  hover:border-green-500";
        }
      },
    [pathname]
  );
  return (
    <ul className="hidden xl:flex flex-wrap">
      {selectedCompany && (
        <li className="mr-8">
          <Link
            className={styleActiveTab("rentalRecords")}
            to={`/dashboard/${selectedCompany.id}/rentalRecords`}
          >
            <svg
              className="mr-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V17C11 17.2652 11.1054 17.5196 11.2929 17.7071C11.4804 17.8946 11.7348 18 12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6ZM7 12C6.73478 12 6.48043 12.1054 6.29289 12.2929C6.10536 12.4804 6 12.7348 6 13V17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17V13C8 12.7348 7.89464 12.4804 7.70711 12.2929C7.51957 12.1054 7.26522 12 7 12ZM17 10C16.7348 10 16.4804 10.1054 16.2929 10.2929C16.1054 10.4804 16 10.7348 16 11V17C16 17.2652 16.1054 17.5196 16.2929 17.7071C16.4804 17.8946 16.7348 18 17 18C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17V11C18 10.7348 17.8946 10.4804 17.7071 10.2929C17.5196 10.1054 17.2652 10 17 10ZM19 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V19Z"
                fill="currentColor"
              ></path>
            </svg>
            <p className="text-white">Rental Records</p>
          </Link>
        </li>
      )}
      {selectedCompany && (
        <li className="mr-8">
          <Link
            className={styleActiveTab("properties")}
            to={`/dashboard/${selectedCompany.id}/properties`}
          >
            <svg
              className="mr-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.50003 8.86L11.5 14.06C11.6521 14.1478 11.8245 14.194 12 14.194C12.1756 14.194 12.348 14.1478 12.5 14.06L21.5 8.86C21.6512 8.77275 21.7768 8.64746 21.8646 8.49659C21.9523 8.34572 21.999 8.17452 22 8C22.0007 7.82379 21.9549 7.65053 21.8671 7.49775C21.7792 7.34497 21.6526 7.21811 21.5 7.13L12.5 1.94C12.348 1.85224 12.1756 1.80603 12 1.80603C11.8245 1.80603 11.6521 1.85224 11.5 1.94L2.50003 7.13C2.34743 7.21811 2.22081 7.34497 2.13301 7.49775C2.04521 7.65053 1.99933 7.82379 2.00003 8C2.00108 8.17452 2.04779 8.34572 2.13551 8.49659C2.22322 8.64746 2.34889 8.77275 2.50003 8.86ZM12 4L19 8L12 12L5.00003 8L12 4ZM20.5 11.17L12 16L3.50003 11.13C3.3859 11.0639 3.25981 11.021 3.12903 11.0038C2.99825 10.9866 2.86537 10.9955 2.73803 11.0299C2.61069 11.0643 2.49141 11.1235 2.38706 11.2042C2.28271 11.2849 2.19536 11.3854 2.13003 11.5C1.99966 11.7296 1.96539 12.0015 2.03471 12.2563C2.10403 12.5111 2.2713 12.7281 2.50003 12.86L11.5 18.06C11.6521 18.1478 11.8245 18.194 12 18.194C12.1756 18.194 12.348 18.1478 12.5 18.06L21.5 12.86C21.7288 12.7281 21.896 12.5111 21.9654 12.2563C22.0347 12.0015 22.0004 11.7296 21.87 11.5C21.8047 11.3854 21.7173 11.2849 21.613 11.2042C21.5087 11.1235 21.3894 11.0643 21.262 11.0299C21.1347 10.9955 21.0018 10.9866 20.871 11.0038C20.7402 11.021 20.6142 11.0639 20.5 11.13V11.17ZM20.5 15.17L12 20L3.50003 15.13C3.3859 15.0639 3.25981 15.021 3.12903 15.0038C2.99825 14.9866 2.86537 14.9955 2.73803 15.0299C2.61069 15.0643 2.49141 15.1235 2.38706 15.2042C2.28271 15.2849 2.19536 15.3854 2.13003 15.5C1.99966 15.7296 1.96539 16.0015 2.03471 16.2563C2.10403 16.5111 2.2713 16.7281 2.50003 16.86L11.5 22.06C11.6521 22.1478 11.8245 22.194 12 22.194C12.1756 22.194 12.348 22.1478 12.5 22.06L21.5 16.86C21.7288 16.7281 21.896 16.5111 21.9654 16.2563C22.0347 16.0015 22.0004 15.7296 21.87 15.5C21.8047 15.3854 21.7173 15.2849 21.613 15.2042C21.5087 15.1235 21.3894 15.0643 21.262 15.0299C21.1347 14.9955 21.0018 14.9866 20.871 15.0038C20.7402 15.021 20.6142 15.0639 20.5 15.13V15.17Z"
                fill="currentColor"
              ></path>
            </svg>
            <p className="text-white">Properties</p>
          </Link>
        </li>
      )}
      {selectedCompany && (
        <li className="mr-8">
          <Link
            className={styleActiveTab("bankRecords")}
            to={`/dashboard/${selectedCompany.id}/bankRecords`}
          >
            <svg
              fill="currentColor"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24"
              height="24"
              viewBox="0 0 969.486 969.486"
              xmlSpace="preserve"
              className="mr-2"
            >
              <g>
                <g>
                  <path
                    d="M806.582,235.309L766.137,87.125l-137.434,37.51L571.451,9.072L114.798,235.309H0v725.105h907.137V764.973h62.35v-337.53
h-62.352V235.309H806.582z M718.441,170.63l17.654,64.68h-52.561h-75.887h-126.19l111.159-30.339l66.848-18.245L718.441,170.63z
M839.135,892.414H68V522.062v-129.13v-10.233v-69.787v-9.602h35.181h27.538h101.592h409.025h75.889h37.43h35.242h35.244h13.994
v51.272v72.86h-15.357h-35.244h-87.85H547.508h-55.217v27.356v75.888v8.758v35.244v35.244v155.039h346.846v127.441H839.135z
M901.486,696.973h-28.352h-34H560.291V591.375v-35.244v-35.244v-23.889v-1.555h3.139h90.086h129.129h56.492h34h4.445h23.904
V696.973z M540.707,100.191l21.15,42.688l-238.955,65.218L540.707,100.191z"
                  />
                  <polygon points="614.146,564.57 614.146,576.676 614.146,631.152 680.73,631.152 680.73,564.57 658.498,564.57 		" />
                </g>
              </g>
            </svg>
            <p className="text-white">Wallet</p>
          </Link>
        </li>
      )}
    </ul>
  );
};

export default DashboardDesktopNavigation;
