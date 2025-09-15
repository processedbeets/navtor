import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EmissionData, VesselEmissions } from '../models/emissions.model';

@Injectable({
  providedIn: 'root',
})
export class EmissionsService {
  private readonly apiUrl =
    'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json';

  constructor(private readonly http: HttpClient) {}

  getEmissions(): Observable<EmissionData[]> {
    return this.http.get<VesselEmissions[]>(this.apiUrl).pipe(
      map((vesselEmissions) => {
        const allEmissions: EmissionData[] = [];

        vesselEmissions.forEach((vessel) => {
          vessel.timeSeries.forEach((dataPoint) => {
            allEmissions.push({
              id: allEmissions.length + 1, // Generate unique ID
              vesselId: vessel.id,
              vesselName: `Vessel ${vessel.id}`, // Generate vessel name
              timestamp: dataPoint.report_from_utc, // Map from API field
              nox: dataPoint.nox_emissions, // Map from API field
              methane: dataPoint.ch4_emissions, // Map from API field
              pm: dataPoint.pm_emissions, // Map from API field
              sox: dataPoint.sox_emissions, // Map from API field
            });
          });
        });

        return allEmissions;
      })
    );
  }
}
