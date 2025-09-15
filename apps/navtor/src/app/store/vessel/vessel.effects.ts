import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { VesselService } from '../../services/vessel.service';
import * as VesselActions from './vessel.actions';

@Injectable()
export class VesselEffects {
  private readonly actions$ = inject(Actions);
  private readonly vesselService = inject(VesselService);

  loadVessels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VesselActions.loadVessels),
      switchMap(() => {
        console.log('VesselEffects: Loading vessels...');
        return this.vesselService.getVessels().pipe(
          map((vessels) => {
            console.log('VesselEffects: Vessels loaded successfully:', vessels);
            return VesselActions.loadVesselsSuccess({ vessels });
          }),
          catchError((error) => {
            console.error('VesselEffects: Error loading vessels:', error);
            return of(
              VesselActions.loadVesselsFailure({ error: error.message })
            );
          })
        );
      })
    )
  );
}
