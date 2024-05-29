import { UserState } from "@/core/domain/entities/user.entity";
import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLogin } from "../actions";

const initialState: UserState = {
  isLoggedIn: false,
  status: RequestEnum.PENDING,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.status = RequestEnum.PENDING;
    },
    setStatus: (state, action: PayloadAction<UserState["status"]>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.status = RequestEnum.PENDING;
    });
    builder.addCase(userLogin.fulfilled, (state) => {
      state.isLoggedIn = true;
      state.status = RequestEnum.FULFILLED;
    });
    builder.addCase(userLogin.rejected, (state) => {
      state.status = RequestEnum.REJECTED;
    });
  },
});


export const { logout, setStatus } = userSlice.actions;
export default userSlice.reducer;