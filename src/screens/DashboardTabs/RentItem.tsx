import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Rent, RentStatus } from "../../models";
import { rentSelected } from "./RentalRecordDetails";

type RentItemProps = {
  index: number;
  showPayRentButton: boolean;
  rent: Rent;
  selectedRents: Rent[];
  setSelectedRents: React.Dispatch<React.SetStateAction<Rent[]>>;
};

function getStatusColor(status: RentStatus) {
  return status ===
    RentStatus["Late - Due date has passed and rent has not been paid."]
    ? "bg-red-500"
    : status === RentStatus["Pending - Tenant has not started the rent."]
    ? "bg-yellow-500"
    : status === RentStatus["Paid - Rent has been paid."]
    ? "bg-[green]"
    : "bg-gray-500";
}
const RentStatusItem = ({ status }: { status: RentStatus }) => (
  <div
    className={`p-1 text-xs text-white font-bold shadow-sm rounded ${getStatusColor(
      status
    )}`}
  >
    {status}
  </div>
);

export function RentItem(props: RentItemProps): JSX.Element {
  const { index, rent, selectedRents, setSelectedRents, showPayRentButton } =
    props;
  return (
    <button
      key={index}
      onClick={() => {
        const rentNotClickable = !showPayRentButton || rent.status === "paid";
        if (rentNotClickable) return;
        if (rentSelected(selectedRents, rent)) {
          setSelectedRents((v) => [...v].filter((i) => i.id !== rent.id));
        } else {
          setSelectedRents((v) => [...v, rent]);
        }
      }}
      className="flex items-center bg-gray-300 lg:px-3 px-2 lg:gap-3 gap-2 rounded lg:min-w-[300px] min-w-full relative min-h-[50px]"
    >
      {!(!showPayRentButton || rent.status === "paid") && (
        <FontAwesomeIcon
          icon={faCheckCircle}
          color={rentSelected(selectedRents, rent) ? "green" : "black"}
          className=""
        />
      )}

      <p key={index} className="text-lg font-medium text-coolGray-500 ">
        {moment(rent.dueDate).format("MMM YYYY")}
      </p>
      <div className="ml-auto">
        <RentStatusItem status={rent.status} />
      </div>
    </button>
  );
}
