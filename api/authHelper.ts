import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://127.0.0.1:3000/api/auth",
  withCredentials: true,
});

interface AuthData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

export const registerUser = async (data: AuthData) => {
  try {
    const response = await authAxios.post("register/", data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Verify email
export const verifyEmail = async (data: { email: string; code: string }) => {
  try {
    const response = await authAxios.post("verify-email/", data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Resend verification code
export const sendCode = async (data: { email: string }) => {
  try {
    const response = await authAxios.post("send-code/", data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export interface LoginResponse {
  id: string;
  email: string;
}

export const loginUser = async (data: AuthData) => {
  try {
    const response = await authAxios.post("login/", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const response = await authAxios.post("logout/");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const resetPassword = async (data: {email: string; password: string}) => {
  try {
    const response = await authAxios.post("reset-password/", data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}