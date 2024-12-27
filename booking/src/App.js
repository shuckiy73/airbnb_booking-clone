import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigateHeader from "./Components/General page/NavigateHeader";
import Footer from "./Components/General page/Footer";
import HomePage from "./Components/Main page/HomePage";
import Search from "./Components/Search/SearchObjects";
import DetailCard from "./Components/Search/DetailCard";
import NotFound from "./Components/General page/NotFound";
import LoginPage from "./Components/Authorization/LoginPage";
import RegisterPage from "./Components/Authorization/RegisterPage";
import ForgotPage from "./Components/Authorization/ForgotPage";
import ProfilePage from "./Components/Authorization/ProfilePage";

const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  DETAIL: "/search/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT: "/forgot",
  PROFILE: "/profile/:id",
  NOT_FOUND: "*",
};

function App() {
  return (
    <Router>
      <div className="wrapper">
        <NavigateHeader />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
          <Route path={ROUTES.DETAIL} element={<DetailCard />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT} element={<ForgotPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;