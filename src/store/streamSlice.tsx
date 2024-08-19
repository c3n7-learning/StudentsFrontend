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

export type SaveClassStreamPayload = {
  id?: number;
  name: string;
};

export type SaveClassStreamResponse = {
  id?: number;
  name?: string;
  message?: string;
};

export const saveStream = createAsyncThunk(
  "streams/saveStream",
  async ({ id, name }: SaveClassStreamPayload, thunkApi) => {
    let url = `${API_URL}/api/ClassStreams/`;
    if (id) {
      url += `${id}/`;
    }
    return await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }).then(async (response) => {
      let result: SaveClassStreamResponse | null = null;
      if (response.headers.get("content-type") === "application/json") {
        result = (await response.json()) as SaveClassStreamResponse;
      }

      if (!response.ok) {
        result ??= { message: "Operation Failed" };
        return thunkApi.rejectWithValue(result);
      }

      return result;
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
