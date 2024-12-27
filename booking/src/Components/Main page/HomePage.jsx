import React from "react";
import Briefly from "./Briefly";
import DirectionRoute from "./DirectionRoute";
import Carousel from "./Carousel";
import Popular from "./Popular";
import NavigateHeader from "../General page/NavigateHeader";
import Footer from "../General page/Footer";

const HomePage = () => {
  return (
    <div>
      <NavigateHeader />
      <Carousel />
      <Briefly />
      <DirectionRoute />
      <br />
      <Popular />
      <Footer />
    </div>
  );
};

export default HomePage;