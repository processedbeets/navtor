import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  colorSchemeDarkBlue,
} from 'ag-grid-community';
import { VesselFacade } from '../../facades/vessel.facade';
import { Vessel } from '../../models/vessel.model';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-vessels',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './vessels.component.html',
  styleUrl: './vessels.component.css',
})
export class VesselsComponent implements OnInit {
  private readonly vesselFacade = inject(VesselFacade);

  // AG Grid Quartz theme
  quartzTheme = themeQuartz.withPart(colorSchemeDarkBlue);

  // Row Data: The data to be displayed.
  rowData: Vessel[] = [];
  loading = signal(false);
  error = signal<string | null>(null);

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<Vessel>[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'mmsi', headerName: 'MMSI' },
    { field: 'imo', headerName: 'IMO' },
    { field: 'companyName', headerName: 'Company Name' },
    { field: 'vesselType', headerName: 'Vessel Type' },
  ];

  defaultColDef: ColDef = {
    flex: 1,
  };

  ngOnInit(): void {
    this.vesselFacade.loadVessels();

    this.vesselFacade.vessels$.subscribe((vessels: Vessel[]) => {
      this.rowData = vessels;
    });

    this.vesselFacade.loading$.subscribe((loading: boolean) => {
      this.loading.set(loading);
    });

    this.vesselFacade.error$.subscribe((error: string | null) => {
      this.error.set(error);
    });
  }
}
