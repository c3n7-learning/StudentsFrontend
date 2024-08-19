import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { streamSlice } from "./streamSlice";
import { studentSlice } from "./studentSlice";

export const store = configureStore({
  reducer: {
    streams: streamSlice.reducer,
    students: studentSlice.reducer,
  },
});

export type ThunkStatus = "idle" | "pending" | "rejected" | "fulfilled";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
