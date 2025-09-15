import { EmissionsState } from '../../models/emissions.model';
import { emissionsReducer } from './emissions.reducer';
import * as EmissionsActions from './emissions.actions';
import { describe, it, expect } from 'vitest';

describe('EmissionsReducer', () => {
  const initialState: EmissionsState = {
    vesselEmissions: [],
    emissions: [],
    loading: false,
    error: null,
    selectedVesselId: null,
  };

  const mockVesselEmissions = [
    {
      id: 10001,
      timeSeries: [
        {
          report_from_utc: '2023-01-01T00:00:00Z',
          report_to_utc: '2023-01-02T00:00:00Z',
          co2_emissions: 94.05,
          sox_emissions: 1.62,
          nox_emissions: 2.8,
          pm_emissions: 0.37097,
          ch4_emissions: 1.51,
        },
      ],
    },
  ];

  const mockEmissions = [
    {
      id: 1,
      vesselId: 10001,
      vesselName: 'Vessel 10001',
      timestamp: '2023-01-01T00:00:00Z',
      nox: 2.8,
      methane: 1.51,
      pm: 0.37097,
      sox: 1.62,
    },
  ];

  it('should return the initial state', () => {
    const action = { type: 'unknown' };
    const result = emissionsReducer(initialState, action);
    expect(result).toBe(initialState);
  });

  it('should handle loadEmissions', () => {
    const action = EmissionsActions.loadEmissions();
    const result = emissionsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('should handle loadEmissionsSuccess', () => {
    const action = EmissionsActions.loadEmissionsSuccess({
      vesselEmissions: mockVesselEmissions,
      emissions: mockEmissions,
    });
    const result = emissionsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      vesselEmissions: mockVesselEmissions,
      emissions: mockEmissions,
      loading: false,
      error: null,
    });
  });

  it('should handle loadEmissionsFailure', () => {
    const errorMessage = 'Test error';
    const action = EmissionsActions.loadEmissionsFailure({
      error: errorMessage,
    });
    const result = emissionsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage,
    });
  });

  it('should handle selectVessel', () => {
    const vesselId = 10002;
    const action = EmissionsActions.selectVessel({ vesselId });
    const result = emissionsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      selectedVesselId: vesselId,
    });
  });
});
