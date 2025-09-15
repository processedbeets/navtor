import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmissionsService } from '../../services/emissions.service';
import * as EmissionsActions from './emissions.actions';

@Injectable()
export class EmissionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly emissionsService = inject(EmissionsService);

  loadEmissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmissionsActions.loadEmissions),
      switchMap(() => {
        return this.emissionsService.getEmissions().pipe(
          map((emissions) => {
            // Create vessel emissions structure from the flattened data
            const vesselMap = new Map<
              number,
              Array<{
                report_from_utc: string;
                report_to_utc: string;
                co2_emissions: number;
                sox_emissions: number;
                nox_emissions: number;
                pm_emissions: number;
                ch4_emissions: number;
              }>
            >();
            emissions.forEach((emission) => {
              if (!vesselMap.has(emission.vesselId)) {
                vesselMap.set(emission.vesselId, []);
              }
              const timeSeries = vesselMap.get(emission.vesselId);
              if (timeSeries) {
                timeSeries.push({
                  report_from_utc: emission.timestamp,
                  report_to_utc: emission.timestamp, // Use same timestamp for both
                  co2_emissions: 0, // Not used in our chart
                  sox_emissions: emission.sox,
                  nox_emissions: emission.nox,
                  pm_emissions: emission.pm,
                  ch4_emissions: emission.methane,
                });
              }
            });

            const vesselEmissions = Array.from(vesselMap.entries()).map(
              ([vesselId, timeSeries]) => ({
                id: vesselId,
                timeSeries,
              })
            );

            return EmissionsActions.loadEmissionsSuccess({
              vesselEmissions,
              emissions,
            });
          }),
          catchError((error) => {
            return of(
              EmissionsActions.loadEmissionsFailure({ error: error.message })
            );
          })
        );
      })
    )
  );
}
