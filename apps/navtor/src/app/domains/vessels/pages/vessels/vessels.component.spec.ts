import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VesselsComponent } from './vessels.component';
import { VesselFacade } from '../../facades/vessel.facade';
import { Vessel } from '../../models/vessel.model';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('VesselsComponent', () => {
  let component: VesselsComponent;
  let fixture: ComponentFixture<VesselsComponent>;
  let mockVesselFacade: Partial<VesselFacade>;

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
    {
      id: 10002,
      name: 'MS Beta',
      mmsi: 999999902,
      imo: 1023402,
      companyId: 2302,
      companyName: 'Beta Company',
      startDate: '1999-01-01T00:00:00Z',
      active: true,
      vesselType: 'Container',
    },
  ];

  beforeEach(async () => {
    mockVesselFacade = {
      loadVessels: vi.fn(),
      vessels$: of(mockVessels),
      loading$: of(false),
      error$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [VesselsComponent],
      providers: [{ provide: VesselFacade, useValue: mockVesselFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(VesselsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadVessels on init', () => {
    expect(mockVesselFacade.loadVessels).toHaveBeenCalled();
  });

  it('should set rowData from vessels$', () => {
    expect(component.rowData).toEqual(mockVessels);
  });

  it('should have correct column definitions', () => {
    expect(component.colDefs).toEqual([
      { field: 'name', headerName: 'Name' },
      { field: 'mmsi', headerName: 'MMSI' },
      { field: 'imo', headerName: 'IMO' },
      { field: 'companyName', headerName: 'Company Name' },
      { field: 'vesselType', headerName: 'Vessel Type' },
    ]);
  });

  it('should have correct default column definition', () => {
    expect(component.defaultColDef).toEqual({ flex: 1 });
  });

  it('should update loading signal when loading$ emits', () => {
    mockVesselFacade.loading$ = of(true);
    component.ngOnInit();
    expect(component.loading()).toBe(true);
  });

  it('should update error signal when error$ emits', () => {
    const errorMessage = 'Test error';
    mockVesselFacade.error$ = of(errorMessage);
    component.ngOnInit();
    expect(component.error()).toBe(errorMessage);
  });

  it('should have quartz theme configured', () => {
    expect(component.quartzTheme).toBeDefined();
  });
});
