import { type FC, useEffect, useState } from "react";
import { getAllStageRequests } from "../store/requestsSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const RequestsListPage: FC = () => {
  const { requests } = useSelector((state: RootState) => state.requests);
  const [requestClicked, setRequestClicked] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const isModerator = useSelector((state: RootState) => state.user.isModerator);

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const status = e.target.value;
    switch (status) {
      case "formed":
        dispatch(getAllStageRequests({ status: 3 }));
        break;
      case "approved":
        dispatch(getAllStageRequests({ status: 4 }));
        break;
      case "rejected":
        dispatch(getAllStageRequests({ status: 5 }));
        break;
      default:
        dispatch(getAllStageRequests());
        break;
    }
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    dispatch(getAllStageRequests({ date_from: date || undefined }));
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    dispatch(getAllStageRequests({ date_to: date || undefined }));
  };

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = e.target.value;
    setSelectedUser(selectedUser);
  };

  const handleRequestClick = (id: number) => {
    setRequestId(id);
    setRequestClicked(true);
  };

  const handleTransitionButtonClick = () => {
    navigate(`/stage-request/${requestId}`);
  };

  useEffect(() => {
    dispatch(getAllStageRequests());
  }, [dispatch]);

  return (
    <div className="requests-list-page">
      <h1 className="requests-label">Заявки</h1>
      <div className={"filters " + (isModerator ? "moderator" : "")}>
        <div className="filter-item">
          <label className="filter-label">Статус</label>
          <select className="filter-select" onChange={handleStatusFilterChange}>
            <option defaultValue="all">Все</option>
            <option value="formed">Сформирована</option>
            <option value="approved">Одобрена</option>
            <option value="rejected">Отклонена</option>
          </select>
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата начала</label>
          <input
            className="filter-input"
            placeholder="Дата начала"
            onChange={handleDateFromChange}
            type="date"
          />
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата окончания</label>
          <input
            className="filter-input"
            placeholder="Дата окончания"
            onChange={handleDateToChange}
            type="date"
          />
        </div>
        <div className="filter-item">
          <label className="filter-label">Пользователь</label>
          <select className="filter-select" onChange={handleUserSelection}>
            <option value="">Все пользователи</option>
            {requests.length
              ? [...new Set(requests.map((r) => r.username))].map(
                  (username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ),
                )
              : null}
          </select>
        </div>
      </div>
      <table className="request-table">
        <thead className="columns-name">
          <tr>
            <th>#</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата оформления</th>
            <th>Дата завершения</th>
            <th>Выбросы CO2</th>
            {isModerator && <th>Пользователь</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length ? (
            requests.map(
              (request) =>
                (selectedUser === request.username || selectedUser === "") && (
                  <tr
                    key={request.requestId}
                    onClick={() => handleRequestClick(request.requestId)}
                  >
                    <td>{request.requestId}</td>
                    {(() => {
                      switch (request.status) {
                        case 3:
                          return <td>Сформирована</td>;
                        case 4:
                          return <td>Одобрена</td>;
                        default:
                          return <td>Отклонена</td>;
                      }
                    })()}
                    <td>{request.createdAt}</td>
                    {!request.closedAt && !request.formedAt ? (
                      <td>Не оформлена</td>
                    ) : (
                      <td>{request.formedAt}</td>
                    )}
                    {!request.closedAt && request.formedAt ? (
                      <td>Не завершена</td>
                    ) : (
                      <td>{request.closedAt}</td>
                    )}
                    <td className="center-column-data">
                      {request.calculationResult}
                    </td>
                    {isModerator && (
                      <td className="center-column-data">{request.username}</td>
                    )}
                  </tr>
                ),
            )
          ) : (
            <tr>
              <td colSpan={5}>Нет заявок</td>
            </tr>
          )}
        </tbody>
      </table>
      {requestClicked && (
        <Button
          className="transition-button"
          onClick={handleTransitionButtonClick}
        >
          Перейти к заявке
        </Button>
      )}
    </div>
  );
};
