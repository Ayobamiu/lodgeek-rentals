const PropertyDetailTab = ({
  description,
  address,
}: {
  description: string;
  address: string;
}) => {
  return (
    <div>
      <div>
        <h6 className="text-2xl text-gray-700 font-medium mb-3">
          Property Type
        </h6>
        <p className="text-sm text-gray-600 font-medium">3 bedroom flat</p>
      </div>
      <div className="mt-4">
        <h6 className="text-2xl text-gray-700 font-medium mb-3">
          Property Description
        </h6>
        <p className="text-sm text-gray-600 font-medium">{description}</p>
      </div>
      <div className="mt-4">
        <h6 className="text-2xl text-gray-700 font-medium mb-1">Address</h6>
        <p className="text-sm text-gray-600 font-medium">{address}</p>
      </div>
    </div>
  );
};

export default PropertyDetailTab;
