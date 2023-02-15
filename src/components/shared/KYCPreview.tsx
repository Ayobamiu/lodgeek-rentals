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
            <h3 className="text-xl font-bold my-5">DECLARATION:</h3>
            <div className="mb-1 font-medium lg:text-lg text-justify text-coolGray-900 flex lg:leading-10">
              I, {tenantFullName}, hereby offer to rent the property from the
              owner under a lease to be prepared by the Agent. Should this
              application be approved, I acknowledge that I will be required to
              pay the following amount: {formatPrice(rentalRecordData.rent)}{" "}
              rent per {rentalRecordData.rentPer} (which may be subject to
              review). I acknowledge that this application is subject to the
              approval of the owner. I declare that all information contained in
              this application is true and correct and given of my own free
              will. I declare that I have inspected the premises and am
              satisfied with the current condition and cleanliness of the
              property. I acknowledge that my personal contents insurance is not
              covered under any lessor insurance policy/s and understand that it
              is my responsibility to insure my own personal belongings. I
              acknowledge and accept that if this application is denied, the
              agent is not legally obliged to provide reasons. I certify that
              the above information is correct and complete and hereby authorize
              you to do a credit check and make any inquiries you feel necessary
              to evaluate my tenancy and credit standing. I understand that
              giving incomplete or false information is grounds for rejection of
              this application. If any information supplied on this application
              is later found to be false, this is grounds for termination of
              tenancy. Applicant screening entails the checking of the
              applicant’s credit, rental history, employment history, public
              records and other criteria for residency.
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                defaultChecked={rentalRecordData.tenantAgreed}
                name="tenantAgreed"
                id="tenantAgreed"
                className="h-5 w-5"
              />
              <label htmlFor="tenantAgreed">
                I Agree to this tenancy declaration.
              </label>
            </div>

            <div className="mt-10">
              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                Lodgeek is an intermediary that provides a range of rental
                management services to property owners. These services include,
                but are not limited to, marketing and advertising properties for
                rent, screening and selecting tenants, managing the lease
                process, collecting rent, managing repairs and maintenance, and
                facilitating communication between property owners and tenants.
              </div>

              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                Lodgeek is not a party to the rental agreements entered into
                between property owners and tenants, and its role is limited to
                that of an intermediary facilitating the rental process. Lodgeek
                does not own or control any of the properties listed on its
                platform, and its relationship with property owners and tenants
                is limited to facilitating the rental process and providing
                rental management services.
              </div>

              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                Lodgeek does not discriminate against any person based on their
                race, color, religion, sex, national origin, familial status, or
                disability. Lodgeek is committed to ensuring that all properties
                listed on its platform comply with applicable laws and
                regulations.
              </div>

              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                Property owners and tenants are responsible for their own
                actions and decisions related to the rental process. They
                acknowledge that Lodgeek is not responsible for any disputes,
                damages, or losses that may arise from the use of its platform
                or the rental process, and that Lodgeek is not liable for any
                damages or losses incurred by them as a result of their use of
                the platform or the services provided by Lodgeek.
              </div>

              <div className="text-xs font-medium text-coolGray-500 text-justify my-2">
                By using Lodgeek's platform and services, property owners and
                tenants agree to be bound by the terms and conditions set out in
                this declaration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
