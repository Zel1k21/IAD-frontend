import React, { useState, useEffect } from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { BreadCrumbs } from "./breadCrumbs";
import { ROUTES } from "./routes";
import "../styles/main.css";
import { getStageByID } from "../modules/emissionAPI";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [stageTitle, setStageTitle] = useState<string | null>(null);

  const generateBreadcrumbs = (): { label: string; path?: string }[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [];

    if (pathnames[0] === "stages") {
      crumbs.push({ label: "Этапы", path: ROUTES.STAGES });

      if (pathnames[1]) {
        const stageId = Number(pathnames[1]);
        if (!isNaN(stageId)) {
          const label = stageTitle || `Этап ${stageId}`;
          crumbs.push({ label, path: location.pathname });
        }
      }
    }

    return crumbs;
  };

  const crumbs = generateBreadcrumbs();

  useEffect(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    if (pathnames[0] === "stages" && pathnames[1]) {
      const stageId = Number(pathnames[1]);
      if (!isNaN(stageId)) {
        const fetchStageTitle = async () => {
          try {
            const stage = await getStageByID(stageId);
            if (stage) {
              setStageTitle(stage.title);
            } else {
              setStageTitle(null);
            }
          } catch (error) {
            console.error("Ошибка загрузки этапа в Navbar:", error);
            setStageTitle(`Этап ${stageId}`);
          }
        };

        fetchStageTitle();
      }
    } else {
      setStageTitle(null);
    }
  }, [location.pathname]);

  return (
    <>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <BootstrapNavbar.Brand>
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              <img
                className="navbar-brand-img"
                src="http://localhost:9000/stageimages/Logo.svg"
              />
            </Nav.Link>
            Расчет углеродного следа
          </BootstrapNavbar.Brand>
          {crumbs.length > 0 && (
            <Container className="breadCrumbs">
              <BreadCrumbs crumbs={crumbs} />
            </Container>
          )}
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/stages"
                active={location.pathname === "/stages"}
                className="stages-link"
              >
                Этапы
              </Nav.Link>
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;
