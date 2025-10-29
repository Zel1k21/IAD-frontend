import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../components/routes";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container className="home-page">
      <Row className="justify-content-center text-center mb-4">
        <Col lg={8}>
          <h1 className="display-5 mb-3">Расчет углеродного следа</h1>
          <p className="text-muted">
            Инструмент для анализа и расчета углеродного следа производственных
            процессов
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Card.Title className="h5 mb-3">Этапы производства</Card.Title>
              <Card.Text className="mb-3">
                Просмотрите все этапы производственного процесса и оцените их
                влияние на углеродный след.
              </Card.Text>
              <Link to={ROUTES.STAGES}>
                <Button variant="primary" className="w-100">
                  Перейти к этапам
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
