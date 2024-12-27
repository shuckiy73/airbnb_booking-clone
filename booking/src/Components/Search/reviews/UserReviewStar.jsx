import React from "react";

const UserReviewStar = ({ rating }) => {
  // Вычисление среднего рейтинга
  const averageRating = (
    (rating.cleanliness +
      rating.conformity_to_photos +
      rating.timeliness_of_check_in +
      rating.price_quality +
      rating.location +
      rating.quality_of_service) /
    6
  ).toFixed(1);

  return <span>{averageRating}</span>;
};

export default UserReviewStar;