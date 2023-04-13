import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { selectRentalRecord } from "../../app/features/rentalRecordSlice";
import {
  resetCurrentRentReview,
  selectRentReview,
  setCurrentRentReview,
  updateCurrentRentReview,
} from "../../app/features/rentReviewSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import { getRentReview } from "../../firebase/apis/rentReview";
import { ReveiwFormDetails } from "../../models";
import { RentReviewProcessThree } from "./RentReviewProcessThree";
import { RentReviewProcessTwo } from "./RentReviewProcessTwo";
import { RentReviewProcessOne } from "./RentReviewProcessOne";
import ActivityIndicator from "../../components/shared/ActivityIndicator";

const RentReviewpage = () => {
  let { id, reviewId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goBack = () => {
    navigate(`/dashboard/rentalRecords/${id}`);
  };

  const [fetchingReview, setFetchingReview] = useState(false);
  const { currentRentReview } = useAppSelector(selectRentReview);
  const {
    currentRentalRecord,
    currentRentalRecordProperty,
    currentRentalRecordTenant,
  } = useAppSelector(selectRentalRecord);

  const updateReveiwFormDetails = (data: Partial<ReveiwFormDetails>) => {
    const updatedReveiwFormDetails: ReveiwFormDetails = {
      ...currentRentReview.reveiwFormDetails,
      ...data,
    };

    dispatch(
      updateCurrentRentReview({
        reveiwFormDetails: updatedReveiwFormDetails,
      })
    );
  };

  async function fetchRentReview(reviewId: string) {
    setFetchingReview(true);
    await getRentReview(reviewId)
      .then((reviewResponse) => {
        if (reviewResponse) {
          dispatch(setCurrentRentReview(reviewResponse));
        } else {
          toast.error("Review details not found");
          navigate(`/dashboard/rentalRecords/${id}`, { replace: true });
        }
      })
      .finally(() => {
        setFetchingReview(false);
      });
  }

  useEffect(() => {
    if (reviewId) {
      fetchRentReview(reviewId);
    } else {
      dispatch(
        updateCurrentRentReview({
          property: currentRentalRecord.property,
          company: currentRentalRecord.company,
          tenant: currentRentalRecord.tenant,
          owner: currentRentalRecord.owner,
          rentalRecord: id,
        })
      );
      updateReveiwFormDetails({
        address: currentRentalRecordProperty?.address,
        tenantName: `${currentRentalRecordTenant?.firstName} ${currentRentalRecordTenant?.lastName}`,
        currentRentAmount: currentRentalRecord.rent,
      });
    }
    return () => {
      dispatch(resetCurrentRentReview());
    };
  }, [id, reviewId]);

  return (
    <DashboardWrapper>
      <div className="mx-auto max-w-3xl py-5">
        <button onClick={goBack} className="flex items-center gap-x-3 mb-3">
          <FontAwesomeIcon icon={faAngleLeft} /> <p>Go back</p>
        </button>
        <h2 className="font-semibold text-black text-3xl mb-5 flex gap-x-3 items-center">
          Rent Review Process {fetchingReview && <ActivityIndicator size="6" />}
        </h2>
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          <RentReviewProcessOne />
          <RentReviewProcessTwo />
          <RentReviewProcessThree />
        </ol>
        <div className="text-xs font-medium text-coolGray-500 my-10 text-center">
          Please note that all collaborators to this rental record have access
          to this rent review process. Kindly ensure that all comments and
          proposals are made with this in mind.
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default RentReviewpage;
