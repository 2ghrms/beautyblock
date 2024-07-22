import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { useRecoilState } from "recoil";
import { themeState } from "./store";

import Header from "./components/Header";
import UsersInfo from "./pages/UsersInfo";
import VideosInfo from "./pages/VideosInfo";
import Upload from "./pages/Upload";

function App() {
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    let Theme = localStorage.getItem("Theme");
    document.querySelector("html").classList.add(Theme);
    setTheme(localStorage.getItem("Theme"));
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<UsersInfo />} />
        <Route path="/Videos" element={<VideosInfo />} />
        <Route path="/Upload" element={<Upload />} />
      </Routes>
    </>
  );
}

export default App;
