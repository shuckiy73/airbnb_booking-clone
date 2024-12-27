import React from "react";

const Briefly = () => {
  const features = [
    {
      image: "/image/otherIcons/main_page/location.png",
      alt: "280 тысяч вариантов: квартиры, отели, гостевые дома",
      caption: "280 тысяч вариантов: квартиры, отели, гостевые дома",
    },
    {
      image: "/image/otherIcons/main_page/lable.jpg",
      alt: "Цены напрямую от хозяев жилья",
      caption: "Цены напрямую от хозяев жилья",
    },
    {
      image: "/image/otherIcons/main_page/arrow.png",
      alt: "Кэшбэк бонусами после каждой поездки",
      caption: "Кэшбэк бонусами после каждой поездки",
    },
    {
      image: "/image/otherIcons/main_page/phone.png",
      alt: "Круглосуточная служба поддержки",
      caption: "Круглосуточная служба поддержки",
    },
  ];

  return (
    <div className="briefly shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
      <div className="container">
        <div className="row">
          {features.map((feature, index) => (
            <div className="col" key={index}>
              <figure className="figure">
                <img
                  className="img-fluid"
                  src={feature.image}
                  alt={feature.alt}
                  width="100"
                  height="100"
                />
                <figcaption className="figure-caption">
                  <p className="lead fs-5">
                    <b>{feature.caption}</b>
                  </p>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Briefly;