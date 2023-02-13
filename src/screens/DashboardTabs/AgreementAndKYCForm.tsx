import {
  faExternalLink,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Id, toast } from "react-toastify";
import {
  selectUserKYC,
  updateUserKYC,
} from "../../app/features/rentalRecordSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import useRentalRecords from "../../hooks/useRentalRecords";
import { AcceptableIDs, RentalRecord, RentOrOwn, YesOrNo } from "../../models";
import formatPrice from "../../utils/formatPrice";

type AgreementAndKYCFormProps = {
  openAgreementForm: boolean;
  setOpenAgreementForm: React.Dispatch<React.SetStateAction<boolean>>;
  rentalRecordData: RentalRecord;
  acceptInvitation: () => Promise<Id | undefined>;
};

export function AgreementAndKYCForm(props: AgreementAndKYCFormProps) {
  const {
    openAgreementForm,
    setOpenAgreementForm,
    rentalRecordData,
    acceptInvitation,
  } = props;
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState<"one" | "two">("one");
  const currentUserKYC = useAppSelector(selectUserKYC);
  const { saveUserKYC, loadUserKYC } = useRentalRecords();

  const closeForm = () => {
    setOpenAgreementForm(false);
  };

  const gotoStageOne = () => {
    setStage("one");
  };

  const [uploadingID, setUploadingID] = useState(false);
  const [submittingKYC, setSubmittingKYC] = useState(false);
  const [submittingAgreement, setSubmittingAgreement] = useState(false);

  useEffect(() => {
    (async () => {
      await loadUserKYC();
    })();
  }, []);

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
      {stage === "one" && (
        <form
          onReset={closeForm}
          onSubmit={onSubmitFormOne()}
          className="bg-white fixed h-screen w-screen top-0 left-0 flex flex-col justify-between z-50"
        >
          <div className="h-20 w-full border-b flex justify-between items-center p-3">
            <h1 className="lg:text-3xl text-2xl">Tenant Form</h1>
            <div className="flex ml-auto item-center gap-x-5">
              <button
                disabled={submittingKYC}
                className="text-red-500"
                onClick={closeForm}
              >
                close
              </button>
              <button
                disabled={submittingKYC}
                className="text-green-500 flex"
                type="submit"
              >
                submit{" "}
                {submittingKYC && <ActivityIndicator color="green-500" />}
              </button>
            </div>
          </div>

          <div className="flex-1 w-full p-6 overflow-y-scroll">
            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      Verified Valid Means of I.D. *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <select
                      required
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            idType: e.target.value as AcceptableIDs,
                          })
                        );
                      }}
                      defaultValue={currentUserKYC.idType}
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      id="idType"
                    >
                      <option value="Driver's License">Driver's License</option>
                      <option value="Permanent Voter's Card">
                        Permanent Voter's Card
                      </option>
                      <option value="National Identification Number (NIN)">
                        National Identification Number (NIN)
                      </option>
                      <option value="International Passport.">
                        International Passport.
                      </option>
                      <option value="Residence/Work Permit (For Foreigners)">
                        Residence/Work Permit (For Foreigners)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      Upload Means of ID *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <label htmlFor="meansOfId">
                      <input
                        className="w-0 h-0 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                        type="file"
                        placeholder="johndoe@flex.co"
                        accept="image/jpeg,image/gif,image/png,application/pdf"
                        id="meansOfId"
                        onChange={handleUploadMeansOfID()}
                      />
                      <small className="text-grey-500 underline underline-offset-4">
                        {currentUserKYC.meansOfId ? "Change" : "Choose"} file{" "}
                        <FontAwesomeIcon icon={faFolderOpen} />
                      </small>
                    </label>

                    <div className="flex items-center">
                      {currentUserKYC.meansOfId && (
                        <small>
                          <a
                            href={currentUserKYC.meansOfId}
                            className="text-blue-500 underline underline-offset-4"
                            target="_blank"
                          >
                            {currentUserKYC.idType || "file"}{" "}
                            <FontAwesomeIcon icon={faExternalLink} />
                          </a>
                        </small>
                      )}
                    </div>
                    <div className="flex items-center">
                      <small>Accepting jpeg, gif, png, or pdf</small>
                      {uploadingID && (
                        <svg
                          className="animate-spin h-3 w-3 mr-3 rounded-full border-t-2 border-r-2 border-green-500 ml-2"
                          viewBox="0 0 24 24"
                        ></svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      MOVE-IN DATE *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="date"
                      id="moveInDate"
                      defaultValue={
                        new Date(currentUserKYC.moveInDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ moveInDate: e.target.valueAsNumber })
                        );
                      }}
                    />
                    <small>When do you intend to move in?</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      TELEPHONE NUMBER *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="tel"
                      id="tenantPhone"
                      autoComplete="tel"
                      defaultValue={currentUserKYC.tenantPhone}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ tenantPhone: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      YOUR CURRENT RESIDENCE *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="tenantCurrentAddress"
                      autoComplete="street-address"
                      defaultValue={currentUserKYC.tenantCurrentAddress}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            tenantCurrentAddress: e.target.value,
                          })
                        );
                      }}
                    />
                    <small>Your current residence address</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      HAVE YOU GIVEN LEGAL NOTICE TO VACATE? *
                    </p>
                  </div>

                  <div className="w-full md:flex-1 p-3">
                    <select
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      id="readyToLeaveCurrentAddress"
                      defaultValue={currentUserKYC.readyToLeaveCurrentAddress}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            readyToLeaveCurrentAddress: e.target
                              .value as YesOrNo,
                          })
                        );
                      }}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      Current Resident type.
                    </p>
                  </div>

                  <div className="w-full md:flex-1 p-3">
                    <select
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      id="currentResidenceType"
                      defaultValue={currentUserKYC.currentResidenceType}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentResidenceType: e.target.value as RentOrOwn,
                          })
                        );
                      }}
                    >
                      <option value="Rent">Rent</option>
                      <option value="Own">Own</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      Current Residence MOVE-IN DATE
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="date"
                      id="currentResidenceMoveInDate"
                      placeholder="Select "
                      defaultValue={
                        currentUserKYC.currentResidenceMoveInDate
                          ? new Date(currentUserKYC.currentResidenceMoveInDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentResidenceMoveInDate: e.target.valueAsNumber,
                          })
                        );
                      }}
                    />
                    <small>Date you moved into your current residence.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      Current Residence MOVE-OUT DATE
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="date"
                      id="currentResidenceMoveOutDate"
                      defaultValue={
                        currentUserKYC.currentResidenceMoveOutDate
                          ? new Date(currentUserKYC.currentResidenceMoveOutDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentResidenceMoveOutDate: e.target.valueAsNumber,
                          })
                        );
                      }}
                    />
                    <small>Date you moved out of your current residence.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      LANDLORD/MTG. COMPANY
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="currentResidenceOwner"
                      defaultValue={currentUserKYC.currentResidenceOwner}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentResidenceOwner: e.target.value,
                          })
                        );
                      }}
                    />
                    <small>Your current Landlord or Management company.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      LANDLORD / MANAGEMENT COMPANY PHONE & ADDRESS:
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="currentResidenceOwnerContact"
                      defaultValue={currentUserKYC.currentResidenceOwnerContact}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentResidenceOwnerContact: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      REASON FOR VACATING YOUR PREVIOUS RESIDENCE:
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="reasonForLeavingcurrentResidence"
                      defaultValue={
                        currentUserKYC.reasonForLeavingcurrentResidence
                      }
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            reasonForLeavingcurrentResidence: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="lg:text-3xl text-2xl">EMPLOYMENT DETAILS</h1>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      NAME OF CURRENT EMPLOYER
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="currentEmployerName"
                      defaultValue={currentUserKYC.currentEmployerName}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ currentEmployerName: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      POSITION
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="currentEmploymentPosition"
                      defaultValue={currentUserKYC.currentEmploymentPosition}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentEmploymentPosition: e.target.value,
                          })
                        );
                      }}
                    />
                    <small>Your position at your current job.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      SALARY / MONTH (₦)
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <CurrencyInput
                      id="currentMonthlySalary"
                      defaultValue={currentUserKYC.currentMonthlySalary}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            currentMonthlySalary: e.target.valueAsNumber,
                          })
                        );
                      }}
                      name="currentMonthlySalary"
                      placeholder="₦ 500,000.00"
                      decimalsLimit={2}
                      onValueChange={(value, name) => {}}
                      prefix="₦ "
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="lg:text-3xl text-2xl">
              REFEREES AND EMERGENCY CONTACT
            </h1>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      EMERGENCY CONTACT *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="tel"
                      id="emergencyContact"
                      defaultValue={currentUserKYC.emergencyContact}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ emergencyContact: e.target.value })
                        );
                      }}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl">REFEREE 1</h2>
            <small>
              Do not include other applicants, relatives or partner.
            </small>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      FULL NAME *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee1Name"
                      defaultValue={currentUserKYC.referee1Name}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee1Name: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      RELATIONSHIP *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee1Relationship"
                      defaultValue={currentUserKYC.referee1Relationship}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            referee1Relationship: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      PHONE *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="tel"
                      id="referee1Contact"
                      defaultValue={currentUserKYC.referee1Contact}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee1Contact: e.target.value })
                        );
                      }}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      EMAIL *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="email"
                      id="referee1Email"
                      defaultValue={currentUserKYC.referee1Email}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee1Email: e.target.value })
                        );
                      }}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      OCCUPATION / DESIGNATION *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee1Occupation"
                      defaultValue={currentUserKYC.referee1Occupation}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee1Occupation: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      OFFICE ADDRESS *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee1Address"
                      defaultValue={currentUserKYC.referee1Address}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee1Address: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl">REFEREE 2</h2>
            <small>
              Do not include other applicants, relatives or partner.
            </small>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      FULL NAME
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee2Name"
                      defaultValue={currentUserKYC.referee2Name}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee2Name: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      RELATIONSHIP
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee2Relationship"
                      defaultValue={currentUserKYC.referee2Relationship}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            referee2Relationship: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      PHONE
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="tel"
                      id="referee2Contact"
                      defaultValue={currentUserKYC.referee2Contact}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee2Contact: e.target.value })
                        );
                      }}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      EMAIL
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="email"
                      id="referee2Email"
                      defaultValue={currentUserKYC.referee2Email}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee2Email: e.target.value })
                        );
                      }}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      OCCUPATION / DESIGNATION
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee2Occupation"
                      defaultValue={currentUserKYC.referee2Occupation}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee2Occupation: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      OFFICE ADDRESS
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="referee2Address"
                      defaultValue={currentUserKYC.referee2Address}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ referee2Address: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl">GUARANTOR</h2>
            <small>
              Do not include other applicants, relatives or partner.
            </small>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      FULL NAME *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="guarantorName"
                      defaultValue={currentUserKYC.guarantorName}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ guarantorName: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      RELATIONSHIP *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="guarantorRelationship"
                      defaultValue={currentUserKYC.guarantorRelationship}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            guarantorRelationship: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      PHONE *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="tel"
                      id="guarantorContact"
                      defaultValue={currentUserKYC.guarantorContact}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ guarantorContact: e.target.value })
                        );
                      }}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      EMAIL *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="email"
                      id="guarantorEmail"
                      defaultValue={currentUserKYC.guarantorEmail}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ guarantorEmail: e.target.value })
                        );
                      }}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      OCCUPATION / DESIGNATION *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="guarantorOccupation"
                      defaultValue={currentUserKYC.guarantorOccupation}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ guarantorOccupation: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      OFFICE ADDRESS *
                    </p>
                  </div>
                  <div className="w-full md:flex-1 p-3">
                    <input
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      type="text"
                      id="guarantorAddress"
                      defaultValue={currentUserKYC.guarantorAddress}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({ guarantorAddress: e.target.value })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="lg:text-3xl text-2xl">
              EVICTION AND OFFENSE HISTORY
            </h1>
            <h2 className="text-2xl">EVICTION</h2>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      HAVE YOU EVER BEEN EVICTED, OR ARE YOU IF YES, PROVIDE
                      DATE(S) AND LOCATION(S): CURRENTLY SUBJECT TO A PENDING
                      EVICTION CASE? *
                    </p>
                  </div>

                  <div className="w-full md:flex-1 p-3">
                    <select
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      id="beenEvictedBefore"
                      defaultValue={currentUserKYC.beenEvictedBefore}
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            beenEvictedBefore: e.target.value as YesOrNo,
                          })
                        );
                      }}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {currentUserKYC.beenEvictedBefore === "yes" && (
              <>
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          LAST EVICTION DATE
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <input
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          type="date"
                          id="lastEvictionDate"
                          defaultValue={
                            currentUserKYC.lastEvictionDate
                              ? new Date(currentUserKYC.lastEvictionDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            dispatch(
                              updateUserKYC({
                                lastEvictionDate: e.target.valueAsNumber,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          LAST EVICTION LOCATION
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <input
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          type="text"
                          id="lastEvictionLocation"
                          defaultValue={currentUserKYC.lastEvictionLocation}
                          onChange={(e) => {
                            dispatch(
                              updateUserKYC({
                                lastEvictionLocation: e.target.value,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <h2 className="text-2xl">OFFENSE</h2>

            <div className="py-6 border-b border-coolGray-100">
              <div className="w-full md:w-9/12">
                <div className="flex flex-wrap -m-3">
                  <div className="w-full md:w-1/3 p-3">
                    <p className="text-sm text-coolGray-800 font-semibold">
                      HAVE YOU OR ANY PERSON WHO WILL OCCUPY THE UNIT EVER BEEN
                      CONVICTED, PLEAD GUILTY, NO-CONTEST OR HAVE CURRENT
                      PENDING CHARGES TO ANY FELONY OR MISDEMEANOR? *
                    </p>
                  </div>

                  <div className="w-full md:flex-1 p-3">
                    <select
                      required
                      className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                      id="associatedWithFelonyOrMisdemeanor"
                      defaultValue={
                        currentUserKYC.associatedWithFelonyOrMisdemeanor
                      }
                      onChange={(e) => {
                        dispatch(
                          updateUserKYC({
                            associatedWithFelonyOrMisdemeanor: e.target
                              .value as YesOrNo,
                          })
                        );
                      }}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {currentUserKYC.associatedWithFelonyOrMisdemeanor === "yes" && (
              <>
                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          DESCRIBE OFFENSE
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <textarea
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          id="felonyOrMisdemeanorDescription"
                          defaultValue={
                            currentUserKYC.felonyOrMisdemeanorDescription
                          }
                          onChange={(e) => {
                            dispatch(
                              updateUserKYC({
                                felonyOrMisdemeanorDescription: e.target.value,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-b border-coolGray-100">
                  <div className="w-full md:w-9/12">
                    <div className="flex flex-wrap -m-3">
                      <div className="w-full md:w-1/3 p-3">
                        <p className="text-sm text-coolGray-800 font-semibold">
                          DATE OF OFFENSE
                        </p>
                      </div>
                      <div className="w-full md:flex-1 p-3">
                        <input
                          required
                          className="w-full px-4 py-2.5 text-base text-coolGray-900 font-normal outline-none focus:border-green-500 border border-coolGray-200 rounded-lg shadow-input"
                          type="date"
                          id="felonyOrMisdemeanorDate"
                          defaultValue={
                            currentUserKYC.felonyOrMisdemeanorDate
                              ? new Date(currentUserKYC.felonyOrMisdemeanorDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            dispatch(
                              updateUserKYC({
                                felonyOrMisdemeanorDate: e.target.valueAsNumber,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-20 w-full border-t flex justify-between p-3 gap-3 ">
            <button
              type="reset"
              className="flex-1 disabled:bg-gray-500 disabled:border-gray-600 lg:w-auto p-2 text-sm text-white font-medium bg-red-500 hover:bg-red-600 border border-red-600 rounded-md shadow-button flex items-center justify-center gap-x-2"
              disabled={submittingKYC}
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 disabled:bg-gray-500 disabled:border-gray-600 lg:w-auto p-2 text-sm text-white font-medium bg-green-500 hover:bg-green-600 border border-green-600 rounded-md shadow-button flex items-center justify-center gap-x-2"
              disabled={submittingKYC}
            >
              Submit {submittingKYC && <ActivityIndicator />}
            </button>
          </div>
        </form>
      )}
      {stage === "two" && (
        <form
          onReset={gotoStageOne}
          onSubmit={onSubmitFormTwo()}
          className="bg-white fixed h-screen w-screen top-0 left-0 flex flex-col justify-between z-50"
        >
          <div className="h-20 w-full border-b flex justify-between items-center p-3">
            <h1 className="lg:text-3xl text-2xl">DECLARATION</h1>

            <div className="flex ml-auto item-center gap-x-5">
              <button
                disabled={submittingAgreement}
                className="text-red-500 "
                onClick={gotoStageOne}
              >
                Go back
              </button>
              <button
                disabled={submittingAgreement}
                className="text-green-500 flex"
                type="submit"
              >
                I Agree{" "}
                {submittingAgreement && <ActivityIndicator color="green-500" />}
              </button>
            </div>
          </div>

          <div className="flex-1 w-full p-6 overflow-y-scroll lg:text-2xl lg:leading-10">
            I, the Applicant, hereby offer to rent the property from the owner
            under a lease to be prepared by the Agent. Should this application
            be approved, I acknowledge that I will be required to pay the
            following amount: {formatPrice(rentalRecordData.rent)} rent per{" "}
            {rentalRecordData.rentPer} (which may be subject to review). I
            acknowledge that this application is subject to the approval of the
            owner. I declare that all information contained in this application
            is true and correct and given of my own free will. I declare that I
            have inspected the premises and am satisfied with the current
            condition and cleanliness of the property. I acknowledge that my
            personal contents insurance is not covered under any lessor
            insurance policy/s and understand that it is my responsibility to
            insure my own personal belongings. I acknowledge and accept that if
            this application is denied, the agent is not legally obliged to
            provide reasons. I certify that the above information is correct and
            complete and hereby authorize you to do a credit check and make any
            inquiries you feel necessary to evaluate my tenancy and credit
            standing. I understand that giving incomplete or false information
            is grounds for rejection of this application. If any information
            supplied on this application is later found to be false, this is
            grounds for termination of tenancy. Applicant screening entails the
            checking of the applicant’s credit, rental history, employment
            history, public records and other criteria for residency.
          </div>

          <div className="h-20 w-full border-t flex justify-between p-3 gap-3 ">
            <button
              type="reset"
              className="flex-1 disabled:bg-gray-500 disabled:border-gray-600 lg:w-auto p-2 text-sm text-white font-medium bg-red-500 hover:bg-red-600 border border-red-600 rounded-md shadow-button flex items-center justify-center gap-x-2"
              disabled={submittingAgreement}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 disabled:bg-gray-500 disabled:border-gray-600 lg:w-auto p-2 text-sm text-white font-medium bg-green-500 hover:bg-green-600 border border-green-600 rounded-md shadow-button flex items-center justify-center gap-x-2"
              disabled={submittingAgreement}
            >
              I Agree {submittingAgreement && <ActivityIndicator />}
            </button>
          </div>
        </form>
      )}
    </Transition>
  );

  function onSubmitFormTwo() {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmittingAgreement(true);
      await acceptInvitation()
        .finally(() => {
          setSubmittingAgreement(false);
        })
        .then(() => {
          closeForm();
        });
    };
  }

  function onSubmitFormOne() {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmittingKYC(true);
      await saveUserKYC(currentUserKYC)
        .finally(() => {
          setSubmittingKYC(false);
        })
        .then(() => {
          setStage("two");
        });
    };
  }

  function handleUploadMeansOfID() {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const fileUploaded = e.target.files[0];
        setUploadingID(true);
        const url = await UploadPhotoAsync(
          `/userKYC/${Date.now()}-${fileUploaded.name}`,
          fileUploaded
        )
          .finally(() => {
            setUploadingID(false);
          })
          .catch(() => {
            toast.error("Error uploading file.");
          });
        if (url) {
          dispatch(updateUserKYC({ meansOfId: url }));
        }
      }
    };
  }
}
