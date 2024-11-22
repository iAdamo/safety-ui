import axios from "axios";

const unsafeAxios = axios.create({
  baseURL: "http://127.0.0.1:3000/api/unsafezone",
  withCredentials: true,
});

interface CreateUnsafeZone {
  markedBy: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  radius?: number;
  severityLevel: "low" | "medium" | "high";
  description?: string;
  audio?: string;
  video?: string;
  resolved?: boolean;
  active?: boolean;
}

export const createUnsafeZone = async (data: CreateUnsafeZone) => {
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

interface GetUnsafeZone {
  userLat: number;
  userLong: number;
  proximityRange?: number;
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
