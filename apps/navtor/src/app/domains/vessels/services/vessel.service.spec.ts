import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { VesselService } from './vessel.service';
import { Vessel } from '../models/vessel.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('VesselService', () => {
  let service: VesselService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VesselService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(VesselService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vessels from API', () => {
    service.getVessels().subscribe((vessels) => {
      expect(vessels).toEqual(mockVessels);
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockVessels);
  });

  it('should handle API error', () => {
    service.getVessels().subscribe({
      next: () => expect.fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Http failure response');
        expect(error.message).toContain('500 Internal Server Error');
      },
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json'
    );
    req.flush('API Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should return empty array if API returns empty response', () => {
    service.getVessels().subscribe((vessels) => {
      expect(vessels).toEqual([]);
    });

    const req = httpMock.expectOne(
      'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json'
    );
    req.flush([]);
  });
});
