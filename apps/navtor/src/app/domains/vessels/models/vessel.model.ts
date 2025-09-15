export interface Vessel {
  id: number;
  name: string;
  mmsi: number;
  imo: number;
  companyId: number;
  companyName: string;
  startDate: string;
  active: boolean;
  vesselType: string;
}

export interface VesselState {
  vessels: Vessel[];
  loading: boolean;
  error: string | null;
}
