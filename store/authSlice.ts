import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  proximity: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  userEmail: null,
  proximity: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.proximity = action.payload.proximity;
    },
    logout: () => initialState,
  },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
