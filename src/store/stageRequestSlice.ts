import { api } from "../modules/emissionAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Stages {
  first_dimension_const?: number;
  first_dimension_name?: string;
  image_url?: string;
  input_field_1?: number;
  input_field_2?: number;
  second_dimension_const?: number;
  second_dimension_name?: string;
  stage_title?: string;
  stage_id?: number;
}

interface StageRequestInfo {
  productName?: string | null;
  created_at?: string | null;
}

interface StageRequestBundle {
  requestId?: number;
  count?: number;
  stages: Stages[];
  requestInfo?: StageRequestInfo;
  error?: string | null;
}

const initialState: StageRequestBundle = {
  requestId: NaN,
  count: NaN,
  stages: [],
  requestInfo: {
    productName: null,
    created_at: null,
  },
  error: null,
};

export const getStageRequest = createAsyncThunk(
  "stageRequest/getStageRequest",
  async (requestId: number) => {
    const response = await api.stageRequests.stageRequestsDetail(requestId);
    return response.data;
  },
);

export const addStageToRequest = createAsyncThunk(
  "stageRequest/addStageToStageRequest",
  async (stageId: number) => {
    const response = await api.stages.addToRequestCreate(stageId);
    return response.data;
  },
);

export const fetchStageRequestInfo = createAsyncThunk(
  "stageRequest/fetchStageRequestInfo",
  async () => {
    const response = await api.stageRequests.stageRequestInfoList();
    return response.data;
  },
);

const stageRequestSlice = createSlice({
  name: "stageRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStageRequest.fulfilled, (state, action) => {
        const { stage_request_to_stages, product_name, id, created_at } =
          action.payload;
        if (stage_request_to_stages && id) {
          state.requestId = id;
          state.requestInfo = {
            productName: product_name,
            created_at: created_at,
          };
          state.stages = stage_request_to_stages;
        }
      })
      .addCase(getStageRequest.rejected, (state) => {
        state.error = "Failed to fetch stage request";
      });
  },
});

export default stageRequestSlice.reducer;
