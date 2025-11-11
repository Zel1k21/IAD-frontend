import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Stages } from "../modules/emissionAPI";
import { fetchStages, searchStages } from "./stagesThunks";

interface StagesFilterState {
  searchValue: string;
  loading: boolean;
  stages: Stages[];
  error: string | null;
  loadedFromStorage: boolean;
}

const loadStateFromStorage = (): StagesFilterState => {
  try {
    const serializedState = localStorage.getItem("stagesFilterState");
    if (serializedState === null) {
      return {
        searchValue: "",
        loading: false,
        stages: [],
        error: null,
        loadedFromStorage: false,
      };
    }
    const state = JSON.parse(serializedState);
    state.loadedFromStorage =
      state.loadedFromStorage !== undefined ? state.loadedFromStorage : true;
    return state;
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return {
      searchValue: "",
      loading: false,
      stages: [],
      error: null,
      loadedFromStorage: false,
    };
  }
};

const saveStateToStorage = (state: StagesFilterState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("stagesFilterState", serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

const initialState: StagesFilterState = loadStateFromStorage();

export const stagesSlice = createSlice({
  name: "stagesFilter",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    setStages: (state, action: PayloadAction<Stages[]>) => {
      state.stages = action.payload;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    resetFilter: (state) => {
      state.searchValue = "";
      state.stages = [];
      state.error = null;
      state.loadedFromStorage = false;
      saveStateToStorage(state);
    },
    clearError: (state) => {
      state.error = null;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    clearPersistedState: () => {
      localStorage.removeItem("stagesFilterState");
      return {
        searchValue: "",
        loading: false,
        stages: [],
        error: null,
        loadedFromStorage: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.loading = false;
        state.stages = action.payload;
        state.loadedFromStorage = true;
        saveStateToStorage(state);
      })
      .addCase(fetchStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.stages = [];
        state.loadedFromStorage = true;
        saveStateToStorage(state);
      })
      .addCase(searchStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStages.fulfilled, (state, action) => {
        state.loading = false;
        state.stages = action.payload;
        state.loadedFromStorage = true;
        saveStateToStorage(state);
      })
      .addCase(searchStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.stages = [];
        saveStateToStorage(state);
      });
  },
});

export const {
  setSearchValue,
  setLoading,
  setStages,
  resetFilter,
  clearError,
  clearPersistedState,
} = stagesSlice.actions;

export default stagesSlice.reducer;
