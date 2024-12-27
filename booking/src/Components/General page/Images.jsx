import React from "react";
import Image from "./Image";

const Images = ({ image_list, id }) => {
  return (
    <div>
      {image_list && image_list.length > 0 ? (
        <div
          id={`selector-${id}`}
          className="shadow-lg rounded-5 carousel slide"
          data-bs-ride="carousel"
        >
          {/* Индикаторы карусели */}
          <div className="carousel-indicators">
            {image_list.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target={`#selector-${id}`}
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Слайды карусели */}
          <div className="carousel-inner rounded-5">
            {image_list.map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <Image image={image.image_path} />
              </div>
            ))}
          </div>

          {/* Кнопки управления каруселью */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target={`#selector-${id}`}
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target={`#selector-${id}`}
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        // Если изображений нет, отображаем заглушку
        <Image image="/image/user_objects/nophoto_object.jpg" />
      )}
    </div>
  );
};

export default Images;