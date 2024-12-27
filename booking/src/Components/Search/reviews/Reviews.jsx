import React from "react";
import Review from "./Review";

const Reviews = ({ reviews }) => {
  return (
    <div className="container">
      {reviews.length > 0 ? (
        reviews.map((item, index) => (
          <div key={index} className="container">
            <Review item={item} />
            <hr />
          </div>
        ))
      ) : (
        <p className="text-center">Отзывов пока нет.</p>
      )}
    </div>
  );
};

export default Reviews;