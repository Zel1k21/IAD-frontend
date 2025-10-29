import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { FC } from "react";
import { Spinner, Container } from "react-bootstrap";
import { StageContext } from "../components/stage-context";
import { getStageByID } from "../modules/emissionAPI";

interface Stage {
  id: number;
  title: string;
  image_url: string;
  description?: string;
}

export const StagePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stage, setStage] = useState<Stage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStage = async () => {
      if (!id) {
        setError("ID этапа не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const stageId = parseInt(id);
        const stageData = await getStageByID(stageId);

        if (stageData) {
          setStage(stageData);
        } else {
          setError("Этап не найден");
        }
      } catch (err) {
        console.error("Ошибка загрузки этапа:", err);
        setError("Не удалось загрузить информацию об этапе");
      } finally {
        setLoading(false);
      }
    };

    fetchStage();
  }, [id]);

  if (loading) {
    return (
      <Container className="page-stage">
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="page-stage">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (!stage) {
    return (
      <Container className="page-stage">
        <div className="error-message">
          <h2>Этап не найден</h2>
          <p>Запрашиваемый этап не существует</p>
        </div>
      </Container>
    );
  }

  return (
    <StageContext.Provider value={{ stageTitle: stage.title }}>
      <Container className="page-stage">
        <h2 className="page-stage--title">{stage.title}</h2>
        <div className="page-stage--content">
          <img
            className="page-stage--image"
            src={stage.image_url || "/stock.jpg"}
            alt={stage.title}
            onError={(e) => {
              e.currentTarget.src = "/stock.jpg";
            }}
          />
          <p className="page-stage--description">{stage.description}</p>
        </div>
      </Container>
    </StageContext.Provider>
  );
};
