import type { FC } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { getStageRequestInfo } from "../modules/emissionAPI";
import type { StageRequestInfo } from "../modules/emissionAPI";
import { dest_root } from "../modules/target_config";

export const RequestBin: FC = () => {
  const [stageRequestInfo, setStageRequestInfo] =
    useState<StageRequestInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStageRequestInfo = async () => {
      try {
        setLoading(true);
        const info = await getStageRequestInfo();
        setStageRequestInfo(info);
      } catch (error) {
        console.error("Error fetching stage request info:", error);
        setStageRequestInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStageRequestInfo();
  }, []);

  const isDisabled = !stageRequestInfo || stageRequestInfo.item_count < 1;

  if (loading) {
    return (
      <div className="request-bin request-bin-loading">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <Link
      className={`request-bin ${isDisabled ? "request_bin--disabled" : ""}`}
      to={isDisabled ? "#" : `/stage-request/${stageRequestInfo?.request_id}`}
      onClick={(e) => isDisabled && e.preventDefault()}
    >
      <img
        className="stage-request-button"
        src={dest_root + "/request_bin.png"}
        alt="Request Bin"
      />
      {stageRequestInfo && stageRequestInfo.item_count > 0 && (
        <span className="request-bin-items">{stageRequestInfo.item_count}</span>
      )}
    </Link>
  );
};
