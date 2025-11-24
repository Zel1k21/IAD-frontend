export const ROUTES = {
  HOME: "/",
  STAGES: "/stages",
  STAGE: "/stages/:id",
  LOGIN: "/login",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  STAGES: "Стадии",
  STAGE: "Стадия",
  LOGIN: "Авторизация",
};
