import { configureStore } from "@reduxjs/toolkit";
import stagesReducer from "./stagesSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    stagesFilter: stagesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
