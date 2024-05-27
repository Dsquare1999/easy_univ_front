import { UserState } from "@/core/domain/entities/user.entity";
import { RequestEnum } from "@/core/domain/enums/request.enum";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
});

export default userSlice.reducer;