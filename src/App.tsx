import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./components/navbar";
import { HomePage } from "./pages/home";
import { StagesPage } from "./pages/stages";
import { StagePage } from "./pages/stage";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container className="main-container">
        {/*<BreadCrumbs crumbs={[{ label: ROUTE_LABELS.STAGES }]} />*/}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stages" element={<StagesPage />} />
          <Route path="/stages/:id" element={<StagePage />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
