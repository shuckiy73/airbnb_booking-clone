import React from "react";

const Popular = () => {
  const countries = [
    {
      flag: "/image/countries/Belarus.svg",
      name: "Беларусь",
      cities: "Минск, Брест, Витебск",
    },
    {
      flag: "/image/countries/Kazakhstan.svg",
      name: "Казахстан",
      cities: "Астана, Алматы, Актау",
    },
    {
      flag: "/image/countries/Abkhazia.svg",
      name: "Абхазия",
      cities: "Гагра, Сухум, Пицундра",
    },
    {
      flag: "/image/countries/Georgia.svg",
      name: "Грузия",
      cities: "Тбилиси, Батуми",
    },
    {
      flag: "/image/countries/Armenia.svg",
      name: "Армения",
      cities: "Ереван, Дилижан",
    },
    {
      flag: "/image/countries/Turkey.svg",
      name: "Турция",
      cities: "Анталия, Стамбул, Аланья",
    },
    {
      flag: "/image/countries/Azerbaijan.svg",
      name: "Азербайджан",
      cities: "Баку, Сиазань",
    },
    {
      flag: "/image/countries/Kyrgyzstan.svg",
      name: "Киргизия",
      cities: "Бишкек, Каракол",
    },
    {
      flag: "/image/countries/Egypt.svg",
      name: "Египет",
      cities: "Шарм-эль-Шейх, Хургада",
    },
    {
      flag: "/image/countries/Thailand.svg",
      name: "Тайланд",
      cities: "Пхукет, Паттайя",
    },
    {
      flag: "/image/countries/Uzbekistan.svg",
      name: "Узбекистан",
      cities: "Ташкент, Самарканд",
    },
    {
      flag: "/image/countries/UAE.svg",
      name: "ОАЭ",
      cities: "Дубай, Умм-эль-Кайвайн",
    },
  ];

  return (
    <div className="container-xl shadow rounded-5">
      <h1 className="text-center">Популярно за рубежом</h1>
      <br />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {countries.map((country, index) => (
          <div className="col" key={index}>
            <div className="row align-items-center">
              <div className="col-md-2">
                <img src={country.flag} alt={country.name} className="img-fluid" />
              </div>
              <div className="col-md-8">
                <span className="h6">{country.name}</span>
                <br />
                <span className="text-secondary">{country.cities}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default Popular;