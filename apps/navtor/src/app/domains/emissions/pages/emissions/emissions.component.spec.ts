import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmissionsComponent } from './emissions.component';
import { EmissionsFacade } from '../../facades/emissions.facade';
import { EmissionData, ChartSeries } from '../../models/emissions.model';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('EmissionsComponent', () => {
  let component: EmissionsComponent;
  let fixture: ComponentFixture<EmissionsComponent>;
  let mockEmissionsFacade: Partial<EmissionsFacade>;

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

  const mockVesselOptions = [
    { id: 10001, name: 'Vessel 10001' },
    { id: 10002, name: 'Vessel 10002' },
  ];

  const mockChartData: ChartSeries[] = [
    {
      name: 'NOx',
      data: [
        [1672531200000, 2.8],
        [1672617600000, 2.8],
      ],
      color: '#00ff00',
    },
    {
      name: 'Methane',
      data: [
        [1672531200000, 1.51],
        [1672617600000, 1.51],
      ],
      color: '#ffff00',
    },
  ];

  beforeEach(async () => {
    mockEmissionsFacade = {
      loadEmissions: vi.fn(),
      selectVessel: vi.fn(),
      getChartData: vi.fn().mockReturnValue(mockChartData),
      vesselOptions$: of(mockVesselOptions),
      selectedVesselId$: of(10001),
      selectedVesselEmissions$: of(mockEmissions),
      loading$: of(false),
      error$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [EmissionsComponent],
      providers: [{ provide: EmissionsFacade, useValue: mockEmissionsFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadEmissions on init', () => {
    expect(mockEmissionsFacade.loadEmissions).toHaveBeenCalled();
  });

  it('should set vesselOptions from facade', () => {
    expect(component.vesselOptions).toEqual(mockVesselOptions);
  });

  it('should set loading state from facade', () => {
    expect(component.loading).toBe(false);
  });

  it('should set error state from facade', () => {
    expect(component.error).toBeNull();
  });

  it('should call getChartData with emissions data', () => {
    expect(mockEmissionsFacade.getChartData).toHaveBeenCalledWith(
      mockEmissions
    );
  });

  it('should set chartData from getChartData result', () => {
    expect(component.chartData).toEqual(mockChartData);
  });

  it('should select first vessel if none selected', () => {
    // Create a new component instance with different mock data
    const mockFacadeWithNullId = {
      ...mockEmissionsFacade,
      selectedVesselId$: of(null),
    };

    const testFixture = TestBed.createComponent(EmissionsComponent);
    const testComponent = testFixture.componentInstance;

    // Override the facade property directly
    testComponent['emissionsFacade'] = mockFacadeWithNullId as any;

    testComponent.ngOnInit();
    expect(testComponent.selectedVessel).toEqual(mockVesselOptions[0]);
    expect(mockFacadeWithNullId.selectVessel).toHaveBeenCalledWith(
      mockVesselOptions[0].id
    );
  });

  it('should call selectVessel when vessel changes', () => {
    const selectedVessel = { id: 10002, name: 'Vessel 10002' };
    component.selectedVessel = selectedVessel;
    component.onVesselChange();
    expect(mockEmissionsFacade.selectVessel).toHaveBeenCalledWith(10002);
  });

  it('should not call selectVessel if no vessel selected', () => {
    component.selectedVessel = null;
    component.onVesselChange();
    expect(mockEmissionsFacade.selectVessel).not.toHaveBeenCalled();
  });

  it('should destroy chart on component destroy', () => {
    // Mock the chart property
    const mockChart = { destroy: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component['chart'] = mockChart as any;
    component.ngOnDestroy();
    expect(mockChart.destroy).toHaveBeenCalled();
  });
});
