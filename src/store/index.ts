import { configureStore } from "@reduxjs/toolkit";
import stagesReducer from "./stagesSlice";
import userReducer from "./userSlice";
import stageRequestReducer from "./stageRequestSlice";
import requestsReducer from "./requestsSlice";

export const store = configureStore({
  reducer: {
    stagesFilter: stagesReducer,
    user: userReducer,
    stageRequest: stageRequestReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
