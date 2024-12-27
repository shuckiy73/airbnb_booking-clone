import React from "react";
import { Link } from "react-router-dom";

const ForgotPage = () => {
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    console.log("Email:", email); // Для отладки
    // Здесь можно добавить запрос на сервер, например:
    // try {
    //   const response = await fetch('/api/forgot-password', {
    //     method: 'POST',
    //     body: JSON.stringify({ email }),
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error('Ошибка:', error);
    // }
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
            <div className="card shadow-lg rounded-5">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4">Восстановление пароля</h1>
                <form method="POST" onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="email">
                      E-Mail адрес
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      autoFocus
                    />
                    <div className="invalid-feedback">Некорректный email</div>
                  </div>

                  <div className="d-flex align-items-center">
                    <button type="submit" className="btn btn-primary ms-auto">
                      Отправить ссылку
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer py-3 border-0">
                <div className="text-center">
                  Помните пароль?{" "}
                  <Link to="/login" className="text-dark">
                    Войти
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center mt-5 text-muted">
              Copyright &copy; 2017-2021 &mdash; Ваша компания
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPage;