import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavigateHeader from "../General page/NavigateHeader";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_USERDATA = ""; // Замените на ваш API endpoint
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  // Функция для декодирования JWT токена
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Ошибка при декодировании токена:", error);
      return null;
    }
  };

  // Проверка авторизации и получение данных пользователя
  useEffect(() => {
    const authToken = sessionStorage.getItem("auth_token");
    if (!authToken) {
      navigate("/login");
      return;
    }

    const tokens = JSON.parse(authToken);
    const decodedToken = parseJwt(tokens.refresh);
    if (decodedToken) {
      setUsername(decodedToken.username);
      setUserId(decodedToken.user_id);
    }
  }, [navigate]);

  // Получение данных профиля с сервера
  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = sessionStorage.getItem("auth_token");
      if (!authToken) return;

      const tokens = JSON.parse(authToken);
      try {
        const response = await fetch(API_USERDATA, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({ refresh_token: tokens.refresh }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Данные пользователя:", data);
          // Обработайте данные пользователя здесь
        } else {
          console.error("Ошибка при получении данных:", response.statusText);
        }
      } catch (error) {
        console.error("Ошибка при запросе данных:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <NavigateHeader />
      <div>
        <h1>Профиль пользователя</h1>
        <p>ID: {id}</p>
        <p>Имя пользователя: {username}</p>
        <p>User ID: {userId}</p>
      </div>
    </div>
  );
};

export default ProfilePage;