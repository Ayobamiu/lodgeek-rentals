import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addCompany, setSelectedCompany } from "../app/features/companySlice";
import { selectUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import AppInput from "../components/shared/AppInput";
import { createCompany } from "../firebase/apis/company";
import { generateFirebaseId } from "../firebase/config";
import useQuery from "../hooks/useQuery";
import { Company, CompanyRole, FirebaseCollections } from "../models";
import base64 from "base-64";

function IndividualRegistrationPage() {
  const navigate = useNavigate();
  let query = useQuery();
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const defaultName = useMemo(
    () =>
      loggedInUser ? `${loggedInUser.lastName} ${loggedInUser.firstName}` : "",
    [loggedInUser]
  );

  const [name, setName] = useState(defaultName);
  const [address, setAddress] = useState("");
  const [size, setSize] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const redirectFromQuery = query.get("redirect") as string;

  return (
    <div className="lg:min-h-screen lg:w-screen lg:flex pt-20 justify-center items-center">
      <div className="w-full lg:w-1/2 flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:mx-auto rounded-4xl shadow-2xl">
        <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
          Set up your Workspace
        </h2>
        <p className="text-sm font-medium text-center mb-5">
          Please provide us with some basic information about you.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (loggedInUser) {
              const companyData: Company = {
                address,
                createdAt: Date.now(),
                createdBy: loggedInUser.email,
                email: loggedInUser.email,
                id: generateFirebaseId(FirebaseCollections.companies),
                logo: "",
                members: [
                  {
                    dateJoined: Date.now(),
                    email: loggedInUser.email,
                    role: CompanyRole.owner,
                  },
                ],
                name,
                phone: loggedInUser.phone || "",
                primaryOwner: loggedInUser.email,
                registrationNumber: "",
                size,
                team: [loggedInUser.email],
                updatedAt: Date.now(),
                balance: 0,
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
                    // navigate(`/dashboard/${companyData.id}/rentalRecords`);
                    navigate(`/select-plans`);
                  }
                })
                .finally(() => {
                  setSigningIn(false);
                })
                .catch(() => {
                  toast("Error creating company.", { type: "error" });
                });
            }
          }}
          onReset={(e) => {
            e.preventDefault();
            navigate(`/get-started?redirect=${redirectFromQuery || ""}`);
          }}
          className="w-full"
        >
          <label className="mb-1 text-coolGray-800 font-medium" htmlFor="name">
            Do you using a professional alias? Your lease agreements and
            documents will reflect this.
          </label>

          <AppInput
            required
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Professional alias"
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
            placeholder="Address"
          />

          <label
            className="mb-1 text-coolGray-800 font-medium"
            htmlFor="registrationNumber"
          >
            Are you part of a team? How many individuals make up your team?
          </label>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <select
              value={size}
              required
              onChange={(e) => setSize(e.target.value)}
              className="w-full outline-none leading-5 text-coolGray-400 font-normal"
            >
              <option value="">Select team size</option>
              <option value="1-50">Just me</option>
              <option value="1-50">Team of 1-50 members</option>
              <option value="51-100">Team of 51-100 members</option>
              <option value="101-500">Team of 101-500 members</option>
              <option value="501-1000">Team of 501-1000 members</option>
              <option value="1000+">Team of 1000+ members</option>
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
              "Set up my workspace"
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

export default IndividualRegistrationPage;
