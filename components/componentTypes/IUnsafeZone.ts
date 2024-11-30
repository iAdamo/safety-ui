export interface IUnsafeZoneRequest {
  markedBy: string;
  title: string;
  description: string;
  radius?: number;
  severityLevel: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  image?: string;
  audio?: string;
  video?: string;
  resolved: boolean;
  active: boolean;
}

export interface IUnsafeZoneResponse {
  _id: string;
  markedBy: string;
  title: string;
  description: string;
  radius: number;
  severityLevel: string;
  location: {
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedt: Date;
  image?: string;
  audio?: string;
  video?: string;
  resolved: boolean;
  active: boolean;
}
