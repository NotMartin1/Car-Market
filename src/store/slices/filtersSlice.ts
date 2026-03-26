import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type VehicleType = "car" | "suv" | "truck" | "motorcycle" | "van" | "rv" | "boat" | "other" | "";
export type Condition   = "excellent" | "good" | "fair" | "poor" | "";

export interface FiltersState {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  location: string;
  condition: Condition;
  vehicleType: VehicleType;
  search: string;
}

const initialState: FiltersState = {
  make:        "",
  model:       "",
  yearMin:     "",
  yearMax:     "",
  priceMin:    "",
  priceMax:    "",
  location:    "",
  condition:   "",
  vehicleType: "",
  search:      "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setMake(state, action: PayloadAction<string>)         { state.make        = action.payload; },
    setModel(state, action: PayloadAction<string>)        { state.model       = action.payload; },
    setYearMin(state, action: PayloadAction<string>)      { state.yearMin     = action.payload; },
    setYearMax(state, action: PayloadAction<string>)      { state.yearMax     = action.payload; },
    setPriceMin(state, action: PayloadAction<string>)     { state.priceMin    = action.payload; },
    setPriceMax(state, action: PayloadAction<string>)     { state.priceMax    = action.payload; },
    setLocation(state, action: PayloadAction<string>)     { state.location    = action.payload; },
    setCondition(state, action: PayloadAction<Condition>) { state.condition   = action.payload; },
    setVehicleType(state, action: PayloadAction<VehicleType>) { state.vehicleType = action.payload; },
    setSearch(state, action: PayloadAction<string>)       { state.search      = action.payload; },
    clearFilters()                                        { return initialState; },
    initFromUrl(state, action: PayloadAction<Partial<FiltersState>>) {
      return { ...initialState, ...action.payload };
    },
  },
});

export const {
  setMake, setModel, setYearMin, setYearMax,
  setPriceMin, setPriceMax, setLocation,
  setCondition, setVehicleType, setSearch,
  clearFilters, initFromUrl,
} = filtersSlice.actions;

export default filtersSlice.reducer;
