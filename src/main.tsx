import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { registerSW } from "virtual:pwa-register";
import { dest_root } from "./modules/target_config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={dest_root}>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  registerSW();
}
