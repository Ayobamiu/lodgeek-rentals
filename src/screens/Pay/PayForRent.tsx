import { useEffect, useState } from "react";
import { Alert, Badge, Button, Descriptions, Result, Space } from "antd";
import {
  Company,
  Payment,
  Property,
  Rent,
  RentalRecord,
  RentStatus,
  User,
} from "../../models";
import formatPrice from "../../utils/formatPrice";
import { useNavigate, useParams } from "react-router-dom";
import { getRent } from "../../firebase/apis/rents";
import FullScreenActivityIndicator from "../../components/shared/FullScreenActivityIndicator";
import LostPage from "../../components/shared/LostPage";
import moment from "moment";
import { getUser } from "../../firebase/apis/user";
import { getProperty } from "../../firebase/apis/property";
import { getCompany } from "../../firebase/apis/company";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";
import { getRentalRecord } from "../../firebase/apis/rentalRecord";
import { payRentAndFees } from "../../functions/payRentAndFees";
import { usePaystackPayment } from "react-paystack";

const PayForRent = () => {
  let { rentId } = useParams();
  const navigate = useNavigate();

  const [currentRent, setCurrentRent] = useState<Rent | null>(null);
  const [tenant, setTenant] = useState<User | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyCompany, setPropertyCompany] = useState<Company | null>(null);
  const [rentalRecord, setRentalRecord] = useState<RentalRecord | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  const [loadingRentDetails, setLoadingRentDetails] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed">();
  const [confirming, setConfirming] = useState(false);

  //load rent docs
  useEffect(() => {
    (async () => {
      setLoadingRentDetails(true);
      await getRent(rentId as string)
        .finally(() => {
          setLoadingRentDetails(false);
        })
        .then(async (rent_) => {
          if (rent_) {
            setCurrentRent(rent_);
          }
          const tenant_ = await getUser(rent_.tenant);
          if (tenant_) {
            setTenant(tenant_);
          }
          const property_ = await getProperty(rent_.property);
          if (property_) {
            setProperty(property_);
          }
          const company_ = await getCompany(rent_.company);
          if (company_) {
            setPropertyCompany(company_);
          }
          const rentalRecord_ = await getRentalRecord(rent_.rentalRecord);
          if (rentalRecord_) {
            setRentalRecord(rentalRecord_);
          }
        });
    })();
  }, [rentId]);

  const handlePaidRents = async () => {
    if (!currentRent || !property || !rentalRecord) return;
    setConfirming(true);
    await payRentAndFees({
      rents: [currentRent],
      rentalRecordId: currentRent.rentalRecord,
      owner: currentRent.owner,
      propertyTitle: property?.title,
      tenantName: `${tenant?.firstName} ${tenant?.lastName}`,
      tenantEmail: tenant?.email || "",
      selectedAdditionalFees: [],
      rentalRecord: rentalRecord,
    })
      .finally(() => {
        setConfirming(false);
      })
      .then((payment_) => {
        const paidRent: Rent = {
          ...currentRent,
          status: RentStatus["Paid - Rent has been paid."],
        };
        setCurrentRent(paidRent);
        if (payment_) {
          setPayment(payment_);
        }
        setPaymentStatus("success");
      })
      .catch(() => {
        setPaymentStatus("failed");
      });
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: tenant?.email || "",
    amount: ((currentRent?.rent || 0) + 200) * 100,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "",
  };

  const onSuccess = () => {
    handlePaidRents();
  };
  const onClose = () => {};
  const initializePayment = usePaystackPayment(config);

  if (!loadingRentDetails && !currentRent) return <LostPage />;
  if (paymentStatus === "success")
    return (
      <Result
        status="success"
        title="Successfully Paid Rent!"
        subTitle={`Receipt number: ${payment?.rentReceipt?.receiptNumber}. Rent updates takes 1-5 minutes, check your dashboard.`}
        extra={[
          <Button
            disabled={!payment}
            onClick={() => {
              navigate(`/view-receipt/${payment?.id}`);
            }}
            type="primary"
            key="console"
            className="bg-blue-500"
          >
            Download Receipt
          </Button>,
          <Button
            onClick={() => {
              navigate(`/`, { replace: true });
            }}
            key="console"
          >
            Go home
          </Button>,
        ]}
      />
    );
  if (paymentStatus === "failed")
    return (
      <Result
        status="error"
        title="Payment Confirmation Failed"
        subTitle="It is a problem from our side. Kindly reach out on contact@lodgeek.com."
        extra={[
          <Button
            onClick={() => {
              navigate(`/`, { replace: true });
            }}
            type="link"
            key="console"
          >
            Go Home
          </Button>,
        ]}
      />
    );

  return (
    <div className="container mx-auto lg:p-10 p-5">
      {(loadingRentDetails || confirming) && <FullScreenActivityIndicator />}
      <FlexUIGreenLight className="relative left-1/2 -translate-x-1/2 mb-10 h-16 lg:w-auto w-24" />
      <div className="my-5">
        {currentRent?.status === RentStatus["Paid - Rent has been paid."] && (
          <Alert
            message="Rent Paid"
            description="This rent has been paid and no further payment is required. Thank you for your prompt payment. If you have any questions or concerns, please do not hesitate to contact us."
            type="success"
            showIcon
            action={
              <>
                <Button
                  onClick={() => {
                    navigate(`/`, { replace: true });
                  }}
                  type="link"
                  key="console"
                >
                  Go Home
                </Button>
              </>
            }
          />
        )}
      </div>
      <Descriptions
        title={`Rent Payment to ${propertyCompany?.name || "--"}`}
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        extra={
          <button
            onClick={() => {
              initializePayment(onSuccess, onClose);
            }}
            disabled={
              currentRent?.status === RentStatus["Paid - Rent has been paid."]
            }
            className="disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Pay Now
          </button>
        }
      >
        <Descriptions.Item label="Property" span={2}>
          {property?.title || ""}
        </Descriptions.Item>
        <Descriptions.Item label="Property Address" span={2}>
          {property?.address || ""}
        </Descriptions.Item>
        <Descriptions.Item label="Unit No">
          {rentalRecord?.unitNo || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Automatic Renewal">No</Descriptions.Item>
        <Descriptions.Item label="Rent starts">
          {moment(currentRent?.dueDate).format("ll")}
        </Descriptions.Item>
        <Descriptions.Item label="Rent ends">
          {moment(currentRent?.dueDate)
            .add(1, currentRent?.rentPer || "year")
            .format("ll")}
        </Descriptions.Item>
        <Descriptions.Item label="Rent amount due">
          {formatPrice(currentRent?.rent || 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Payment due date">
          {moment().format("ll")}
        </Descriptions.Item>
        <Descriptions.Item label="Official Receipts">
          {formatPrice((currentRent?.rent || 0) + 200)}
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={3}>
          <Badge
            // status="warning"
            text={currentRent?.status}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Tenant">
          {tenant?.firstName || "-"} {tenant?.lastName || "-"}
          <br />
          {tenant?.email || "-"}
          <br />
          {tenant?.phone || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Property Company">
          {propertyCompany?.name || "-"}
          <br />
          {propertyCompany?.registrationNumber || "-"}
          <br />
          {propertyCompany?.email || "-"}
          <br />
          {propertyCompany?.phone || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Property manager/Landlord">
          {property?.landLordFullName || "-"}
          <br />

          {property?.landLordEmailAddress || "-"}
          <br />
          {property?.landLordContactPhoneNumber || "-"}
        </Descriptions.Item>
      </Descriptions>
      <div className="mx-auto mt-20">
        <p className="text-xs font-medium text-coolGray-500 my-5 lg:text-center text-justify ">
          Please note that Lodgeek is processing this payment on behalf of
          {propertyCompany?.name || "--"} for the landlord. By submitting this
          payment, you agree that Lodgeek is not liable for any issues that may
          arise from the rental agreement between you and the landlord. If you
          have any questions or concerns, please contact{" "}
          {propertyCompany?.name || "--"}
          directly.
        </p>
        <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
          Lodgeek is an intermediary that provides a range of rental management
          services to property owners. These services include, but are not
          limited to, marketing and advertising properties for rent, screening
          and selecting tenants, managing the lease process, collecting rent,
          managing repairs and maintenance, and facilitating communication
          between property owners and tenants.
        </div>

        <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
          Lodgeek is not a party to the rental agreements entered into between
          property owners and tenants, and its role is limited to that of an
          intermediary facilitating the rental process. Lodgeek does not own or
          control any of the properties listed on its platform, and its
          relationship with property owners and tenants is limited to
          facilitating the rental process and providing rental management
          services.
        </div>

        <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
          Lodgeek does not discriminate against any person based on their race,
          color, religion, sex, national origin, familial status, or disability.
          Lodgeek is committed to ensuring that all properties listed on its
          platform comply with applicable laws and regulations.
        </div>

        <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
          Property owners and tenants are responsible for their own actions and
          decisions related to the rental process. They acknowledge that Lodgeek
          is not responsible for any disputes, damages, or losses that may arise
          from the use of its platform or the rental process, and that Lodgeek
          is not liable for any damages or losses incurred by them as a result
          of their use of the platform or the services provided by Lodgeek.
        </div>

        <div className="text-xs font-medium text-coolGray-500 lg:text-center text-justify my-2">
          By using Lodgeek's platform and services, property owners and tenants
          agree to be bound by the terms and conditions set out in this
          declaration.
        </div>
      </div>
      <p className="py-10 md:pb-20 text-xs text-coolGray-400 font-medium lg:text-center text-justify">
        © 2023 Lodgeek. All rights reserved.
      </p>
    </div>
  );
};

export default PayForRent;
