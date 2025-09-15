import { createAction, props } from '@ngrx/store';
import { Vessel } from '../../models/vessel.model';

export const loadVessels = createAction('[Vessel] Load Vessels');

export const loadVesselsSuccess = createAction(
  '[Vessel] Load Vessels Success',
  props<{ vessels: Vessel[] }>()
);

export const loadVesselsFailure = createAction(
  '[Vessel] Load Vessels Failure',
  props<{ error: string }>()
);
