import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vessel } from '../models/vessel.model';

@Injectable({
  providedIn: 'root',
})
export class VesselService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json';

  getVessels(): Observable<Vessel[]> {
    console.log('Fetching vessels from:', this.apiUrl);
    return this.http.get<Vessel[]>(this.apiUrl);
  }
}
