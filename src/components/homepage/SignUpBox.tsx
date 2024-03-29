import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { ReactComponent as FlexUIGreenLight } from "../../assets/logo-no-background.svg";
import { Link } from "react-router-dom";

export default function SignUpBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignInUser, signingIn } = useAuth();

  const onSubmitSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignInUser(email, password);
  };

  return (
    <div className="w-full lg:w-1/2">
      <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:ml-auto rounded-4xl shadow-2xl">
        <FlexUIGreenLight className="relative -top-2 -mt-16 mb-6 h-16" />
        <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
          Sign in to your Account
        </h2>
        <h3 className="mb-7 text-base md:text-lg text-coolGray-500 font-medium text-center">
          Sign In
        </h3>

        <form action="" onSubmit={onSubmitSignIn} className="w-full">
          <span className="mb-1 text-coolGray-800 font-medium">Email</span>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <input
              className="w-full outline-none leading-5 text-coolGray-400 font-normal"
              type="email"
              placeholder="name@email.com"
              required
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <svg
              className="h-6 w-6 ml-4 my-auto text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              ></path>
            </svg>
          </div>
          <span className="mb-1 text-coolGray-800 font-medium">Password</span>
          <div className="mb-4 flex p-4 py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm">
            <input
              className="w-full outline-none leading-5 text-coolGray-400 font-normal"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              defaultValue={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>
              <svg
                className="h-6 w-6 ml-4 my-auto text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="text-center">
            <button className="mb-4 flex justify-center py-3 px-7 w-full leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md">
              {signingIn ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 rounded-full border-t-2 border-r-2 border-white ml-2"
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-coolGray-400 font-medium text-center">
          <span>Don't have an account?</span>{" "}
          <Link to={"/auth"} className="text-green-500 hover:text-green-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
