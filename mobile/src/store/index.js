import { configureStore, createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: { token: null, departments: [], doctors: [] },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setDepartments(state, action) {
      state.departments = action.payload;
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
    }
  }
});

export const { setToken, setDepartments, setDoctors } = appSlice.actions;

export const store = configureStore({
  reducer: { app: appSlice.reducer }
});
