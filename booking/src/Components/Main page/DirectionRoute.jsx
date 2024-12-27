import React from "react";
import DirectionRouteCard from "./DirectionRouteCard";

const DirectionRoute = () => {
  const routes = [
    {
      image_path: "image/DirectionRoute/sea.jpg",
      alt_name: "Море",
      title: "На выходные",
      footer: "Недорогие курорты для отдыха на море",
    },
    {
      image_path: "image/DirectionRoute/City_2.jpg",
      alt_name: "Минск",
      title: "Маршруты",
      footer: "Красивые города Беларуси",
    },
    {
      image_path: "image/DirectionRoute/Georgia.jpg",
      alt_name: "Грузия",
      title: "Что посмотреть",
      footer: "В Грузию на машине",
    },
  ];

  return (
    <div className="container routeDirection shadow rounded-5">
      <p className="h1 text-center">Идеи для отпуска</p>
      <div className="justify-content-center">
        <div className="row">
          {routes.map((route, index) => (
            <DirectionRouteCard
              key={index}
              image_path={route.image_path}
              alt_name={route.alt_name}
              title={route.title}
              footer={route.footer}
            />
          ))}
        </div>
      </div>
      <br />
    </div>
  );
};

export default DirectionRoute;