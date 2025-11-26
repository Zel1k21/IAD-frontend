import { useEffect } from "react";
import type { FC } from "react";
import { Spinner } from "react-bootstrap";
import { InputField } from "../components/inputField";
import { StageCard } from "../components/stageCard";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSearchValue } from "../store/stagesSlice";
import { fetchStages, searchStages } from "../store/stagesThunks";
import { RequestBin } from "../components/requestBin";

export const StagesPage: FC = () => {
  const dispatch = useAppDispatch();
  const { searchValue, loading, stages, loadedFromStorage } = useAppSelector(
    (state) => state.stagesFilter,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if ((!loadedFromStorage || stages.length === 0) && !loading) {
      dispatch(fetchStages(""));
    }
  }, [dispatch, loadedFromStorage, loading, stages.length]);

  const handleSearch = async () => {
    if (searchValue.trim() === "") {
      dispatch(fetchStages(""));
    } else {
      dispatch(searchStages(searchValue));
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/stages/${id}`);
  };

  return (
    <div className={`container ${loading && "containerLoading"}`}>
      <img className="page-stages--image" src="factory.jpg" />

      <div className="top-bar">
        <InputField
          value={searchValue}
          setValue={(value) => dispatch(setSearchValue(value))}
          loading={loading}
          onSubmit={handleSearch}
          searchField={true}
          placeholder="Введите название этапа"
        />
        {/*<img className="request-bin" src="request_bin.png" />*/}
        <RequestBin />
      </div>
      {loading && (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && (
        <div className="stages-grid">
          {!stages.length ? (
            <div className="stages-empty">
              <h1>К сожалению, пока ничего не найдено :(</h1>
            </div>
          ) : (
            <div className="stages-grid-container">
              {stages.map((item, index) => (
                <StageCard
                  key={index}
                  buttonClickHandler={() => handleCardClick(item.id)}
                  stage_id={item.id}
                  {...item}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
