import { type FC } from "react";
// import type { Request, RequestsList } from "../store/requestsSlice";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

export const RequestsListPage: FC = () => {
  const { requests } = useSelector((state: RootState) => state.requests);
  return (
    <div className="requests-list-page">
      <h1 className="requests-label">Заявки</h1>
      <div className="filters">
        <div className="filter-item">
          <label className="filter-label">Статус</label>
          <select className="filter-select">
            <option value="all">Все</option>
            <option value="pending">В работе</option>
            <option value="approved">Одобрена</option>
            <option value="rejected">Отклонена</option>
          </select>
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата начала</label>
          <input
            className="filter-input"
            placeholder="Дата начала"
            type="date"
          />
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата окончания</label>
          <input
            className="filter-input"
            placeholder="Дата окончания"
            type="date"
          />
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
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.requestId}>
                <td>{request.requestId}</td>
                <td>{request.status}</td>
                <td>{request.createdAt}</td>
                <td>{request.formedAt}</td>
                <td>{request.closedAt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Нет заявок</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
