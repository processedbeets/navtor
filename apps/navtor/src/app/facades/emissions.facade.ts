import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmissionData, ChartSeries } from '../models/emissions.model';
import * as EmissionsActions from '../store/emissions/emissions.actions';
import * as EmissionsSelectors from '../store/emissions/emissions.selectors';

@Injectable({
  providedIn: 'root',
})
export class EmissionsFacade {
  // Selectors
  readonly emissions$: Observable<EmissionData[]>;
  readonly loading$: Observable<boolean>;
  readonly error$: Observable<string | null>;
  readonly vesselOptions$: Observable<{ id: number; name: string }[]>;
  readonly selectedVesselId$: Observable<number | null>;
  readonly selectedVesselEmissions$: Observable<EmissionData[]>;

  constructor(private readonly store: Store) {
    this.emissions$ = this.store.select(EmissionsSelectors.selectAllEmissions);
    this.loading$ = this.store.select(
      EmissionsSelectors.selectEmissionsLoading
    );
    this.error$ = this.store.select(EmissionsSelectors.selectEmissionsError);
    this.vesselOptions$ = this.store.select(
      EmissionsSelectors.selectVesselOptions
    );
    this.selectedVesselId$ = this.store.select(
      EmissionsSelectors.selectSelectedVesselId
    );
    this.selectedVesselEmissions$ = this.store.select(
      EmissionsSelectors.selectSelectedVesselEmissions
    );
  }

  // Actions
  loadEmissions(): void {
    this.store.dispatch(EmissionsActions.loadEmissions());
  }

  selectVessel(vesselId: number): void {
    this.store.dispatch(EmissionsActions.selectVessel({ vesselId }));
  }

  // Helper method to get chart data
  getChartData(emissions: EmissionData[]): ChartSeries[] {
    if (!emissions.length) {
      return [];
    }

    const sortedEmissions = [...emissions].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const noxData = sortedEmissions.map((emission) => [
      new Date(emission.timestamp).getTime(),
      emission.nox,
    ]);

    const methaneData = sortedEmissions.map((emission) => [
      new Date(emission.timestamp).getTime(),
      emission.methane,
    ]);

    const pmData = sortedEmissions.map((emission) => [
      new Date(emission.timestamp).getTime(),
      emission.pm,
    ]);

    const soxData = sortedEmissions.map((emission) => [
      new Date(emission.timestamp).getTime(),
      emission.sox,
    ]);

    const chartSeries = [
      {
        name: 'NOx',
        data: noxData,
        color: '#00ff00',
      },
      {
        name: 'Methane',
        data: methaneData,
        color: '#ffff00',
      },
      {
        name: 'PM',
        data: pmData,
        color: '#ff0000',
      },
      {
        name: 'SOx',
        data: soxData,
        color: '#0000ff',
      },
    ];

    return chartSeries;
  }
}
