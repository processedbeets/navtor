import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmissionsFacade } from '../../facades/emissions.facade';
import { ChartSeries } from '../../models/emissions.model';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-emissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="emissions-container">
      <h1>Emissions</h1>

      <div class="vessel-selector">
        <select
          [(ngModel)]="selectedVessel"
          (change)="onVesselChange()"
          class="vessel-select"
          [disabled]="loading"
        >
          <option value="" disabled>Select a vessel</option>
          <option *ngFor="let vessel of vesselOptions" [ngValue]="vessel">
            {{ vessel.name }}
          </option>
        </select>
      </div>

      <div
        class="chart-container"
        *ngIf="!loading && !error && chartData.length > 0"
      >
        <div #chartContainer style="width: 100%; height: 500px;"></div>
      </div>

      <div class="loading-container" *ngIf="loading">
        <p>Loading emissions data...</p>
      </div>

      <div class="error-container" *ngIf="error">
        <p>Error loading data: {{ error }}</p>
      </div>

      <div
        class="no-data-container"
        *ngIf="!loading && !error && chartData.length === 0"
      >
        <p>No emissions data available.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .emissions-container {
        padding: 20px;
        height: 100vh;
        background-color: #1a1a1a;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
      }

      h1 {
        color: white;
        margin-bottom: 20px;
        font-size: 2rem;
        font-weight: 600;
      }

      .vessel-selector {
        margin-bottom: 20px;
      }

      .vessel-select {
        width: 300px;
        padding: 12px 16px;
        background-color: #374151;
        color: white;
        border: 1px solid #4b5563;
        border-radius: 6px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 16px;
        padding-right: 40px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .vessel-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }

      .vessel-select:hover:not(:disabled) {
        border-color: #6b7280;
      }

      .vessel-select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .vessel-select option {
        background-color: #374151;
        color: white;
        padding: 8px 12px;
      }

      .chart-container {
        background-color: #1e293b;
        border: 1px solid #374151;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .loading-container,
      .error-container,
      .no-data-container {
        text-align: center;
        padding: 40px;
        color: #9ca3af;
      }

      .error-container {
        color: #ef4444;
      }

      /* Highcharts styled mode customizations */
      :host ::ng-deep .highcharts-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
      }

      :host ::ng-deep .highcharts-title {
        fill: #ffffff !important;
        font-size: 18px !important;
        font-weight: bold !important;
      }

      :host ::ng-deep .highcharts-axis-labels text {
        fill: #ffffff !important;
      }

      :host ::ng-deep .highcharts-legend-item text {
        fill: #ffffff !important;
      }

      :host ::ng-deep .highcharts-grid-line {
        stroke: #374151 !important;
      }

      :host ::ng-deep .highcharts-axis-line {
        stroke: #374151 !important;
      }

      :host ::ng-deep .highcharts-tick {
        stroke: #374151 !important;
      }

      :host ::ng-deep .highcharts-plot-background {
        fill: #1e293b !important;
      }

      :host ::ng-deep .highcharts-background {
        fill: #1e293b !important;
      }
    `,
  ],
})
export class EmissionsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  vesselOptions: { id: number; name: string }[] = [];
  selectedVessel: { id: number; name: string } | null = null;
  chartData: ChartSeries[] = [];
  chartOptions: Highcharts.Options = {};
  loading = false;
  error: string | null = null;
  private chart: Highcharts.Chart | null = null;

  private readonly emissionsFacade = inject(EmissionsFacade);

  ngOnInit(): void {
    this.emissionsFacade.loadEmissions();

    combineLatest([
      this.emissionsFacade.vesselOptions$,
      this.emissionsFacade.selectedVesselId$,
      this.emissionsFacade.selectedVesselEmissions$,
      this.emissionsFacade.loading$,
      this.emissionsFacade.error$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([vesselOptions, selectedVesselId, emissions, loading, error]) => {
          this.vesselOptions = vesselOptions;
          this.loading = loading;
          this.error = error;

          if (vesselOptions.length > 0 && !selectedVesselId) {
            this.selectedVessel = vesselOptions[0];
            this.emissionsFacade.selectVessel(vesselOptions[0].id);
          } else if (selectedVesselId) {
            this.selectedVessel =
              vesselOptions.find((v) => v.id === selectedVesselId) || null;
          }

          if (emissions.length > 0) {
            this.chartData = this.emissionsFacade.getChartData(emissions);
            // Use setTimeout to ensure the view is updated
            setTimeout(() => {
              this.updateChartOptions();
            }, 100);
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  onVesselChange(): void {
    if (this.selectedVessel) {
      this.emissionsFacade.selectVessel(this.selectedVessel.id);
    }
  }

  private updateChartOptions(): void {
    if (!this.chartContainer) {
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chartOptions = {
      chart: {
        type: 'line',
        styledMode: true,
        backgroundColor: '#1e293b',
        style: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
      title: {
        text: this.selectedVessel
          ? `${this.selectedVessel.name} Emissions`
          : 'Emissions',
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Values',
        },
      },
      legend: {
        enabled: true,
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
          },
        },
      },
      series: this.chartData.map((series) => ({
        name: series.name,
        data: series.data,
        color: series.color,
        type: 'line',
      })) as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false,
      },
    };

    // Check if we have valid data
    const hasValidData = this.chartData.some(
      (series) => series.data.length > 0
    );

    if (!hasValidData) {
      return;
    }

    this.chart = Highcharts.chart(
      this.chartContainer.nativeElement,
      this.chartOptions
    );
  }
}
