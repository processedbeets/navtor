import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  items: MenuItem[] = [
    {
      label: 'Vessels',
      icon: 'pi pi-compass',
      routerLink: '/vessels',
    },
    {
      label: 'Emissions',
      icon: 'pi pi-chart-line',
      routerLink: '/emissions',
    },
  ];
}
