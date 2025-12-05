import { api } from "../modules/emissionAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Stages {
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

export interface StageRequestInfo {
  productName?: string;
  createdAt?: string;
  closedAt?: string;
  formedAt?: string;
}

interface StageRequestBundle {
  requestId?: number;
  count?: number;
  stages: Stages[];
  requestInfo?: StageRequestInfo;
  isDraft: boolean;
  error?: string;
}

const initialState: StageRequestBundle = {
  requestId: NaN,
  count: NaN,
  stages: [],
  requestInfo: {
    productName: undefined,
    createdAt: undefined,
  },
  isDraft: false,
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

export const updateStageRequest = createAsyncThunk(
  "stageRequest/updateStageRequest",
  async ({
    requestId,
    requestInfo,
  }: {
    requestId: number;
    requestInfo: StageRequestInfo;
  }) => {
    const requestParamsToSend = {
      product_name: requestInfo.productName || undefined,
    };
    const response = await api.stageRequests.stageRequestsUpdate(
      requestId,
      requestParamsToSend,
    );
    return response.data;
  },
);

export const updateStageInRequestAsync = createAsyncThunk(
  "stageRequest/updateStageInRequestAsync",
  async ({
    requestId,
    stageId,
    inputField1,
    inputField2,
  }: {
    requestId: number;
    stageId: number;
    inputField1?: number;
    inputField2?: number;
  }) => {
    const updateData: {
      input_field_1?: number;
      input_field_2?: number;
    } = {};

    if (inputField1 !== undefined) {
      updateData.input_field_1 = inputField1;
    }

    if (inputField2 !== undefined) {
      updateData.input_field_2 = inputField2;
    }

    const response = await api.stageRequestStages.stagesUpdate(
      requestId,
      stageId,
      updateData,
    );
    return response.data;
  },
);

export const formStageRequestAsync = createAsyncThunk(
  "stageRequest/formStageRequestAsync",
  async (requestId: number) => {
    const response = await api.stageRequests.formUpdate(requestId);
    return response.data;
  },
);

export const updateStageInStageRequest = createAsyncThunk(
  "stageRequest/updateStageInStageRequest",
  async ({
    requestId,
    stageId,
    stage,
  }: {
    requestId: number;
    stageId: number;
    stage: Stages;
  }) => {
    const requestParamsToSend = {
      input_field_1: stage.input_field_1 || undefined,
      input_field_2: stage.input_field_2 || undefined,
    };
    const response = await api.stageRequestStages.stagesUpdate(
      requestId,
      stageId,
      requestParamsToSend,
    );
    return response.data;
  },
);

export const deleteStageRequest = createAsyncThunk(
  "stageRequest/deleteStageRequest",
  async (requestId: number) => {
    const response = await api.stageRequests.stageRequestsDelete(requestId);
    return response.data;
  },
);

export const deleteStageFromRequest = createAsyncThunk(
  "stageRequest/deleteStageFromRequest",
  async ({ requestId, stageId }: { requestId: number; stageId: number }) => {
    await api.stageRequestStages.stagesDelete(requestId, stageId);
  },
);

const stageRequestSlice = createSlice({
  name: "stageRequest",
  initialState,
  reducers: {
    setRequestData: (
      state,
      action: PayloadAction<Partial<StageRequestInfo>>,
    ) => {
      state.requestInfo = {
        ...state.requestInfo,
        ...action.payload,
      };
    },
    setStageData: (
      state,
      action: PayloadAction<{
        stageId: number;
        field: "input_field_1" | "input_field_2";
        value: number;
      }>,
    ) => {
      const { stageId, field, value } = action.payload;
      const stageIndex = state.stages.findIndex(
        (stage) => stage.stage_id === stageId,
      );
      if (stageIndex !== -1) {
        state.stages[stageIndex] = {
          ...state.stages[stageIndex],
          [field]: value,
        };
      }
    },
    setStages: (state, action: PayloadAction<Stages[]>) => {
      state.stages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStageRequest.fulfilled, (state, action) => {
        const { stage_request_to_stages, product_name, id, created_at } =
          action.payload;
        if (stage_request_to_stages && id) {
          state.requestId = id;
          state.requestInfo = {
            productName: product_name,
            createdAt: created_at,
          };
          state.stages = stage_request_to_stages;
          state.isDraft = true;
        }
      })
      .addCase(deleteStageRequest.fulfilled, (state) => {
        state.requestId = NaN;
        state.count = NaN;
        state.stages = [];
        state.isDraft = false;
        state.requestInfo = {
          productName: undefined,
          createdAt: undefined,
        };
      })
      .addCase(updateStageRequest.fulfilled, (state, action) => {
        state.requestInfo = { ...action.payload, ...state.requestInfo };
      })
      .addCase(updateStageInStageRequest.fulfilled, (state, action) => {
        state.requestInfo = { ...action.payload, ...state.requestInfo };
      })
      .addCase(getStageRequest.rejected, (state, action) => {
        state.error = `Failed to fetch stage request: ${action.error.message}`;
      })
      .addCase(deleteStageRequest.rejected, (state, action) => {
        state.error = `Failed to delete stage request: ${action.error.message}`;
      })
      .addCase(updateStageRequest.rejected, (state, action) => {
        state.error = `Failed to update stage request: ${action.error.message}`;
      })
      .addCase(updateStageInStageRequest.rejected, (state, action) => {
        state.error = `Failed to update stage in stage request: ${action.error.message}`;
      })
      .addCase(updateStageInRequestAsync.fulfilled, () => {})
      .addCase(updateStageInRequestAsync.rejected, (state, action) => {
        state.error = `Failed to update stage fields: ${action.error.message}`;
      })
      .addCase(formStageRequestAsync.pending, (state) => {
        state.error = undefined;
      })
      .addCase(formStageRequestAsync.fulfilled, (state) => {
        state.isDraft = false;
        state.error = undefined;
      })
      .addCase(formStageRequestAsync.rejected, (state, action) => {
        state.error = `Failed to form stage request: ${action.error.message}`;
      });
  },
});

export const { setRequestData, setStages, setStageData } =
  stageRequestSlice.actions;
export default stageRequestSlice.reducer;
