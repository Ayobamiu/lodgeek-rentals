import { Property } from "../../models";
import formatPrice from "../../utils/formatPrice";

export default function PropertyItem({
  property,
  onClick,
}: {
  property: Property;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full flex p-2 hover:shadow-sm border-b border-coolGray-100 cursor-pointer gap-3 flex-wrap"
    >
      <img
        className="object-cover w-full rounded-t-lg   md:h-auto  md:w-48 md:rounded-none md:rounded-l-lg"
        src={(property.images && property.images[0]?.url) || ""}
        alt=""
      />

      <div>
        <div className="flex gap-x-3 items-center flex-wrap mb-3">
          <h3 className="w-full lg:w-auto mb-1 font-medium text-lg text-coolGray-900">
            {property.title}
          </h3>
          <p className="w-full lg:w-auto text-xs font-medium text-coolGray-500">
            {formatPrice(property.rent)}/{property.rentPer}
          </p>
        </div>
        <p className="text-xs font-medium text-coolGray-500 ">
          {property.description}
        </p>
        <div className="w-auto py-2">
          <div className="flex flex-wrap items-center">
            <div className="w-auto mr-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2.98667C10.9391 1.92581 9.50028 1.32982 7.99999 1.32982C6.4997 1.32982 5.06086 1.92581 3.99999 2.98667C2.93913 4.04754 2.34314 5.48638 2.34314 6.98667C2.34314 8.48696 2.93913 9.92581 3.99999 10.9867L7.51333 14.5067C7.5753 14.5692 7.64904 14.6188 7.73028 14.6526C7.81152 14.6864 7.89865 14.7039 7.98666 14.7039C8.07467 14.7039 8.1618 14.6864 8.24304 14.6526C8.32428 14.6188 8.39802 14.5692 8.45999 14.5067L12 10.9533C13.0564 9.89689 13.6499 8.46404 13.6499 6.97001C13.6499 5.47597 13.0564 4.04312 12 2.98667ZM11.0467 10L7.99999 13.06L4.95333 10C4.35142 9.39755 3.94164 8.63017 3.77579 7.79487C3.60994 6.95956 3.69545 6.09384 4.02153 5.30713C4.34761 4.52042 4.89961 3.84804 5.60775 3.37499C6.31589 2.90194 7.14838 2.64946 7.99999 2.64946C8.8516 2.64946 9.6841 2.90194 10.3922 3.37499C11.1004 3.84804 11.6524 4.52042 11.9785 5.30713C12.3045 6.09384 12.3901 6.95956 12.2242 7.79487C12.0583 8.63017 11.6486 9.39755 11.0467 10ZM5.99999 4.94001C5.4618 5.47985 5.15959 6.21105 5.15959 6.97334C5.15959 7.73563 5.4618 8.46683 5.99999 9.00667C6.39983 9.4072 6.90905 9.68073 7.46376 9.79294C8.01847 9.90516 8.59396 9.85106 9.11804 9.63744C9.64212 9.42382 10.0914 9.06019 10.4096 8.59217C10.7278 8.12415 10.9007 7.57259 10.9067 7.00667C10.9097 6.62881 10.8369 6.25418 10.6926 5.90493C10.5483 5.55568 10.3355 5.23891 10.0667 4.97334C9.80244 4.70306 9.48738 4.4877 9.13961 4.33965C8.79184 4.1916 8.41822 4.11379 8.04026 4.11069C7.6623 4.10759 7.28746 4.17927 6.93731 4.3216C6.58716 4.46393 6.26861 4.67409 5.99999 4.94001ZM9.12666 8.06001C8.87402 8.3165 8.54013 8.47727 8.18208 8.51484C7.82402 8.55241 7.46404 8.46443 7.16366 8.26596C6.86329 8.06748 6.64119 7.77083 6.53533 7.42673C6.42947 7.08262 6.44643 6.71243 6.5833 6.37944C6.72017 6.04645 6.96846 5.77135 7.28572 5.60116C7.60297 5.43098 7.96949 5.37628 8.32262 5.44642C8.67574 5.51656 8.99353 5.70718 9.22167 5.98569C9.4498 6.26421 9.5741 6.61332 9.57333 6.97334C9.56363 7.38485 9.39099 7.77569 9.09333 8.06001H9.12666Z"
                  fill="#D5DAE1"
                ></path>
              </svg>
            </div>
            <div className="w-auto">
              <p className="text-xs font-medium text-coolGray-500">
                {property.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
