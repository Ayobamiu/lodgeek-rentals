import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addCompany,
  selectSelectedCompany,
  setSelectedCompany,
} from "../../app/features/companySlice";
import { selectUser } from "../../app/features/userSlice";
import { useAppSelector } from "../../app/hooks";
import AppInput from "../../components/shared/AppInput";
import { createCompany } from "../../firebase/apis/company";
import { generateFirebaseId } from "../../firebase/config";
import { UploadPhotoAsync } from "../../firebase/storage_upload_blob";
import useQuery from "../../hooks/useQuery";
import { Company, FirebaseCollections } from "../../models";
import PhoneInput from "react-phone-input-2";
import { sendToken, verifyToken } from "../../api/phone";
import base64 from "base-64";
import SettingsWrapper from "../../components/settings/SettingsWrapper";

function CompanyProfileEditPage() {
  const navigate = useNavigate();
  let query = useQuery();
  const loggedInUser = useAppSelector(selectUser);
  const selectedCompany = useAppSelector(selectSelectedCompany);
  console.log({ selectedCompany });

  const dispatch = useDispatch();

  const [name, setName] = useState(selectedCompany?.name || "");
  const [email, setEmail] = useState(selectedCompany?.email || "");
  const [phone, setPhone] = useState(selectedCompany?.phone || "");
  const [address, setAddress] = useState(selectedCompany?.address || "");
  const [registrationNumber, setRegistrationNumber] = useState(
    selectedCompany?.registrationNumber || ""
  );
  const [logo, setLogo] = useState(selectedCompany?.logo || "");
  const [size, setSize] = useState(selectedCompany?.size || "");

  const [phoneVerified, setPhoneVerified] = useState(false);

  const [signingIn, setSigningIn] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const redirectFromQuery = query.get("redirect") as string;

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
    if (!phoneVerified) {
      return toast("Verify your phone number!", { type: "info" });
    }

    if (loggedInUser) {
      const companyData: Company = {
        address,
        createdAt: Date.now(),
        createdBy: loggedInUser?.email,
        email,
        id: generateFirebaseId(FirebaseCollections.companies),
        logo,
        members: [
          {
            dateJoined: Date.now(),
            email: loggedInUser.email,
            role: "owner",
          },
        ],
        name,
        phone,
        primaryOwner: loggedInUser.email,
        registrationNumber,
        size,
        team: [loggedInUser.email],
        updatedAt: Date.now(),
      };
      setSigningIn(true);
      await createCompany(companyData)
        .then(() => {
          dispatch(addCompany(companyData));
          dispatch(setSelectedCompany(companyData));
          if (redirectFromQuery) {
            const decodedRedirectUrl = base64.decode(redirectFromQuery);
            navigate(decodedRedirectUrl);
          } else {
            navigate(`/dashboard/${companyData.id}/rentalRecords`);
          }
        })
        .finally(() => {
          setSigningIn(false);
        })
        .catch(() => {
          toast("Error creating company.", { type: "error" });
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
          <label htmlFor="logo" className="cursor-pointer">
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
              className="w-0 h-0"
              disabled={uploadingLogo}
              onChange={handleUploadLogo}
            />
            {uploadingLogo && (
              <svg
                className=" absolute animate-spin h-5 w-5 rounded-full border-t-2 border-r-2 border-green-500 "
                viewBox="0 0 24 24"
              ></svg>
            )}
          </label>
          <label className="mb-1 text-coolGray-800 font-medium" htmlFor="name">
            Account Name:
          </label>

          <AppInput
            required
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
            type="text"
            id="registrationNumber"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />

          <button
            type="submit"
            className="mb-4 flex justify-center py-3 px-7 w-full leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
          >
            {signingIn ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                viewBox="0 0 24 24"
              ></svg>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </SettingsWrapper>
  );
}

export default CompanyProfileEditPage;
