export const ROUTES = {
  HOME: "/",
  STAGES: "/stages",
  STAGE: "/stages/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  STAGEREQUEST: "/stage_request/:requestId",
  PROFILE: "/profile",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  STAGES: "Стадии",
  STAGE: "Стадия",
  LOGIN: "Авторизация",
  REGISTER: "Регистрация",
  STAGEREQUEST: "Заявка",
  PROFILE: "Профиль",
};
