import React from "react";

const Footer = () => {
  return (
    <footer className="shadow mt-auto rounded-5">
      <div
        className="d-flex justify-content-between align-items-center mx-auto py-4 flex-wrap"
        style={{ width: "80%" }}
      >
        <a href="#" className="d-flex align-items-center p-0 text-dark">
          <img
            alt="logo"
            src="/image/logo/kvartirnik_logo.png"
            width="250"
            height="100"
          />
        </a>
        <small>&copy; Квартирник, 2024. Все права защищены.</small>
      </div>
    </footer>
  );
};

export default Footer;