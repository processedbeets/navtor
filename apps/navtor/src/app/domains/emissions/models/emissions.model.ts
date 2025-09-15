export interface EmissionDataPoint {
  report_from_utc: string;
  report_to_utc: string;
  co2_emissions: number;
  sox_emissions: number;
  nox_emissions: number;
  pm_emissions: number;
  ch4_emissions: number;
}

export interface VesselEmissions {
  id: number;
  timeSeries: EmissionDataPoint[];
}

export interface EmissionData {
  id: number;
  vesselId: number;
  vesselName: string;
  timestamp: string;
  nox: number;
  methane: number;
  pm: number;
  sox: number;
}

export interface EmissionsState {
  vesselEmissions: VesselEmissions[];
  emissions: EmissionData[];
  loading: boolean;
  error: string | null;
  selectedVesselId: number | null;
}

export interface ChartSeries {
  name: string;
  data: number[][];
  color: string;
}
