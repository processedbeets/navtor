import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { EmissionsFacade } from './emissions.facade';
import { EmissionData } from '../models/emissions.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { take } from 'rxjs/operators';
import * as EmissionsActions from '../store/emissions/emissions.actions';

describe('EmissionsFacade', () => {
  let facade: EmissionsFacade;
  let store: MockStore;
  let dispatchSpy: ReturnType<typeof vi.fn>;

  const mockEmissions: EmissionData[] = [
    {
      id: 1,
      vesselId: 10001,
      vesselName: 'Vessel 10001',
      timestamp: '2023-01-01T00:00:00Z',
      nox: 2.8,
      methane: 1.51,
      pm: 0.37097,
      sox: 1.62,
    },
    {
      id: 2,
      vesselId: 10001,
      vesselName: 'Vessel 10001',
      timestamp: '2023-01-02T00:00:00Z',
      nox: 2.8,
      methane: 1.51,
      pm: 0.37097,
      sox: 1.62,
    },
  ];

  const initialState = {
    emissions: {
      vesselEmissions: [],
      emissions: mockEmissions,
      loading: false,
      error: null,
      selectedVesselId: 10001,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmissionsFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(EmissionsFacade);
    store = TestBed.inject(MockStore);
    dispatchSpy = vi.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch loadEmissions action', () => {
    facade.loadEmissions();
    expect(dispatchSpy).toHaveBeenCalledWith(EmissionsActions.loadEmissions());
  });

  it('should dispatch selectVessel action', () => {
    const vesselId = 10002;
    facade.selectVessel(vesselId);
    expect(dispatchSpy).toHaveBeenCalledWith(
      EmissionsActions.selectVessel({ vesselId })
    );
  });

  it('should select emissions from store', async () => {
    const emissions = await facade.emissions$.pipe(take(1)).toPromise();
    expect(emissions).toEqual(mockEmissions);
  });

  it('should select loading state from store', async () => {
    const loading = await facade.loading$.pipe(take(1)).toPromise();
    expect(loading).toBe(false);
  });

  it('should select error state from store', async () => {
    const error = await facade.error$.pipe(take(1)).toPromise();
    expect(error).toBeNull();
  });

  it('should select vessel options from store', async () => {
    const options = await facade.vesselOptions$.pipe(take(1)).toPromise();
    expect(options).toEqual([{ id: 10001, name: 'Vessel 10001' }]);
  });

  it('should select selected vessel ID from store', async () => {
    const vesselId = await facade.selectedVesselId$.pipe(take(1)).toPromise();
    expect(vesselId).toBe(10001);
  });

  it('should select selected vessel emissions from store', async () => {
    const emissions = await facade.selectedVesselEmissions$
      .pipe(take(1))
      .toPromise();
    expect(emissions).toEqual(mockEmissions);
  });

  describe('getChartData', () => {
    it('should return empty array for empty emissions', () => {
      const result = facade.getChartData([]);
      expect(result).toEqual([]);
    });

    it('should transform emissions data to chart series', () => {
      const result = facade.getChartData(mockEmissions);

      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('NOx');
      expect(result[1].name).toBe('Methane');
      expect(result[2].name).toBe('PM');
      expect(result[3].name).toBe('SOx');

      expect(result[0].data).toHaveLength(2);
      expect(result[0].data[0]).toEqual([1672531200000, 2.8]);
      expect(result[1].data[0]).toEqual([1672531200000, 1.51]);
    });

    it('should sort emissions by timestamp', () => {
      const unsortedEmissions = [
        { ...mockEmissions[1], timestamp: '2023-01-02T00:00:00Z' },
        { ...mockEmissions[0], timestamp: '2023-01-01T00:00:00Z' },
      ];

      const result = facade.getChartData(unsortedEmissions);
      expect(result[0].data[0][0]).toBeLessThan(result[0].data[1][0]);
    });

    it('should use correct colors for each series', () => {
      const result = facade.getChartData(mockEmissions);

      expect(result[0].color).toBe('#00ff00'); // NOx - Green
      expect(result[1].color).toBe('#ffff00'); // Methane - Yellow
      expect(result[2].color).toBe('#ff0000'); // PM - Red
      expect(result[3].color).toBe('#0000ff'); // SOx - Blue
    });
  });
});
