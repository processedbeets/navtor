import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EmissionsService } from './emissions.service';
import { EmissionData, VesselEmissions } from '../models/emissions.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('EmissionsService', () => {
  let service: EmissionsService;
  let httpMock: HttpTestingController;

  const mockVesselEmissions: VesselEmissions[] = [
    {
      id: 10001,
      timeSeries: [
        {
          report_from_utc: '2023-01-01T00:00:00Z',
          report_to_utc: '2023-01-02T00:00:00Z',
          co2_emissions: 94.05,
          sox_emissions: 1.62,
          nox_emissions: 2.8,
          pm_emissions: 0.37097,
          ch4_emissions: 1.51,
        },
        {
          report_from_utc: '2023-01-02T00:00:00Z',
          report_to_utc: '2023-01-03T00:00:00Z',
          co2_emissions: 94.05,
          sox_emissions: 1.62,
          nox_emissions: 2.8,
          pm_emissions: 0.37097,
          ch4_emissions: 1.51,
        },
      ],
    },
  ];

  const expectedEmissionData: EmissionData[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmissionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EmissionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and transform emissions data from API', () => {
    service.getEmissions().subscribe((emissions) => {
      expect(emissions).toEqual(expectedEmissionData);
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockVesselEmissions);
  });

  it('should handle API error', () => {
    service.getEmissions().subscribe({
      next: () => expect.fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Http failure response');
        expect(error.message).toContain('500 Internal Server Error');
      },
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json'
    );
    req.flush('API Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should return empty array if API returns empty response', () => {
    service.getEmissions().subscribe((emissions) => {
      expect(emissions).toEqual([]);
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json'
    );
    req.flush([]);
  });

  it('should generate unique IDs for emission data', () => {
    service.getEmissions().subscribe((emissions) => {
      expect(emissions[0].id).toBe(1);
      expect(emissions[1].id).toBe(2);
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json'
    );
    req.flush(mockVesselEmissions);
  });

  it('should generate vessel names correctly', () => {
    service.getEmissions().subscribe((emissions) => {
      expect(emissions[0].vesselName).toBe('Vessel 10001');
      expect(emissions[0].vesselId).toBe(10001);
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json'
    );
    req.flush(mockVesselEmissions);
  });
});
