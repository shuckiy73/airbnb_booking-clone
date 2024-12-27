import React from "react";

const DirectionRouteCard = ({ image_path, alt_name, title, footer }) => {
  return (
    <div className="col">
      <div className="routeDirectionCard rounded-5">
        <div className="card bg-dark text-white rounded-5">
          <img
            src={image_path}
            className="card-img rounded-5 img-circle zoom"
            alt={alt_name}
            width="100"
            height="300"
          />
          <div className="card-img-overlay d-flex flex-column justify-content-end">
            <h4 className="card-title">{title}</h4>
            <p className="card-text">{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionRouteCard;