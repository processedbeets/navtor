import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmissionsState } from '../../models/emissions.model';

export const selectEmissionsState =
  createFeatureSelector<EmissionsState>('emissions');

export const selectAllEmissions = createSelector(
  selectEmissionsState,
  (state) => state.emissions
);

export const selectEmissionsLoading = createSelector(
  selectEmissionsState,
  (state) => state.loading
);

export const selectEmissionsError = createSelector(
  selectEmissionsState,
  (state) => state.error
);

export const selectSelectedVesselId = createSelector(
  selectEmissionsState,
  (state) => state.selectedVesselId
);

export const selectVesselOptions = createSelector(
  selectAllEmissions,
  (emissions) => {
    const uniqueVessels = emissions.reduce((acc, emission) => {
      if (!acc.find((v) => v.id === emission.vesselId)) {
        acc.push({
          id: emission.vesselId,
          name: emission.vesselName,
        });
      }
      return acc;
    }, [] as { id: number; name: string }[]);

    return uniqueVessels.sort((a, b) => a.name.localeCompare(b.name));
  }
);

export const selectSelectedVesselEmissions = createSelector(
  selectAllEmissions,
  selectSelectedVesselId,
  (emissions, selectedVesselId) => {
    if (!selectedVesselId) {
      return emissions;
    }
    return emissions.filter(
      (emission) => emission.vesselId === selectedVesselId
    );
  }
);
