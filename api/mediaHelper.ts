import axios from "axios";


const mediaAxios = axios.create({
  baseURL: "https://r1w17jd5-3000.uks1.devtunnels.ms/api/media",
  withCredentials: true,
});

export interface MediaItem {
  uri: string;
  type: "image" | "video";
}

export const uploadMedia = async (
  mediaItems: MediaItem[],
  uploadedBy: string,
  unsafeZoneId: string
): Promise<any[]> => {
  const data = new FormData();

  mediaItems.forEach((item, index) => {
    const fileType = item.type === "image" ? "image/jpeg" : "video/mp4";
    // const fileName = item.type === "image" ? `image${index}_${unsafeZoneId}.jpg` : `video${index}_${unsafeZoneId}.mp4`;

    data.append("media", {
      uri: item.uri,
      name: item.uri.split("/").pop(),
      type: fileType,
    } as any);
  });

  // Append additional information
  data.append("uploadedBy", uploadedBy);
  data.append("unsafeZoneId", unsafeZoneId);

  try {
    const response = await mediaAxios.post("upload/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error uploading media:", err);
    throw err;
  }
};

export const getMedia = async (zoneId: string): Promise<{ url: string; type: "image" | "video" }[]> => {
  try {
    const response = await mediaAxios.get(`/${zoneId}`);
    return response.data;
  } catch (err) {
    console.error("Error getting media:", err);
    throw err;
  }
};
