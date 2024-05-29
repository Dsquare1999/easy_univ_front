import { createAsyncThunk } from "@reduxjs/toolkit";
import { useLoginMutation } from "@/core/infra/api";

export const login = createAsyncThunk(
  "user/login",
  async (payload: { email: string; password: string }, thunkAPI) => {
    const [login, { isLoading }] = useLoginMutation();

    const response = await login(payload);
    console.log(response);
    // if (response.ok) {
    //   return await response.json();
    // } else {
    //   return thunkAPI.rejectWithValue(await response.json());
    // }
  }
);
