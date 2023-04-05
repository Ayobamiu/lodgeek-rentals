import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  selectSelectedCompany,
  setSelectedCompany,
  updateCompany,
} from "../../app/features/companySlice";
import { useAppSelector } from "../../app/hooks";
import AppInput from "../../components/shared/AppInput";
import { updateCompanyInDatabase } from "../../firebase/apis/company";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import { Company } from "../../models";
import SettingsWrapper from "../../components/settings/SettingsWrapper";
import ActivityIndicator from "../../components/shared/ActivityIndicator";
import { selectUser } from "../../app/features/userSlice";

function CompanyProfileEditPage() {
  const selectedCompany = useAppSelector(selectSelectedCompany);
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const [name, setName] = useState(selectedCompany?.name || "");
  const [email, setEmail] = useState(selectedCompany?.email || "");
  const [phone, setPhone] = useState(selectedCompany?.phone || "");
  const [address, setAddress] = useState(selectedCompany?.address || "");
  const [registrationNumber, setRegistrationNumber] = useState(
    selectedCompany?.registrationNumber || ""
  );
  const [logo, setLogo] = useState(selectedCompany?.logo || "");
  const [updatingCompany, setUpdatingCompany] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const userCanEditProfile =
    loggedInUser?.email === selectedCompany?.primaryOwner;

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fileUploaded = e.target.files[0];
      setUploadingLogo(true);
      const url = await UploadPhotoAsync(
        `/userKYC/${Date.now()}-${fileUploaded.name}`,
        fileUploaded
      )
        .finally(() => {
          setUploadingLogo(false);
        })
        .catch(() => {
          toast.error("Error uploading file.");
        });

      if (url) {
        // dispatch(updateUserKYC({ meansOfId: url }));
        setLogo(url);
      }
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (selectedCompany) {
      const updatedCompanyData: Company = {
        ...selectedCompany,
        updatedAt: Date.now(),
        logo,
        name,
        email,
        phone,
        address,
        registrationNumber,
      };
      setUpdatingCompany(true);
      await updateCompanyInDatabase(updatedCompanyData)
        .then(() => {
          dispatch(updateCompany(updatedCompanyData));
          dispatch(setSelectedCompany(updatedCompanyData));
          toast("Account updated.", { type: "success" });
        })
        .finally(() => {
          setUpdatingCompany(false);
        })
        .catch(() => {
          toast("Error updating account.", { type: "error" });
        });
    }
  };

  return (
    <SettingsWrapper>
      <div className="w-full ">
        <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold ">
          Account Profile
        </h2>

        <form onSubmit={onSubmit} className="w-full">
          <label
            htmlFor="logo"
            className="cursor-pointer disabled:cursor-not-allowed inline-block w-auto"
          >
            {logo ? (
              <img
                src={logo}
                alt="Account logo"
                className="w-20 h-20 rounded-lg bg-gray-300 text-center my-5"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-300 text-center my-5 flex justify-center items-center">
                <FontAwesomeIcon icon={faCamera} size="2x" />
              </div>
            )}
            <input
              type="file"
              name="logo"
              id="logo"
              className="w-0 h-0 disabled:cursor-not-allowed"
              disabled={uploadingLogo || !userCanEditProfile}
              onChange={handleUploadLogo}
            />
            {uploadingLogo && <ActivityIndicator />}
          </label>
          <br />
          <label className="mb-1 text-coolGray-800 font-medium" htmlFor="name">
            Account Name:
          </label>

          <AppInput
            required
            disabled={!userCanEditProfile}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="mb-1 text-coolGray-800 font-medium" htmlFor="email">
            Email:
          </label>
          <AppInput
            required
            disabled={!userCanEditProfile}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="mb-1 text-coolGray-800 font-medium" htmlFor="phone">
            Phone:
          </label>

          <AppInput
            required
            disabled={!userCanEditProfile}
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label
            className="mb-1 text-coolGray-800 font-medium"
            htmlFor="address"
          >
            Address:
          </label>
          <AppInput
            required
            disabled={!userCanEditProfile}
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label
            className="mb-1 text-coolGray-800 font-medium"
            htmlFor="registrationNumber"
          >
            Registration Number:
          </label>
          <AppInput
            required
            disabled={!userCanEditProfile}
            type="text"
            id="registrationNumber"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />

          <button
            type="submit"
            disabled={updatingCompany || !userCanEditProfile}
            className="mb-4 flex justify-center py-3 px-7 w-full leading-6 text-green-50 font-medium text-center bg-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
          >
            {updatingCompany ? <ActivityIndicator /> : "Update"}
          </button>
        </form>
      </div>
    </SettingsWrapper>
  );
}

export default CompanyProfileEditPage;
