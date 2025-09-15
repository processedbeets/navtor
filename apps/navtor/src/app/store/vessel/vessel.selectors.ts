import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VesselState } from '../../models/vessel.model';

export const selectVesselState = createFeatureSelector<VesselState>('vessels');

export const selectAllVessels = createSelector(
  selectVesselState,
  (state) => state.vessels
);

export const selectVesselsLoading = createSelector(
  selectVesselState,
  (state) => state.loading
);

export const selectVesselsError = createSelector(
  selectVesselState,
  (state) => state.error
);
