import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const API_REGISTER = "http://127.0.0.1:8000/api/v1/auth/token/register/"; // API для регистрации
  const navigate = useNavigate(); // Хук для навигации
  const [validated, setValidated] = useState(false); // Состояние для валидации формы
  const [error, setError] = useState(""); // Состояние для отображения ошибок

  // Функция для регистрации пользователя
  const register = async (username, email, password) => {
    try {
      const response = await fetch(API_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const token = await response.json();
        sessionStorage.setItem("auth_token", JSON.stringify(token)); // Сохраняем токен в sessionStorage
        navigate("/"); // Перенаправляем на главную страницу после успешной регистрации
      } else {
        const errors = await response.json();
        setError(errors.username?.[0] || "Ошибка при регистрации"); // Отображаем ошибку
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
      const username = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      await register(username, email, password); // Вызываем функцию регистрации
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
                <h1 className="fs-4 card-title fw-bold mb-4">Регистрация</h1>
                <form
                  method="POST"
                  className={`needs-validation ${validated ? "was-validated" : ""}`}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="name">
                      Логин
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-control"
                      name="name"
                      required
                      autoFocus
                    />
                    <div className="invalid-feedback">Логин обязателен</div>
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="email">
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      name="email"
                      required
                    />
                    <div className="invalid-feedback">Некорректный email</div>
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="password">
                      Пароль
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                    />
                    <div className="invalid-feedback">Пароль обязателен</div>
                  </div>

                  <p className="form-text text-muted mb-3">
                    Регистрируясь, вы соглашаетесь с нашими условиями использования.
                  </p>

                  <div className="align-items-center d-flex">
                    <button type="submit" className="btn btn-primary ms-auto">
                      Зарегистрироваться
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer py-3 border-0">
                <div className="text-center">
                  Уже есть аккаунт?{" "}
                  <Link to="/login" className="text-dark">
                    Войти
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

export default RegisterPage;