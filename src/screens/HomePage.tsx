import { useEffect } from "react";
import HomepageHeader from "../components/homepage/HomepageHeader";
import Features from "../components/homepage/Features";
import Pricing from "../components/homepage/Pricing";
import HomePageCTA from "../components/homepage/HomePageCTA";
import Footer from "../components/shared/Footer";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../app/features/userSlice";
import { manageUserWithDefaultCompany } from "../firebase/apis/manageUserWithDefaultCompany";
import { selectCompanies } from "../app/features/companySlice";
import { useDispatch } from "react-redux";

export default function HomePage() {
  const loggedInUser = useAppSelector(selectUser);
  const navigate = useNavigate();
  const companies = useAppSelector(selectCompanies);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedInUser?.email) {
      manageUserWithDefaultCompany(loggedInUser, companies, dispatch, navigate);
    }
  }, [loggedInUser, navigate]);

  return (
    <div>
      <div className="">
        <HomepageHeader />
        {/* <LogoClouds /> */}
        <Features />
        <Pricing />
        <HomePageCTA />
        <Footer />
      </div>
    </div>
  );
}
