import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emissions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="emissions-container">
      <h1>Emissions</h1>
      <p>Emissions data will be displayed here.</p>
    </div>
  `,
  styles: [
    `
      .emissions-container {
        padding: 20px;
        height: 100vh;
        background-color: #1a1a1a;
        color: white;
      }

      h1 {
        color: white;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class EmissionsComponent {}
