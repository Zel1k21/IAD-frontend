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
  calculationResult?: number;
  userId?: number;
  username?: string;
}

export interface RequestsFilter {
  status?: number;
  date_from?: string;
  date_to?: string;
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
  async (filter?: RequestsFilter) => {
    const response = await api.stageRequests.stageRequestsList(filter);
    return response.data;
  },
);

export const resolveRequest = createAsyncThunk(
  "stageRequest/resolveRequest",
  async (requestId: number) => {
    await api.stageRequests.resolveUpdate(requestId);
  },
);

export const rejectRequest = createAsyncThunk(
  "stageRequest/rejectRequest",
  async (requestId: number) => {
    await api.stageRequests.rejectUpdate(requestId);
  },
);

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStageRequests.fulfilled, (state, action) => {
        if (!action.payload) {
          state.requests = [];
          state.count = 0;
          return;
        }
        const requestsData: HandlerStagesRequestsFilterResponse[] =
          action.payload;
        state.requests = requestsData.map((item) => ({
          requestId: item.id ?? 0,
          status: item.status ?? 0,
          createdAt: item.createdAt?.slice(0, 10) || undefined,
          closedAt: item.closedAt?.slice(0, 10) || undefined,
          formedAt: item.formedAt?.slice(0, 10) || undefined,
          productName: item.productName || undefined,
          calculationResult: item.calculationResult || undefined,
          userId: item.userID || undefined,
          username: item.username || undefined,
        }));
        state.count = requestsData.length;
      })
      .addCase(getAllStageRequests.rejected, (state, action) => {
        state.error = `Failed to fetch stage requests: ${action.error.message}`;
      });
  },
});

export default requestsSlice.reducer;
