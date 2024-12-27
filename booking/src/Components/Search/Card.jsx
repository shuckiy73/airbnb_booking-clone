import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Используем useNavigate вместо Routes
import axios from "axios";
import Booking from "./Booking";
import Reviews from "./reviews/Reviews";
import TotalStars from "./reviews/TotalStars";
import SendReview from "./reviews/SendReview";
import ImageCarousel from '../Main page/ImageCarousel'; 
import { Box } from "@mui/material";

const Card = ({ item, reviews }) => {
  const [stars, setStars] = useState({});
  const [images, setImages] = useState([]);
  const navigate = useNavigate(); // Хук для навигации

  const API_ALL_STARTS_RATING = "http://127.0.0.1:8000/api/v1/get_object_rating/";
  const API_GET_IMAGES = "http://127.0.0.1:8000/api/v1/get_object_images/";

  const HEADERS = {
    Accept: "*/*",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [starsResponse, imagesResponse] = await Promise.all([
          axios.get(`${API_ALL_STARTS_RATING}${item.id}/`, { headers: HEADERS }),
          axios.get(`${API_GET_IMAGES}${item.id}`),
        ]);

        setStars(starsResponse.data);
        setImages(imagesResponse.data.images);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [item.id]);

  const calculateAverageRating = () => {
    if (!stars) return "No stars";
    const total =
      stars.cleanliness__avg +
      stars.conformity_to_photos__avg +
      stars.price_quality__avg +
      stars.location__avg +
      stars.quality_of_service__avg +
      stars.timeliness_of_check_in__avg;
    return (total / 6).toFixed(1);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <div className="item-details-container row-fluid">
            <h2 className="item-details-heading">{item.title}</h2>
            <p>
              {reviews.length > 0 && (
                <span>
                  <span className="fw-bold img-fluid">
                    <img src="/image/otherIcons/red_star_rating.png" width="30" height="20" alt="Рейтинг" />
                    {calculateAverageRating()}
                  </span>
                  <span>&nbsp;<span className="text-secondary">{reviews.length} отзыва</span></span>
                </span>
              )}
              <span className="text-secondary">
                &nbsp;{item.address ? `${item.city.name}, ${item.address.street_type} ${item.address.street_name} ${item.address.building_number} ${item.address.corps ? item.address.corps : ""}` : ""}
              </span>
            </p>
            <div className="container">
              {images.length ? (
                <Box sx={{ maxWidth: 800, flexGrow: 1, margin: "auto", mt: 5 }}>
                  <ImageCarousel image_list={images} height={600} />
                </Box>
              ) : (
                <img src="/image/user_objects/nophoto_object.jpg" alt="Заглушка" />
              )}
            </div>
            <br />
            <div className="item-details shadow-lg p-3 rounded-5">
              <div className="item-details-info">
                {item.building_info && item.general_info && (
                  <h4>
                    {item.building_info.building_type_name} {item.general_info.room_square}м<sup>2</sup>
                  </h4>
                )}
                <div className="container">
                  {item.general_info && (
                    <div className="row">
                      <div className="col">
                        <h6>Гостей: {item.general_info.guests_count}</h6>
                      </div>
                      <div className="col">
                        <h6>Комнат: {item.general_info.rooms_count}</h6>
                      </div>
                      <div className="col">
                        <h6>{item.general_info.kitchen}</h6>
                      </div>
                      <div className="col">
                        <h6>{item.general_info.room_repair}</h6>
                      </div>
                      <div className="col">
                        <h6>
                          этаж {item.general_info.floor} из {item.general_info.floor_in_the_house}
                          {item.address ? `${item.address.has_elevator ? ", есть лифт" : "."}` : "."}
                        </h6>
                      </div>
                    </div>
                  )}
                </div>
                <p>{item.building_description}</p>
                <h6>Спальные места: {item.general_info ? item.general_info.count_sleeping_places : ""}</h6>
              </div>
            </div>
            <br />
            <div className="item-details shadow-lg p-3 rounded-5">
              <h4>Правила размещения</h4>
              <div className="container">
                <div className="row row-cols-3">
                  <div className="col fw-bold">Заезд</div>
                  <div className="col fw-bold">Отъезд</div>
                  <div className="col fw-bold">Минимальный период проживания</div>
                  <div className="col">после {item.arrival_time}</div>
                  <div className="col">до {item.departure_time}</div>
                  <div className="col">от {item.minimum_length_of_stay} суток</div>
                </div>
              </div>
              <ul className="list-group list-group-flush">
                {item.placing_rules?.with_children && (
                  <li className="list-group-item">можно с детьми любого возраста</li>
                )}
                {item.placing_rules?.with_animals ? (
                  <li className="list-group-item">С питомцами</li>
                ) : (
                  <li className="list-group-item">Без питомцев</li>
                )}
                {item.placing_rules?.smoking_is_allowed ? (
                  <li className="list-group-item">Курение разрешено</li>
                ) : (
                  <li className="list-group-item">Курение запрещено</li>
                )}
                {item.placing_rules?.parties_are_allowed ? (
                  <li className="list-group-item">вечеринки и мероприятия разрешены</li>
                ) : (
                  <li className="list-group-item">без вечеринок и мероприятий</li>
                )}
                {item.placing_rules?.accounting_documents && (
                  <li className="list-group-item">владелец предоставляет отчетные документы о проживании по согласованию</li>
                )}
              </ul>
            </div>
            <br />
            <div className="item-details shadow-lg p-3 rounded-5">
              <div className="item-details-info">
                <span className="fs-3 fw-bold img-fluid">Оценка гостей</span>
                {reviews.length > 0 ? (
                  <span>
                    <span className="fs-5 fw-bold img-fluid">
                      <img src="/image/otherIcons/red_star_rating.png" width="40" height="30" alt="Рейтинг" />
                      {calculateAverageRating()}
                    </span>
                    <span>&nbsp;<span className="text-secondary">{reviews.length} отзыва</span></span>
                    <TotalStars star={stars} />
                    <div className="container">
                      {sessionStorage.getItem("auth_token") ? (
                        <SendReview />
                      ) : (
                        <div className="col-md">
                          <Link to="/login">Авторизуйтесь</Link> для того что бы оставить отзыв!
                        </div>
                      )}
                    </div>
                    <Reviews reviews={reviews} />
                  </span>
                ) : (
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col align-text-center"></div>
                      <div className="col-lg-8 align-text-center">
                        Пока что отзывов нету. Будьте первым! <br />
                        {sessionStorage.getItem("auth_token") ? (
                          <SendReview />
                        ) : (
                          <p>
                            <Link to="/login">Авторизуйтесь</Link> для того что бы оставить отзыв!
                          </p>
                        )}
                      </div>
                      <div className="col align-text-center"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <Booking prepayment={item.prepayment} payment_day={item.payment_day} room_object={item.id} />
        </div>
      </div>
    </div>
  );
};

export default Card;