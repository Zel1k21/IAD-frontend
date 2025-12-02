import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./components/navbar";
import { HomePage } from "./pages/home";
import { StagesPage } from "./pages/stages";
import { StagePage } from "./pages/stage";
import { LoginPage } from "./pages/loginPage";
import { RegisterPage } from "./pages/registerPage";
import { ProfilePage } from "./pages/profilePage";
import { StageRequestPage } from "./pages/stageRequest";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stages" element={<StagesPage />} />
          <Route path="/stages/:id" element={<StagePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/stage_request/:id" element={<StageRequestPage />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
