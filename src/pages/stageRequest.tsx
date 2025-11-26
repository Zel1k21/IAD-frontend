import { useEffect, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { getStageRequest } from "../store/stageRequestSlice";
import { InputField } from "../components/inputField";
import { StageCard } from "../components/stageCard";
import { Button } from "react-bootstrap";
// import {
//   addStageToRequest,
//   fetchStageRequestInfo,
// } from "../store/stageRequestSlice";

export const StageRequestPage: FC = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getStageRequest(Number(id)));
    }
  }, [dispatch, id]);

  const { stages, requestInfo } = useSelector(
    (state: RootState) => state.stageRequest,
  );

  const handleCardClick = (stage_id: number | undefined) => {
    navigate(`/stages/${stage_id}`);
  };

  return (
    <div className="page-request">
      <div className="product-name">
        <h2 className="product-name--title">Введите название продукта:</h2>
        <InputField
          value={requestInfo?.productName || ""}
          searchField={false}
          placeholder="Введите название продукта"
        />
      </div>
      <div className="page-request--cards">
        {stages.length ? (
          stages.map((item) => (
            <StageCard
              image_url={item.image_url || ""}
              first_dimension_name={item.first_dimension_name || ""}
              second_dimension_name={item.second_dimension_name || ""}
              input_field_1={item.input_field_1}
              input_field_2={item.input_field_2}
              title={item.stage_title || ""}
              buttonClickHandler={() => handleCardClick(item.stage_id)}
              variant="request"
            />
          ))
        ) : (
          <section className="stages-not-found">
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </section>
        )}
        <Button>Сохранить</Button>
      </div>
    </div>
  );
};
