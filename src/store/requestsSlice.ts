import { api } from "../modules/emissionAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type HandlerStagesRequestsFilterResponse } from "../modules/Api";

export interface Request {
  requestId: number;
  status: number;
  createdAt?: Date;
  closedAt?: Date;
  formedAt?: Date;
  productName?: string;
  calculationResult?: number;
}

export interface RequestsFilter {
  status?: number;
  dateFrom?: string;
  dateTo?: string;
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

const isEmptyDate = (dateStr?: string) =>
  !dateStr || dateStr === "0001-01-01T00:00:00Z";

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
          createdAt: isEmptyDate(item.createdAt)
            ? undefined
            : new Date(item.createdAt!),

          closedAt: isEmptyDate(item.closedAt)
            ? undefined
            : new Date(item.closedAt!),

          formedAt: isEmptyDate(item.formedAt)
            ? undefined
            : new Date(item.formedAt!),
          productName: item.productName || undefined,
          calculationResult: item.calculationResult || undefined,
        }));
        state.count = requestsData.length;
      })
      .addCase(getAllStageRequests.rejected, (state, action) => {
        state.error = `Failed to fetch stage requests: ${action.error.message}`;
      });
  },
});

export default requestsSlice.reducer;
