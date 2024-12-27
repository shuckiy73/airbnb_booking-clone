import React from 'react';

const ImageCarousel = ({ images }) => {
  return (
    <div>
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Slide ${index}`} />
      ))}
    </div>
  );
};

export default ImageCarousel;