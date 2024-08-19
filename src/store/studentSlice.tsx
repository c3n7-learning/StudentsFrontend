import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThunkStatus } from "./store";
import { ClassStream } from "./streamSlice";

export type Student = {
  id?: number;
  firstName: string;
  surname: string;
  admissionNumber: string;
  classStreamId: string;
  classStream?: ClassStream;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5267";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    return await fetch(`${API_URL}/api/ClassStreams/`, {
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      return (await response.json()) as Array<Student>;
    });
  }
);

export const fetchStudentDetails = createAsyncThunk(
  "students/fetchStudentDetails",
  async ({ id }: { id: number }) => {
    return await fetch(`${API_URL}/api/ClassStreams/${id}`, {
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      return (await response.json()) as Student;
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
  "students/saveStream",
  async ({ id, name }: SaveClassStreamPayload, thunkApi) => {
    let url = `${API_URL}/api/ClassStreams/`;
    const body: SaveClassStreamPayload = { name };
    if (id) {
      url += `${id}`;
      body.id = id;
    }
    return await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

interface StudentSliceState {
  students: Array<Student>;
  studentsStatus: ThunkStatus;

  studentDetails: Student | null;
  studentDetailsStatus: ThunkStatus;
}

const initialState: StudentSliceState = {
  students: [],
  studentsStatus: "idle",

  studentDetails: null,
  studentDetailsStatus: "idle",
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchStudents.pending, (state) => {
      state.studentsStatus = "pending";
    });
    builder.addCase(fetchStudents.rejected, (state) => {
      state.studentsStatus = "rejected";
    });
    builder.addCase(fetchStudents.fulfilled, (state, { payload }) => {
      state.studentsStatus = "fulfilled";
      state.students = payload;
    });

    builder.addCase(fetchStudentDetails.pending, (state) => {
      state.studentDetailsStatus = "pending";
    });
    builder.addCase(fetchStudentDetails.rejected, (state) => {
      state.studentDetailsStatus = "rejected";
    });
    builder.addCase(fetchStudentDetails.fulfilled, (state, { payload }) => {
      state.studentDetailsStatus = "fulfilled";
      state.studentDetails = payload;
    });
  },
});
