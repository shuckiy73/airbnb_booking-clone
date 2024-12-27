import React, { useEffect, useState } from "react";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import ProfilePage from "../Authorization/ProfilePage";

const NavigateHeader = () => {
  const navigate = useNavigate();
  const API_LOGOUT = "http://127.0.0.1:8000/api/v1/auth/token/logout/";
  const API_REFRESH = "http://127.0.0.1:8000/api/v1/auth/token/refresh/";
  const API_VERIFY = "http://127.0.0.1:8000/api/v1/auth/token/verify/";

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  // Функция для декодирования JWT токена
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

  // Проверка авторизации и получение данных пользователя
  useEffect(() => {
    const authToken = sessionStorage.getItem("auth_token");
    if (authToken) {
      const tokens = JSON.parse(authToken);
      const decodedToken = parseJwt(tokens.refresh);
      if (decodedToken) {
        setUsername(decodedToken.username);
        setUserId(decodedToken.user_id);
      }
    }
  }, []);

  // Обновление токенов
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
        navigate("/login");
      }
    } catch (error) {
      console.error("Ошибка при обновлении токенов:", error);
    }
  };

  // Проверка валидности токена
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

  // Выход из системы
  const logout = async () => {
    const authToken = sessionStorage.getItem("auth_token");
    if (!authToken) {
      navigate("/login");
      return;
    }

    const tokens = JSON.parse(authToken);
    const isValid = await verifyToken(tokens.access, tokens.refresh);
    if (!isValid) return;

    try {
      const response = await fetch(API_LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({ refresh_token: tokens.refresh }),
      });

      if (response.ok) {
        sessionStorage.removeItem("auth_token");
        navigate(0); // Перезагрузка страницы
      } else {
        console.error("Ошибка при выходе из системы:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  return (
    <div className="container justify-content-sm-center">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Переключатель навигации"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand" to="/">
              <img
                alt="logo"
                src="../../image/logo/kvartirnik_logo.png"
                width="150"
                height="70"
              />
            </Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Главная
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Зарабатывайте на сдаче жилья
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  Бронирование
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Избранное
                </Link>
              </li>
              {sessionStorage.getItem("auth_token") ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {username} <span className="badge text-bg-secondary">4</span>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li>
                      <Link className="dropdown-item" to={`/profile/${userId}`}>
                        Профиль
                      </Link>
                    </li>
                    <li>
                      <span className="dropdown-item">Оповещения</span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Выйти
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Войти
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default NavigateHeader;