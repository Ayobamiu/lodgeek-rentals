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

export function KYCPreview(props: KYCPreviewProps) {
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
          <h1 className="lg:text-3xl text-2xl">Tenant's KYC</h1>
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
                {tenantFullName}'s KYC for {property.title}
              </h3>
            </div>
            <DetailsBox
              label="Application Received"
              value={moment(rentalRecordData.tenantAgreedOn).format("ll")}
            />
            <DetailsBox
              label="Verified Valid Means of I.D."
              value={userKYC.idType}
              isLink
              link={userKYC.meansOfId}
            />
            <DetailsBox
              label="MOVE-IN DATE"
              value={moment(userKYC.moveInDate).format("ll")}
            />
            <DetailsBox
              label="RENT AMOUNT"
              value={`${formatPrice(rentalRecordData.rent)} per ${
                rentalRecordData.rentPer
              }`}
            />

            <h3 className="text-xl font-bold my-5">APPLICANT INFORMATION</h3>
            <DetailsBox label="NAME" value={tenantFullName} />
            <DetailsBox label="EMAIL ADDRESS" value={rentalRecordData.tenant} />
            <DetailsBox label="TELEPHONE NUMBER" value={userKYC.tenantPhone} />
            <DetailsBox
              label="YOUR CURRENT RESIDENCE"
              value={userKYC.tenantCurrentAddress}
            />
            <DetailsBox
              label="HAVE YOU GIVEN LEGAL NOTICE TO VACATE?"
              value={userKYC.readyToLeaveCurrentAddress}
            />
            <DetailsBox
              label="Current Resident type."
              value={userKYC.currentResidenceType}
            />

            <DetailsBox
              label="Current Residence MOVE-IN DATE"
              value={moment(userKYC.currentResidenceMoveInDate).format("ll")}
            />
            <DetailsBox
              label="Current Residence MOVE-IN DATE"
              value={moment(userKYC.currentResidenceMoveOutDate).format("ll")}
            />

            <DetailsBox
              label="LANDLORD/MTG. COMPANY:"
              value={userKYC.currentResidenceOwner}
            />
            <DetailsBox
              label="LANDLORD / MANAGEMENT COMPANY PHONE & ADDRESS:"
              value={userKYC.currentResidenceOwnerContact}
            />

            <DetailsBox
              label="REASON FOR VACATING YOUR PREVIOUS RESIDENCE:"
              value={userKYC.reasonForLeavingcurrentResidence}
            />

            <DetailsBox
              label="PREVIOUS RESIDENCE ADDRESS"
              value={userKYC.tenantCurrentAddress}
            />
            <h3 className="text-xl font-bold my-5">EMPLOYMENT DETAILS:</h3>

            <DetailsBox
              label="NAME OF CURRENT EMPLOYER"
              value={userKYC.currentEmployerName}
            />
            <DetailsBox
              label="POSITION"
              value={userKYC.currentEmploymentPosition}
            />
            <DetailsBox
              label="SALARY / MONTH"
              value={userKYC.currentMonthlySalary}
            />
            <h3 className="text-xl font-bold my-5">EMERGENCY CONTACT:</h3>

            <DetailsBox
              label="EMERGENCY CONTACT NAME"
              value={userKYC.emergencyContactName}
            />
            <DetailsBox
              label="EMERGENCY CONTACT RELATIONSHIP"
              value={userKYC.emergencyContactRelationship}
            />
            <DetailsBox
              label="EMERGENCY CONTACT ADDRESS"
              value={userKYC.emergencyContactAddress}
            />
            <DetailsBox
              label="EMERGENCY CONTACT TELEPHONE"
              value={userKYC.emergencyContact}
            />
            <h3 className="text-xl font-bold my-5">REFEREES:</h3>
            <DetailsBox
              label="REFEREE 1 FULL NAME"
              value={userKYC.referee1Name}
            />
            <DetailsBox
              label="RELATIONSHIP"
              value={userKYC.referee1Relationship}
            />
            <DetailsBox label="PHONE" value={userKYC.referee1Contact} />
            <DetailsBox label="EMAIL" value={userKYC.referee1Email} />
            <DetailsBox
              label="OCCUPATION / DESIGNATION"
              value={userKYC.referee1Occupation}
            />
            <DetailsBox
              label="OFFICE ADDRESS"
              value={userKYC.referee1Address}
            />
            <DetailsBox
              label="REFEREE 2 FULL NAME"
              value={userKYC.referee2Name}
            />
            <DetailsBox
              label="RELATIONSHIP"
              value={userKYC.referee2Relationship}
            />
            <DetailsBox label="PHONE" value={userKYC.referee2Contact} />
            <DetailsBox label="EMAIL" value={userKYC.referee2Email} />
            <DetailsBox
              label="OCCUPATION / DESIGNATION"
              value={userKYC.referee2Occupation}
            />
            <DetailsBox
              label="OFFICE ADDRESS"
              value={userKYC.referee2Address}
            />
            <DetailsBox
              label="GUARANTOR FULL NAME"
              value={userKYC.guarantorName}
            />
            <DetailsBox
              label="RELATIONSHIP"
              value={userKYC.guarantorRelationship}
            />
            <DetailsBox label="PHONE" value={userKYC.guarantorContact} />
            <DetailsBox label="EMAIL" value={userKYC.guarantorEmail} />
            <DetailsBox
              label="OCCUPATION / DESIGNATION"
              value={userKYC.guarantorOccupation}
            />
            <DetailsBox
              label="OFFICE ADDRESS"
              value={userKYC.guarantorAddress}
            />
            <DetailsBox
              label="HAVE YOU EVER BEEN EVICTED, OR ARE YOU SUBJECT TO A PENDING EVICTION CASE?"
              value={userKYC.beenEvictedBefore}
            />
            {userKYC.beenEvictedBefore === "yes" && (
              <>
                <DetailsBox
                  label="Last Eviction Date"
                  value={
                    userKYC.lastEvictionDate
                      ? moment(userKYC.lastEvictionDate).format("ll")
                      : ""
                  }
                />
                <DetailsBox
                  label="Last Eviction Location"
                  value={userKYC.lastEvictionLocation}
                />
              </>
            )}
            <DetailsBox
              label="HAVE YOU OR ANY PERSON WHO WILL OCCUPY THE UNIT EVER BEEN CONVICTED, PLEAD GUILTY, NO-CONTEST OR HAVE CURRENT PENDING CHARGES TO ANY FELONY OR MISDEMEANOR?"
              value={userKYC.associatedWithFelonyOrMisdemeanor}
            />
            {userKYC.associatedWithFelonyOrMisdemeanor === "yes" && (
              <>
                <DetailsBox
                  label="DESCRIBE OFFENSE:"
                  value={userKYC.felonyOrMisdemeanorDescription}
                />
                <DetailsBox
                  label="DATE OF OFFENSE:"
                  value={userKYC.felonyOrMisdemeanorDate}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
}
