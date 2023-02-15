import { toast } from "react-toastify";
import ActivityIndicator from "./ActivityIndicator";

type DetailsBoxProps = {
  label: string;
  value: string | number | any;
  loading?: boolean;
  isLink?: boolean;
  link?: string;
};

export default function DetailsBox(props: DetailsBoxProps) {
  const { label, value, loading, isLink, link } = props;
  return (
    <div className="mb-3">
      <p className="text-xs font-medium text-coolGray-500 ">{label}</p>
      {isLink ? (
        <h3 className="mb-1 font-medium text-lg  flex text-blue-500 underline gap-2 gap-x-3 w-full items-center">
          <span>
            {loading ? <ActivityIndicator color="black" /> : value || "--"}
          </span>{" "}
          <div className="ml-auto"></div>
          <small
            className="text-blue-500 cursor-pointer print:hidden"
            onClick={() => {
              navigator.clipboard.writeText(link || value).then(() => {
                toast.success("Link copied to clipboard.");
              });
            }}
          >
            Copy link
          </small>
          <small>
            <a
              className="text-blue-500 cursor-pointer print:hidden"
              href={link}
              target="_blank"
            >
              Open link
            </a>
          </small>
        </h3>
      ) : (
        <h3 className="mb-1 font-medium text-lg text-coolGray-900 flex">
          {loading ? <ActivityIndicator color="black" /> : value || "--"}
        </h3>
      )}
    </div>
  );
}
