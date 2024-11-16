import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://127.0.0.1:3000/api/auth",
  withCredentials: true,
});

interface AuthData {
  email: string;
  password: string;
}

/**
 *
 * @param data  {email, password}
 * @returns  response.data
 */
export interface RegisterResponse {
  id: string;
  email: string;
}

export const createUser = async (data: AuthData) => {
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

// Resend verification email
export const resendEmail = async (data: { email: string }) => {
  try {
    const response = await authAxios.post("resend-verification/", data);
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
