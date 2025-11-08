import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStageByName } from "../modules/emissionAPI";

export const fetchStages = createAsyncThunk(
  "stagesFilter/fetchStages",
  async (searchValue: string = "", { rejectWithValue }) => {
    try {
      const response = await getStageByName(searchValue);
      return response.results || [];
    } catch (error) {
      console.error("Fetch stages error:", error);
      return rejectWithValue("Failed to fetch stages");
    }
  },
);

export const searchStages = createAsyncThunk(
  "stagesFilter/searchStages",
  async (searchValue: string, { rejectWithValue }) => {
    try {
      const response = await getStageByName(searchValue);
      return response.results || [];
    } catch (error) {
      console.error("Search stages error:", error);
      return rejectWithValue("Failed to search stages");
    }
  },
);
