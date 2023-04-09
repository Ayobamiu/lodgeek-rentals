import React from "react";
import { Carousel } from "flowbite-react";

const PropertyImageCarousel = ({ images }: { images: string[] }) => {
  return (
    <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[550px] bg-gray-200 rounded-md">
      <Carousel slideInterval={5000}>
        {images.map((item, index) => (
          <img
            key={index}
            src={item}
            alt="property-image"
            className="w-full h-full  block rounded-md"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default PropertyImageCarousel;
