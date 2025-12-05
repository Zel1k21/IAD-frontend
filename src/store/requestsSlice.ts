import { api } from "../modules/emissionAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type HandlerStagesRequestsFilterResponse } from "../modules/Api";

export interface Request {
  requestId: number;
  status: number;
  createdAt?: string;
  closedAt?: string;
  formedAt?: string;
  productName?: string;
}

export interface RequestsList {
  requests: Request[];
  count?: number;
  error?: string;
}

const initialState: RequestsList = {
  requests: [],
  count: 0,
};

export const getAllStageRequests = createAsyncThunk(
  "stageRequest/getAllStageRequests",
  async () => {
    const response = await api.stageRequests.stageRequestsList();
    return response.data;
  },
);

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStageRequests.fulfilled, (state, action) => {
        const requestsData: HandlerStagesRequestsFilterResponse[] =
          action.payload;
        state.requests = requestsData.map((item) => ({
          requestId: item.id ?? 0,
          status: item.status ?? 0,
          createdAt: item.createdAt || undefined,
          closedAt: item.closedAt || undefined,
          formedAt: item.formedAt || undefined,
          productName: item.productName || undefined,
        }));
        state.count = requestsData.length;
      })
      .addCase(getAllStageRequests.rejected, (state, action) => {
        state.error = `Failed to fetch stage requests: ${action.error.message}`;
      });
  },
});

export default requestsSlice.reducer;
