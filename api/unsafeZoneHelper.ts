import axios from "axios";
import { IUnsafeZoneRequest } from "@/components/componentTypes";

const unsafeAxios = axios.create({
  baseURL: "https://r1w17jd5-3000.uks1.devtunnels.ms/api/unsafezone",
  withCredentials: true,
});

export const createUnsafeZone = async (data: IUnsafeZoneRequest) => {
  try {
    const response = await unsafeAxios.post("create/", data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

interface UpdateUnsafeZone {
  radius?: number;
  severityLevel?: "low" | "medium" | "high";
  description?: string;
  audio?: string;
  video?: string;
  resolved?: boolean;
  active?: boolean;
}

export const updateUnsafeZone = async (id: string, data: UpdateUnsafeZone) => {
  try {
    const response = await unsafeAxios.put(`${id}/`, data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserUnsafeZones = async (id: string) => {
  try {
    const response = await unsafeAxios.get(`user/${id}/`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

interface GetUnsafeZone {
  userLat: number;
  userLong: number;
  proximity?: number;
};

export const getUnsafeZone = async (id: string, data: GetUnsafeZone) => {
  try {
    const response = await unsafeAxios.get(`${id}/`, { params: data });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
