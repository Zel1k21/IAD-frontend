import type { FC } from "react";
import { Button, Card } from "react-bootstrap";

interface Props {
  title: string;
  image_url: string;
  buttonClickHandler: () => void;
}

export const StageCard: FC<Props> = ({
  title,
  image_url,
  buttonClickHandler,
}) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "stock.jpg";
  };

  return (
    <Card className="stage-card">
      <Card.Img
        className="card-image"
        variant="top"
        src={image_url || "stock.jpg"}
        height={100}
        width={100}
        onClick={buttonClickHandler}
        onError={handleImageError}
      />
      <Card.Body>
        <div className="card-title">
          <Card.Title>{title}</Card.Title>
        </div>
        {/*<Button
          className="add-btn"
          onClick={buttonClickHandler}
          variant="primary"
        >
          Добавить
        </Button>*/}
        <Button
          className="details-btn"
          onClick={buttonClickHandler}
          variant="primary"
        >
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
};
