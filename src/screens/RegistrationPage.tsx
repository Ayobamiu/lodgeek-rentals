import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, updateUser } from "../app/features/userSlice";
import { useAppSelector } from "../app/hooks";
import { updateUserInDatabase } from "../firebase/apis/user";
import useQuery from "../hooks/useQuery";
import { UserType } from "../models";

function RegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useAppSelector(selectUser);

  let query = useQuery();
  const redirectFromQuery = query.get("redirect") as string;

  const [userType, setUserType] = useState<UserType | undefined>(
    loggedInUser?.userType
  );

  useEffect(() => {
    setUserType(loggedInUser?.userType);
  }, [loggedInUser]);

  const [updating, setUpdating] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (loggedInUser) {
      setUpdating(true);
      const updatedUser = { ...loggedInUser, userType };
      await updateUserInDatabase(updatedUser)
        .then(() => {
          dispatch(updateUser(updatedUser));
          if (userType === UserType.individual) {
            navigate(
              `/individual-registration?redirect=${redirectFromQuery || ""}`
            );
          } else if (userType === UserType.company) {
            navigate(
              `/company-registration?redirect=${redirectFromQuery || ""}`
            );
          }
        })
        .finally(() => {
          setUpdating(false);
        });
    }
  };
  return (
    <div className="lg:min-h-screen lg:w-screen lg:flex pt-20 justify-center items-center">
      <div className="w-full lg:w-1/2 ">
        <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:mx-auto rounded-4xl shadow-2xl">
          <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
            Registration Page
          </h2>
          <p className="text-sm   font-medium text-center">
            Please select whether you are registering as an individual or a
            company by clicking on the respective button below.
          </p>
          <form className="w-full" onSubmit={onSubmit}>
            <div className="text-lg text-coolGray-400 font-medium  my-5">
              <label>
                <input
                  type="radio"
                  name="userType"
                  required
                  value={UserType.individual}
                  checked={userType === UserType.individual}
                  onChange={(e) => {
                    setUserType(e.target.value as UserType);
                  }}
                  className="mx-3"
                />
                Individual
              </label>
            </div>
            <div className="text-lg text-coolGray-400 font-medium  my-5">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value={UserType.company}
                  checked={userType === UserType.company}
                  onChange={(e) => {
                    setUserType(e.target.value as UserType);
                  }}
                  className="mx-3"
                />
                Company
              </label>
              <p className="text-sm text-coolGray-400 font-medium mt-2">
                As a company, you will need to provide the company's name, email
                address, and phone number. In addition, we will require the
                company's registration number and other relevant details.
              </p>
            </div>

            <button
              type="submit"
              className="mb-4 flex justify-center py-3 px-7 w-full leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
            >
              {updating ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
