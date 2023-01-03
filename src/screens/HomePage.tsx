import React, { useEffect } from "react";
import HomepageHeader from "../components/homepage/HomepageHeader";
import LogoClouds from "../components/homepage/LogoClouds";
import Features from "../components/homepage/Features";
import Pricing from "../components/homepage/Pricing";
import HomePageCTA from "../components/homepage/HomePageCTA";
import Footer from "../components/shared/Footer";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../app/features/userSlice";

export default function HomePage() {
  const loggedInUser = useAppSelector(selectUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedInUser?.email) {
      navigate("/dashboard?tab=rentalRecords");
    }
  }, [loggedInUser, navigate]);

  return (
    <div>
      <div className="">
        <HomepageHeader />
        <LogoClouds />
        <Features />
        <Pricing />
        <HomePageCTA />
        <Footer />
      </div>
    </div>
  );
}
