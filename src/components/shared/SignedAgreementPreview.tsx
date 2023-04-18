import { Transition } from "@headlessui/react";
import { Property, RentalRecord, UserKYC } from "../../models";
import formatPrice from "../../utils/formatPrice";
import DetailsBox from "./DetailsBox";
import moment from "moment";
import Logo from "../../assets/logo-no-background.svg";
import html2pdf from "html-to-pdf-js";

type KYCPreviewProps = {
  openAgreementForm: boolean;
  setOpenAgreementForm: React.Dispatch<React.SetStateAction<boolean>>;
  rentalRecordData: RentalRecord;
  userKYC: UserKYC;
  tenantFullName: string;
  property: Property;
  ownerFullName: string;
};

export function SignedAgreementPreview(props: KYCPreviewProps) {
  const {
    openAgreementForm,
    userKYC,
    rentalRecordData,
    tenantFullName,
    property,
    setOpenAgreementForm,
    ownerFullName,
  } = props;

  function printAgreementDoc() {
    var element = document.getElementById("userKYCPreview");
    var opt = {
      margin: 1,
      filename: `Tenancy Agreement - ${tenantFullName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  }

  return (
    <Transition
      show={openAgreementForm}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="bg-white fixed h-screen w-screen top-0 left-0 z-50 overflow-scroll ">
        <div className="h-20 w-full border-b flex justify-between items-center p-3">
          <h1 className="lg:text-3xl text-2xl">Tenancy agreement</h1>
          <div className="flex ml-auto item-center gap-x-5">
            <button
              className="text-red-500"
              onClick={() => {
                setOpenAgreementForm(false);
              }}
            >
              Close
            </button>
            <button
              onClick={printAgreementDoc}
              className="text-green-500 flex"
              type="button"
            >
              Print
            </button>
          </div>
        </div>

        <div className=" lg:w-[1000px] lg:m-5 m-0 lg:mx-auto mx-auto">
          <div
            className="userKYCPreview w-full shadow-2xl  lg:p-10 p-5"
            id="userKYCPreview"
          >
            <div className="mb-5 text-center lg:w-[60%] mx-auto">
              <img
                src={Logo}
                alt=""
                width="120px"
                height="32px"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "8px",
                }}
              />

              <h3 className="lg:text-xl text-sm font-bold mb-2">
                Tenancy agreement for {tenantFullName} at {property.title}
              </h3>
              <p className="text-xs font-medium text-coolGray-500 ">
                This agreement is between <strong>{ownerFullName} </strong>{" "}
                (Property owner) and <strong>{tenantFullName} </strong>(Tenant)
              </p>
            </div>

            <DetailsBox label="Property Owner" value={ownerFullName} />

            <DetailsBox label="Tenant" value={tenantFullName} />

            <DetailsBox label="Property Location" value={property.location} />
            <DetailsBox
              label="Lease signed on"
              value={moment(rentalRecordData.tenantAgreedOn).format("ll")}
            />

            <DetailsBox
              label="Lease Agreement"
              value="Lease Agreement"
              isLink
              link={rentalRecordData.tenancyAgreementFile}
            />

            <div className="mt-10">
              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                As an online property management platform, Lodgeek serves as a
                witness to the agreement between the landlord and the tenant. We
                want to ensure that all parties involved in the leasing process
                are fully aware of the terms and conditions stated in the lease
                agreement.
              </div>

              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                To this end, we confirm that the tenant has signed the lease
                agreement on the date indicated in our records. By signing this
                agreement, the tenant acknowledges that they have read and fully
                understood the terms and conditions set forth in the lease
                agreement.
              </div>
              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                As a witness to this agreement, Lodgeek confirms that we have
                reviewed the signed document and have ensured that all relevant
                information is accurate and up to date. We take our role as a
                witness seriously and strive to ensure that all agreements made
                through our platform are fair and legally binding.
              </div>
              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                We encourage both parties to communicate effectively and
                collaborate to ensure a successful tenancy. Should any issues
                arise during the lease period, Lodgeek is here to offer support
                and guidance to both parties.
              </div>
              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                Thank you for choosing Lodgeek as your online property
                management platform. We look forward to a fruitful and
                successful tenancy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
