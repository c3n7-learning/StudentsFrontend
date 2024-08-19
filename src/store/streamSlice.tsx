import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkStatus } from "./store";

export type ClassStream = {
  id?: number;
  name: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5267";

export const fetchStreams = createAsyncThunk(
  "streams/fetchStreams",
  async () => {
    return await fetch(`${API_URL}/api/ClassStreams/`, {
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      return (await response.json()) as Array<ClassStream>;
    });
  }
);

interface StreamSliceState {
  streams: Array<ClassStream>;
  streamsStatus: ThunkStatus;
}

const initialState: StreamSliceState = {
  streams: [],
  streamsStatus: "idle",
};

export const streamSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchStreams.pending, (state) => {
      state.streamsStatus = "pending";
    });
    builder.addCase(fetchStreams.rejected, (state) => {
      state.streamsStatus = "rejected";
    });
    builder.addCase(fetchStreams.fulfilled, (state, { payload }) => {
      state.streamsStatus = "fulfilled";
      state.streams = payload;
    });
  },
});
