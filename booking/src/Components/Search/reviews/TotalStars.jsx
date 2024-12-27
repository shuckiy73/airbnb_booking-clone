import React from "react";
import OneReviewStar from "./OneReviewStar";

const TotalStars = ({ star }) => {
  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="col-sm-6">
          <OneReviewStar stars={star.cleanliness__avg} title="Чистота" />
          <OneReviewStar stars={star.timeliness_of_check_in__avg} title="Своевременность заселения" />
          <OneReviewStar stars={star.location__avg} title="Расположение" />
        </div>
        <div className="col-sm-6">
          <OneReviewStar stars={star.conformity_to_photos__avg} title="Соответствие фото" />
          <OneReviewStar stars={star.price_quality__avg} title="Цена - качество" />
          <OneReviewStar stars={star.quality_of_service__avg} title="Качество обслуживания" />
        </div>
      </div>
      <br />
    </div>
  );
};

export default TotalStars;