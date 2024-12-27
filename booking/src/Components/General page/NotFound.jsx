import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center row">
        <div className="col-md-6">
          <img
            src="/image/404.jpg"
            alt="Страница не найдена"
            className="img-fluid w-100"
          />
        </div>
        <div className="col-md-6 mt-5">
          <p className="fs-3">
            <span className="text-danger">Упс!</span> Страница не найдена...
          </p>
          <p className="lead">
            Страница, которую вы искали, не существует!
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            Вернуться на предыдущую страницу
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;