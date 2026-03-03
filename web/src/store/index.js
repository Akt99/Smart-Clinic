import { configureStore, createSlice } from "@reduxjs/toolkit";

const clinicSlice = createSlice({
  name: "clinic",
  initialState: { appointments: [], doctors: [] },
  reducers: {
    setAppointments(state, action) {
      state.appointments = action.payload;
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
    }
  }
});

export const { setAppointments, setDoctors } = clinicSlice.actions;

export const store = configureStore({
  reducer: { clinic: clinicSlice.reducer }
});
