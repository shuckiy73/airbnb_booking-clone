import React, { useEffect, useState } from "react";

const OneReviewStar = ({ stars, title }) => {
  const [resultStars, setResultStars] = useState(0);

  useEffect(() => {
    if (stars) {
      setResultStars((stars * 10).toFixed(1));
    }
  }, [stars]);

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-sm-6 ms-md-auto">
          <p>{title}</p>
        </div>
        <div className="col-sm-4 ms-md-auto">
          <div className="progress" style={{ height: 4 }}>
            <div
              className="progress-bar bg-danger"
              role="progressbar"
              style={{ width: `${resultStars}%` }}
              aria-valuenow={resultStars}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <div className="col-sm-auto">
          {stars ? stars.toFixed(1) : ""}
        </div>
      </div>
    </div>
  );
};

export default OneReviewStar;