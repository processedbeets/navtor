import { createReducer, on } from '@ngrx/store';
import { VesselState } from '../../models/vessel.model';
import * as VesselActions from './vessel.actions';

export const initialState: VesselState = {
  vessels: [],
  loading: false,
  error: null,
};

export const vesselReducer = createReducer(
  initialState,
  on(VesselActions.loadVessels, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(VesselActions.loadVesselsSuccess, (state, { vessels }) => ({
    ...state,
    vessels,
    loading: false,
    error: null,
  })),
  on(VesselActions.loadVesselsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
