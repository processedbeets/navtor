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
  length?: number;
  width?: number;
  draft?: number;
  grossTonnage?: number;
  deadweight?: number;
  yearBuilt?: number;
  flag?: string;
  callSign?: string;
  status?: string;
}

export interface VesselState {
  vessels: Vessel[];
  loading: boolean;
  error: string | null;
}
