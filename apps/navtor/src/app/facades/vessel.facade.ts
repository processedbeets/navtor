import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Vessel } from '../models/vessel.model';
import * as VesselActions from '../store/vessel/vessel.actions';
import * as VesselSelectors from '../store/vessel/vessel.selectors';

@Injectable({
  providedIn: 'root',
})
export class VesselFacade {
  private readonly store = inject(Store);

  // Selectors
  vessels$: Observable<Vessel[]> = this.store.select(
    VesselSelectors.selectAllVessels
  );
  loading$: Observable<boolean> = this.store.select(
    VesselSelectors.selectVesselsLoading
  );
  error$: Observable<string | null> = this.store.select(
    VesselSelectors.selectVesselsError
  );

  // Actions
  loadVessels(): void {
    this.store.dispatch(VesselActions.loadVessels());
  }
}
