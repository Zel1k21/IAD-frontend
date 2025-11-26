import { configureStore } from "@reduxjs/toolkit";
import stagesReducer from "./stagesSlice";
import userReducer from "./userSlice";
import stageRequestReducer from "./stageRequestSlice";

export const store = configureStore({
  reducer: {
    stagesFilter: stagesReducer,
    user: userReducer,
    stageRequest: stageRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
