import { Modal, Select } from "antd";
import { useState } from "react";
import {
  selectProperty,
  updateNewProperty,
} from "../../app/features/propertySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import useProperties from "../../hooks/useProperties";

export function ExisitingLandLords({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  handleOk: () => void;
  closeModal: () => void;
}) {
  const { loadingLandlords } = useProperties();
  const { landlords } = useAppSelector(selectProperty);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState("");

  const onChange = (value: string) => {
    setSelected(value);
  };

  const onOkay = () => {
    const selectedLandlord = landlords.find((i) => i.id === selected);
    if (selectedLandlord) {
      dispatch(
        updateNewProperty({
          landLordContactPhoneNumber:
            selectedLandlord.landLordContactPhoneNumber,
          landLordEmailAddress: selectedLandlord.landLordEmailAddress,
          landLordEmergencyContactInformation:
            selectedLandlord.landLordEmergencyContactInformation,
          landLordFullName: selectedLandlord.landLordFullName,
          landLordMailingAddress: selectedLandlord.landLordMailingAddress,
          landLordPropertyManagementExperience:
            selectedLandlord.landLordPropertyManagementExperience,
          landLordTaxIdentificationNumber:
            selectedLandlord.landLordTaxIdentificationNumber,
        })
      );
    }
    closeModal();
  };

  return (
    <Modal
      title="Select Landlord"
      open={isModalOpen}
      onOk={onOkay}
      onCancel={closeModal}
      okButtonProps={{ className: "bg-blue-500" }}
    >
      {loadingLandlords && <ActivityIndicator size="4" />}

      <Select
        showSearch
        placeholder="Select a person"
        className="w-full my-5"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={landlords.map((i) => {
          return { value: i.id, label: i.landLordFullName };
        })}
      />
    </Modal>
  );
}
