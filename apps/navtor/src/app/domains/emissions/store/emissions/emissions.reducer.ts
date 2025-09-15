import { createReducer, on } from '@ngrx/store';
import { EmissionsState } from '../../models/emissions.model';
import * as EmissionsActions from './emissions.actions';

export const initialState: EmissionsState = {
  vesselEmissions: [],
  emissions: [],
  loading: false,
  error: null,
  selectedVesselId: null,
};

export const emissionsReducer = createReducer(
  initialState,
  on(EmissionsActions.loadEmissions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    EmissionsActions.loadEmissionsSuccess,
    (state, { vesselEmissions, emissions }) => ({
      ...state,
      vesselEmissions,
      emissions,
      loading: false,
      error: null,
    })
  ),
  on(EmissionsActions.loadEmissionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(EmissionsActions.selectVessel, (state, { vesselId }) => ({
    ...state,
    selectedVesselId: vesselId,
  }))
);
