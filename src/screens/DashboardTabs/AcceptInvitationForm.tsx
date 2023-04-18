import { Transition } from "@headlessui/react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { Id, toast } from "react-toastify";
import { selectUserKYC } from "../../app/features/rentalRecordSlice";
import { useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useRentalRecords from "../../hooks/useRentalRecords";
import { RentalRecord, UserKYC } from "../../models";
import { DefaultDeclaration } from "./DefaultDeclaration";

type AgreementAndKYCFormProps = {
  openAgreementForm: boolean;
  setOpenAgreementForm: React.Dispatch<React.SetStateAction<boolean>>;
  rentalRecordData: RentalRecord;
  acceptInvitation: (userKYC: UserKYC) => Promise<Id | undefined>;
};

export function AcceptInvitationForm(props: AgreementAndKYCFormProps) {
  const {
    openAgreementForm,
    setOpenAgreementForm,
    rentalRecordData,
    acceptInvitation,
  } = props;

  const currentUserKYC = useAppSelector(selectUserKYC);
  const { loadUserKYC } = useRentalRecords();

  const closeForm = () => {
    setOpenAgreementForm(false);
  };
  const [submittingAgreement, setSubmittingAgreement] = useState(false);
  const [iAgree, setIAgree] = useState(false);

  useEffect(() => {
    (async () => {
      await loadUserKYC();
    })();
  }, []);

  const onChange = (e: CheckboxChangeEvent) => {
    setIAgree(e.target.checked);
  };

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
      <form
        onReset={closeForm}
        onSubmit={onSubmitFormTwo()}
        className="bg-white fixed h-screen w-screen top-0 left-0 flex flex-col justify-between z-50"
      >
        <div className="h-20 w-full border-b flex justify-between items-center p-3">
          <h1 className="lg:text-3xl text-2xl">Sign Lease</h1>

          <div className="flex ml-auto item-center gap-x-5">
            <button
              type="reset"
              disabled={submittingAgreement}
              className="text-red-500 "
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
        <div className=" p-5 overflow-scroll">
          <div className="max-w-3xl  mx-auto">
            <p>
              Please read the lease agreement carefully and check the box below
              to indicate your agreement and acceptance of the terms.
            </p>
            <br />
            <p>
              Please note that the lease agreement is a legally binding
              document, and you should seek legal advice if you have any
              questions or concerns about its contents.
            </p>
            <br />
            <p>
              If you have any questions or need further assistance, please do
              not hesitate to contact our property management team.
            </p>
            <br />
            {/* {rentalRecordData.tenancyAgreementFile ? (
              <embed
                src={rentalRecordData.tenancyAgreementFile}
                width="100%"
                height="500px"
                className="mx-auto border"
              />
            ) : (
              <DefaultDeclaration rentalRecordData={rentalRecordData} />
              )} */}
            <DefaultDeclaration rentalRecordData={rentalRecordData} />

            <Checkbox onChange={onChange} value={iAgree}>
              By checking this box, you acknowledge that you have read and
              understood the lease agreement and agree to be bound by its terms
              and conditions. You also agree to pay rent as specified in the
              lease agreement and to comply with all rules and regulations of
              the property.
            </Checkbox>
          </div>
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
    </Transition>
  );

  function onSubmitFormTwo() {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!iAgree) {
        return toast.error("Check the box to agree to lease.");
      }
      setSubmittingAgreement(true);
      await acceptInvitation(currentUserKYC)
        .finally(() => {
          setSubmittingAgreement(false);
        })
        .then(() => {
          closeForm();
        });
    };
  }
}
