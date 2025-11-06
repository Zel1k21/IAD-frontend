import type { FC } from "react";
import { Link } from "react-router-dom";

interface RequestBinProps {
  stageRequestID?: string | number;
}

export const RequestBin: FC<RequestBinProps> = ({ stageRequestID }) => {
  const isDisabled = !stageRequestID;

  return (
    <Link
      className={`request-bin ${isDisabled ? "request_bin--disabled" : ""}`}
      to={isDisabled ? "#" : `/stage_request/${stageRequestID}`}
      onClick={(e) => isDisabled && e.preventDefault()}
    >
      <img
        className="stage-request-button"
        src="/request_bin.png"
        alt="Request Bin"
      />
    </Link>
  );
};
