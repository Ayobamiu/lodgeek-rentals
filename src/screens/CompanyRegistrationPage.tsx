import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addCompany, setSelectedCompany } from "../app/features/companySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import AppInput from "../components/shared/AppInput";
import { createCompany } from "../firebase/apis/company";
import { generateFirebaseId } from "../firebase/config";
import { UploadPhotoAsync } from "../firebase/storage_upload_blob";
import useQuery from "../hooks/useQuery";
import { Company, CompanyRole, FirebaseCollections } from "../models";
import PhoneInput from "react-phone-input-2";
import { sendToken, verifyToken } from "../api/phone";
import base64 from "base-64";

function CompanyRegistrationPage() {
  const navigate = useNavigate();
  let query = useQuery();
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [logo, setLogo] = useState("");
  const [size, setSize] = useState("");

  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [sendingVerificationCode, setSendingVerificationCode] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [openVerificationPanel, setOpenVerificationPanel] = useState(false);

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

  const onClickVerifyPhone = async () => {
    setSendingVerificationCode(true);
    await sendToken(phone)
      .finally(() => {
        setSendingVerificationCode(false);
      })
      .then(() => {
        setOpenVerificationPanel(true);
      });
  };

  const onClickVerifyToken = async () => {
    setPhoneVerified(false);
    setVerifyingPhone(true);
    await verifyToken(verificationCode)
      .finally(() => {
        setVerifyingPhone(false);
      })
      .then(() => {
        setPhoneVerified(true);
        setOpenVerificationPanel(false);
      });
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
            role: CompanyRole.owner,
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

  const onReset = (e: any) => {
    e.preventDefault();
    navigate(`/get-started?redirect=${redirectFromQuery || ""}`);
  };

  return (
    <div className="lg:min-h-screen lg:w-screen lg:flex pt-20 justify-center items-center">
      <div className="w-full lg:w-1/2 flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:mx-auto rounded-4xl shadow-2xl">
        <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
          Company Registration
        </h2>
        <p className="text-sm font-medium text-center mb-2">
          Please provide us with some basic information about your company.
        </p>
        <form onSubmit={onSubmit} onReset={onReset} className="w-full">
          <label
            htmlFor="logo"
            className="w-full flex justify-center items-center cursor-pointer"
          >
            {logo ? (
              <img
                src={logo}
                alt="Company logo"
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
            Company Name:
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

          <div className="mb-4 flex items-stretch leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <PhoneInput
              country={"ng"}
              onlyCountries={["ng"]}
              containerClass="border-none "
              inputClass="h-full custom-phone-input"
              countryCodeEditable={false}
              autoFormat
              value={phone}
              onChange={(value, _data, _e, _formatedValue) => {
                setPhoneVerified(false);
                setPhone(value);
              }}
            />

            <button
              type="button"
              onClick={onClickVerifyPhone}
              disabled={
                phoneVerified || sendingVerificationCode || verifyingPhone
              }
              className="flex rounded-l-none justify-center py-3 px-7  w-[100px] leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 disabled:bg-gray-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
            >
              {sendingVerificationCode ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                  viewBox="0 0 24 24"
                ></svg>
              ) : phoneVerified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </button>
          </div>
          {openVerificationPanel && (
            <div className="flex bg-gray-100 p-5 gap-5  rounded-lg">
              <input
                className="w-full outline-none leading-5 text-coolGray-400 font-normal border bg-transparent rounded-lg  p-4 py-3 px-3 "
                type="text"
                typeof="text"
                placeholder="Verification code"
                defaultValue={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                }}
                datatype="text"
                inputMode="numeric"
              />

              <button
                type="button"
                onClick={onClickVerifyToken}
                className="flex  justify-center py-3 px-7  w-[100px] leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
              >
                {verifyingPhone ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                    viewBox="0 0 24 24"
                  ></svg>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          )}

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

          <label
            className="mb-1 text-coolGray-800 font-medium"
            htmlFor="registrationNumber"
          >
            Company Size:
          </label>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <select
              value={size}
              required
              onChange={(e) => setSize(e.target.value)}
              className="w-full outline-none leading-5 text-coolGray-400 font-normal"
            >
              <option value="">Select Size</option>
              <option value="1-50">1-50 employees</option>
              <option value="51-100">51-100 employees</option>
              <option value="101-500">101-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

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
              "Register"
            )}
          </button>
          <button
            type="reset"
            className="mb-4 flex justify-center py-3 px-7 w-full leading-6 text-green-500 font-medium text-center border border-green-500 hover:border-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyRegistrationPage;
