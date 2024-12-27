import React from "react";
import BriefItemCard from "./BriefItemCard";

const App = () => {
  const item = {
    id: 1,
    title: "Уютная квартира в центре",
    general_info: {
      rooms_count: 2,
      room_square: 50,
      guests_count: 4,
      count_sleeping_places: 3,
    },
    address: {
      city: { name: "Минск" },
      street_type: "ул.",
      street_name: "Ленина",
      building_number: "10",
      corps: "2",
    },
    payment_day: 100,
  };

  return (
    <div>
      <h1>Карточка объекта</h1>
      <BriefItemCard item={item} />
    </div>
  );
};

export default App;