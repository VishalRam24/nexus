import React from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Problem from "./sections/Problem.jsx";
import Approach from "./sections/Approach.jsx";
import Advantages from "./sections/Advantages.jsx";
import Comparison from "./sections/Comparison.jsx";
import Benchmarks from "./sections/Benchmarks.jsx";
import WherePays from "./sections/WherePays.jsx";
import GetStarted from "./sections/GetStarted.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Approach />
        <Advantages />
        <Comparison />
        <Benchmarks />
        <WherePays />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}
