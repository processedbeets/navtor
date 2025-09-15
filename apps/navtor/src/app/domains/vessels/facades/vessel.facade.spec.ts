import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { VesselFacade } from './vessel.facade';
import { Vessel } from '../models/vessel.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { take } from 'rxjs/operators';
import * as VesselActions from '../store/vessel/vessel.actions';

describe('VesselFacade', () => {
  let facade: VesselFacade;
  let store: MockStore;
  let dispatchSpy: ReturnType<typeof vi.fn>;

  const mockVessels: Vessel[] = [
    {
      id: 10001,
      name: 'MS Alpha',
      mmsi: 999999901,
      imo: 1023401,
      companyId: 2301,
      companyName: 'Alpha Company',
      startDate: '1998-01-01T00:00:00Z',
      active: true,
      vesselType: 'Dry Cargo',
    },
  ];

  const initialState = {
    vessels: {
      vessels: mockVessels,
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VesselFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(VesselFacade);
    store = TestBed.inject(MockStore);
    dispatchSpy = vi.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch loadVessels action', () => {
    facade.loadVessels();
    expect(dispatchSpy).toHaveBeenCalledWith(VesselActions.loadVessels());
  });

  it('should select vessels from store', async () => {
    const vessels = await facade.vessels$.pipe(take(1)).toPromise();
    expect(vessels).toEqual(mockVessels);
  });

  it('should select loading state from store', async () => {
    const loading = await facade.loading$.pipe(take(1)).toPromise();
    expect(loading).toBe(false);
  });

  it('should select error state from store', async () => {
    const error = await facade.error$.pipe(take(1)).toPromise();
    expect(error).toBeNull();
  });
});
