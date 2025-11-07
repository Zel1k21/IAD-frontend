import { useState, useEffect } from "react";
import type { FC } from "react";
import { Spinner } from "react-bootstrap";
import type { Stages } from "../modules/emissionAPI";
import { getStageByName } from "../modules/emissionAPI";
import { InputField } from "../components/inputField";
import { StageCard } from "../components/stageCard";
import { RequestBin } from "../components/requestBin";
import { useNavigate } from "react-router-dom";
// import { BreadCrumbs } from "../components/breadCrumbs";
// import { ROUTES } from "../components/routes";

export const StagesPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [stages, setStage] = useState<Stages[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStages = async () => {
      setLoading(true);
      try {
        const response = await getStageByName("");
        const results = response?.results || [];
        setStage(results);
      } catch (error) {
        console.error("Load stages error:", error);
        setStage([]);
      } finally {
        setLoading(false);
      }
    };
    loadStages();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getStageByName(searchValue);
      console.log("API Response:", response);
      const results = response?.results || [];
      console.log("Results:", results);
      setStage(results);
    } catch (error) {
      console.error("Search error:", error);
      setStage([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/stages/${id}`);
  };

  // const crumbs = [{ label: "Этапы", path: ROUTES.STAGES }];

  return (
    <div className={`container ${loading && "containerLoading"}`}>
      <img className="page-stages--image" src="factory.jpg" />

      <div className="top-bar">
        <InputField
          value={searchValue}
          setValue={(value) => setSearchValue(value)}
          loading={loading}
          onSubmit={handleSearch}
          searchField={true}
          placeholder="Введите название этапа"
        />
        <RequestBin stageRequestID={1} />
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
