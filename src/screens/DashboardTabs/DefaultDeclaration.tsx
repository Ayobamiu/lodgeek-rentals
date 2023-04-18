import { RentalRecord } from "../../models";
import formatPrice from "../../utils/formatPrice";

export function DefaultDeclaration({
  rentalRecordData,
}: {
  rentalRecordData: RentalRecord;
}) {
  return (
    <div className="flex-1 w-full p-6 overflow-y-scroll lg:text-2xl lg:leading-10 bg-gray-100">
      I, the Applicant, hereby offer to rent the property from the owner under a
      lease to be prepared by the Agent. Should this application be approved, I
      acknowledge that I will be required to pay the following amount:{" "}
      {formatPrice(rentalRecordData.rent)} rent per {rentalRecordData.rentPer}{" "}
      (which may be subject to review). I acknowledge that this application is
      subject to the approval of the owner. I declare that all information
      contained in this application is true and correct and given of my own free
      will. I declare that I have inspected the premises and am satisfied with
      the current condition and cleanliness of the property. I acknowledge that
      my personal contents insurance is not covered under any lessor insurance
      policy/s and understand that it is my responsibility to insure my own
      personal belongings. I acknowledge and accept that if this application is
      denied, the agent is not legally obliged to provide reasons. I certify
      that the above information is correct and complete and hereby authorize
      you to do a credit check and make any inquiries you feel necessary to
      evaluate my tenancy and credit standing. I understand that giving
      incomplete or false information is grounds for rejection of this
      application. If any information supplied on this application is later
      found to be false, this is grounds for termination of tenancy. Applicant
      screening entails the checking of the applicant’s credit, rental history,
      employment history, public records and other criteria for residency.
    </div>
  );
}
