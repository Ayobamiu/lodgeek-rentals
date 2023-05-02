import { Drawer } from "antd";
import { useState } from "react";

type Prop = {
  header: string;
  description: string;
  details: string;
  IconComponent: JSX.Element;
};

export function FeatureItem({ i }: { i: Prop }): JSX.Element {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div key={i.header} className="w-full md:w-1/2 lg:w-1/3 px-4">
      <Drawer title={i.header} placement="bottom" onClose={onClose} open={open}>
        <p className="text-coolGray-500 font-medium">{i.details}</p>
      </Drawer>
      <div className="h-full p-8 text-center hover:bg-white rounded-md hover:shadow-xl transition duration-200">
        <div className="inline-flex h-16 w-16 mb-6 mx-auto items-center justify-center text-white bg-green-500 rounded-lg">
          {i.IconComponent}
        </div>
        <h3 className="mb-4 text-xl md:text-2xl leading-tight font-bold">
          {i.header}
        </h3>
        <p className="text-coolGray-500 font-medium">{i.description}</p>
        <button
          onClick={showDrawer}
          type="button"
          className="text-green-500 my-5 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          Read more
          <svg
            aria-hidden="true"
            className="w-5 h-5 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
