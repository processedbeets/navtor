import { VesselState } from '../../models/vessel.model';
import { vesselReducer } from './vessel.reducer';
import * as VesselActions from './vessel.actions';
import { describe, it, expect } from 'vitest';

describe('VesselReducer', () => {
  const initialState: VesselState = {
    vessels: [],
    loading: false,
    error: null,
  };

  const mockVessels = [
    {
      id: 10001,
      name: 'MS Alpha',
      mmsi: 999999901,
      imo: 1023401,
      companyId: 2301,
      companyName: 'Alpha Company',
      startDate: '1998-01-01T00:00:00Z',
      active: true,
      vesselType: 'Dry Cargo',
    },
  ];

  it('should return the initial state', () => {
    const action = { type: 'unknown' };
    const result = vesselReducer(initialState, action);
    expect(result).toBe(initialState);
  });

  it('should handle loadVessels', () => {
    const action = VesselActions.loadVessels();
    const result = vesselReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('should handle loadVesselsSuccess', () => {
    const action = VesselActions.loadVesselsSuccess({ vessels: mockVessels });
    const result = vesselReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      vessels: mockVessels,
      loading: false,
      error: null,
    });
  });

  it('should handle loadVesselsFailure', () => {
    const errorMessage = 'Test error';
    const action = VesselActions.loadVesselsFailure({ error: errorMessage });
    const result = vesselReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage,
    });
  });
});
