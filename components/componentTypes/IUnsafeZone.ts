export interface IUnsafeZoneRequest {
  markedBy: string;
  title: string;
  description: string;
  radius?: number;
  severityLevel: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface IUnsafeZoneResponse {
  _id: string;
  markedBy: string;
  title: string;
  description: string;
  radius: number;
  severityLevel: string;
  deleted?: boolean;
  location: {
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
  resolved: boolean;
  active: boolean;
}
