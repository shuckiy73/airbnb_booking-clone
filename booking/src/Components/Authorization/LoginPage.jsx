import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const API_LOGIN = "http://127.0.0.1:8000/api/v1/auth/token/login/"; // API для авторизации
  const navigate = useNavigate(); // Хук для навигации
  const [validated, setValidated] = useState(false); // Состояние для валидации формы
  const [error, setError] = useState(""); // Состояние для отображения ошибок

  // Если пользователь уже авторизован, перенаправляем его назад
  useEffect(() => {
    if (sessionStorage.getItem("auth_token")) {
      navigate(-1);
    }
  }, [navigate]);

  // Функция для авторизации пользователя
  const auth = async (username, password) => {
    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.json();
        sessionStorage.setItem("auth_token", JSON.stringify(token)); // Сохраняем токен в sessionStorage
        navigate(-1); // Перенаправляем пользователя назад после успешной авторизации
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ошибка при авторизации"); // Отображаем ошибку
      }
    } catch (err) {
      setError("Произошла ошибка при подключении к серверу"); // Обработка ошибок сети
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity()) {
      const username = document.getElementById("login").value;
      const password = document.getElementById("password").value;
      await auth(username, password); // Вызываем функцию авторизации
    } else {
      event.stopPropagation(); // Останавливаем всплытие события, если форма невалидна
    }

    setValidated(true); // Устанавливаем состояние валидации
    form.classList.add("was-validated"); // Добавляем класс для отображения ошибок
  };

  return (
    <section className="h-100">
      <div className="container h-100">
        <div className="row justify-content-sm-center h-100">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="text-center my-5">
              <img
                src="/image/logo/kvartirnik_logo.png"
                alt="logo"
                className="w-100"
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>} {/* Отображение ошибки */}
            <div className="card shadow-lg rounded-5">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4">Вход</h1>
                <form
                  method="POST"
                  className={`needs-validation ${validated ? "was-validated" : ""}`}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="login">
                      Логин
                    </label>
                    <input
                      id="login"
                      type="text"
                      className="form-control"
                      name="login"
                      required
                      autoFocus
                    />
                    <div className="invalid-feedback">Логин обязателен</div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 w-100">
                      <label className="text-muted" htmlFor="password">
                        Пароль
                      </label>
                      <Link to="/forgot" className="float-end">
                        Забыли пароль?
                      </Link>
                    </div>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                    />
                    <div className="invalid-feedback">Пароль обязателен</div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        className="form-check-input"
                      />
                      <label htmlFor="remember" className="form-check-label">
                        Запомнить меня
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary ms-auto">
                      Войти
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer py-3 border-0">
                <div className="text-center">
                  Нет аккаунта?{" "}
                  <Link to="/register" className="text-dark">
                    Зарегистрироваться
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;