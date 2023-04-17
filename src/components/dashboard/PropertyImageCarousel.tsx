import React from "react";
import { Carousel } from "flowbite-react";
import { ImageCard } from "../../models";

const PropertyImageCarousel = ({ images }: { images: ImageCard[] }) => {
  return (
    <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[550px] bg-gray-200 rounded-md">
      <Carousel slideInterval={5000}>
        {images.map((item, index) => (
          <img
            key={index}
            src={item.url}
            alt="property-image"
            className="h-full"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default PropertyImageCarousel;
