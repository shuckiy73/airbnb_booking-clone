import React, { useState, useEffect } from "react";
import { Button, Alert } from "@mui/material";
import axios from "axios";

const Booking = ({ id, prepayment, payment_day, room_object }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exchangeUSD, setExchangeUSD] = useState(0);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BOOKING = "http://127.0.0.1:8000/api/v1/booking/1";
  const API_NBRB_USD_CURRENCY = "https://api.nbrb.by/exrates/rates/431";
  const API_REFRESH = "http://127.0.0.1:8000/api/v1/auth/token/refresh/";
  const API_VERIFY = "http://127.0.0.1:8000/api/v1/auth/token/verify/";
  const API_FAVORITE = "http://127.0.0.1:8000/api/v1/add_to_favorite";

  const HEADERS = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(API_NBRB_USD_CURRENCY, {
          method: "GET",
          headers: HEADERS,
        });
        if (response.ok) {
          const json = await response.json();
          setExchangeUSD(json.Cur_OfficialRate);
        } else {
          console.log("Ошибка HTTP: " + response.status);
        }
      } catch (error) {
        console.error("Ошибка при получении курса валют:", error);
      }
    };

    fetchExchangeRate();

    if (sessionStorage.getItem("auth_token")) {
      const tokens = JSON.parse(sessionStorage.getItem("auth_token"));
      const user = parseJwt(tokens.refresh).username;
      const user_id = parseJwt(tokens.refresh).user_id;
      setUsername(user);
      setUserId(user_id);
    } else {
      console.log("NO TOKENS", sessionStorage);
    }
  }, []);

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Ошибка при декодировании токена:", error);
      return null;
    }
  };

  const resetTokens = async (refreshToken) => {
    try {
      const response = await fetch(API_REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const newTokens = await response.json();
        sessionStorage.setItem(
          "auth_token",
          JSON.stringify({ ...newTokens, refresh: refreshToken })
        );
      } else {
        sessionStorage.removeItem("auth_token");
        alert("Для запроса нужна повторная авторизация");
      }
    } catch (error) {
      console.error("Ошибка при обновлении токенов:", error);
    }
  };

  const verifyToken = async (accessToken, refreshToken) => {
    try {
      const response = await fetch(API_VERIFY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ token: accessToken }),
      });

      if (response.ok) {
        return true;
      } else {
        await resetTokens(refreshToken);
        return false;
      }
    } catch (error) {
      console.error("Ошибка при проверке токена:", error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const arrive = startDate;
    const departure = endDate;

    if (!sessionStorage.getItem("auth_token")) {
      setError({ error: "Для бронирования необходимо авторизоваться" });
      return;
    }

    const tokens = JSON.parse(sessionStorage.getItem("auth_token"));
    const isValid = await verifyToken(tokens.access, tokens.refresh);

    if (!isValid) {
      setError({ error: "Ошибка авторизации" });
      return;
    }

    try {
      const response = await fetch(API_BOOKING, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          id,
          arrive,
          departure,
          tenant: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data);
      } else {
        const errorData = await response.json();
        setError(errorData);
      }
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      setError({ error: "Произошла ошибка при бронировании" });
    }
  };

  const handleFavorite = async () => {
    if (!sessionStorage.getItem("auth_token")) {
      setError({ error: "Для добавления в избранное необходимо авторизоваться" });
      return;
    }

    const tokens = JSON.parse(sessionStorage.getItem("auth_token"));
    const isValid = await verifyToken(tokens.access, tokens.refresh);

    if (!isValid) {
      setError({ error: "Ошибка авторизации" });
      return;
    }

    try {
      const response = await fetch(API_FAVORITE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          user: userId,
          room_object,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data);
      } else {
        const errorData = await response.json();
        setError(errorData);
      }
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);
      setError({ error: "Произошла ошибка при добавлении в избранное" });
    }
  };

  const getDate = () => {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <div className="position-fixed">
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col">
              <Button variant="outlined" color="success" onClick={handleFavorite}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-suit-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                </svg>
                &nbsp;В избранное
              </Button>
            </div>
            <div className="col">
              <Button variant="outlined" color="success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-share"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                </svg>
                &nbsp;Поделиться
              </Button>
            </div>
          </div>
        </div>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="container shadow-lg rounded-5">
            <br />
            <div className="row">
              <div className="col">
                <input
                  id="startDate"
                  className="pa__middle-input text form-control"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Заезд"
                />
              </div>
              <div className="col">
                <input
                  id="endDate"
                  className="form-control"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Отъезд"
                />
              </div>
            </div>
            <br />
            <p>Предоплата: {prepayment} BYN (~{(prepayment / exchangeUSD).toFixed(2)} USD)</p>
            <p>
              <span>Оплата за сутки:</span> {payment_day} BYN (~{(payment_day / exchangeUSD).toFixed(2)} USD)
            </p>
            <p>
              Оплата при заселении: {payment_day - prepayment} BYN (~{((payment_day - prepayment) / exchangeUSD).toFixed(2)} USD)
            </p>
            <hr />
            <p>Курс НБ РБ на {getDate()}: 1 USD - {exchangeUSD} BYN</p>
            <br />
            <div className="row">
              <Button type="submit" variant="outlined" color="success">
                Хочу забронировать
              </Button>
            </div>
            <br />
          </div>
        </form>
        <br />
        {error && <Alert severity="error">{error.error || error.detail}</Alert>}
        {success && <Alert severity="success">{success.success}</Alert>}
      </div>
    </div>
  );
};

export default Booking;