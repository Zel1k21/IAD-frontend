import type { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { InputField } from "../components/inputField";
import {
  addStageToRequest,
  fetchStageRequestInfo,
} from "../store/stageRequestSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";

interface Props {
  title: string;
  image_url: string;
  buttonClickHandler: () => void;

  variant?: "default" | "request";

  first_dimension_name?: string;
  input_field_1?: number;
  input_field_2?: number;
  second_dimension_name?: string;
  stage_id?: number;
  stage_result?: number;
  onFirstFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSecondFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StageCard: FC<Props> = ({
  title,
  image_url,
  buttonClickHandler,
  variant = "default",
  first_dimension_name,
  input_field_1,
  input_field_2,
  second_dimension_name,
  stage_result,
  stage_id,
  onFirstFieldChange,
  onSecondFieldChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthorized = useSelector(
    (state: RootState) => state.user.isAuthorized,
  );

  const handleAdd = async () => {
    if (stage_id) {
      await dispatch(addStageToRequest(stage_id));
      await dispatch(fetchStageRequestInfo());
    }
  };
  if (variant === "default") {
    return (
      <Card className="stage-card">
        <Card.Img
          className="card-image"
          variant="top"
          src={image_url || "/IAD-frontend/stock.jpg"}
          height={100}
          width={100}
          onClick={buttonClickHandler}
        />
        <Card.Body>
          <div className="card-title">
            <Card.Title>{title}</Card.Title>
          </div>
          <Button
            className="add-btn"
            onClick={isAuthorized == true ? handleAdd : undefined}
            variant="primary"
          >
            Добавить
          </Button>
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
  }

  if (variant === "request") {
    return (
      <div className="stage-card stage-card--horizontal">
        <Card className="stage-card">
          <div className="card-info">
            <Card.Img
              className="card-image"
              variant="top"
              src={image_url || "/IAD-frontend/stock.jpg"}
              height={100}
              width={100}
              onClick={buttonClickHandler}
            />

            <Card.Body>
              <div className="card-title">
                <Card.Title>{title}</Card.Title>
              </div>
              <Button
                className="details-btn"
                onClick={buttonClickHandler}
                variant="primary"
              >
                Подробнее
              </Button>
            </Card.Body>
          </div>

          {/* Первое поле ввода */}
          <div className="stage-card--input">
            <p className="stage-card--input-dimentions">
              {first_dimension_name}
            </p>
            <div className="stage-card--inputField">
              <InputField
                value={input_field_1 || ""}
                searchField={false}
                placeholder="Введите значение"
                onChange={onFirstFieldChange}
              />
            </div>
          </div>

          {/* Второе поле ввода */}
          <div className="stage-card--input">
            <p className="stage-card--input-dimentions">
              {second_dimension_name}
            </p>
            <div className="stage-card--inputField">
              <InputField
                value={input_field_2 || ""}
                searchField={false}
                placeholder="Введите значение"
                onChange={onSecondFieldChange}
              />
            </div>
          </div>
          <p className="stage-card--result">
            Выбросы CO2 на этапе: {stage_result}
          </p>
        </Card>
      </div>
    );
  }
};
