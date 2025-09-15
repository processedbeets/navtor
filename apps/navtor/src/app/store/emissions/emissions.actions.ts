import { createAction, props } from '@ngrx/store';
import { EmissionData, VesselEmissions } from '../../models/emissions.model';

export const loadEmissions = createAction('[Emissions] Load Emissions');

export const loadEmissionsSuccess = createAction(
  '[Emissions] Load Emissions Success',
  props<{ vesselEmissions: VesselEmissions[]; emissions: EmissionData[] }>()
);

export const loadEmissionsFailure = createAction(
  '[Emissions] Load Emissions Failure',
  props<{ error: string }>()
);

export const selectVessel = createAction(
  '[Emissions] Select Vessel',
  props<{ vesselId: number }>()
);
