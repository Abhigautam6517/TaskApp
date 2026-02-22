import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { TaskSummary } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard">
      <header class="page-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Task management overview</p>
      </header>

      <div class="cards-grid">
        <mat-card class="summary-card total">
          <mat-card-content>
            <div class="card-icon"><mat-icon>assignment</mat-icon></div>
            <div class="card-value">{{ summary?.total ?? 0 }}</div>
            <div class="card-label">Total Tasks</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card pending">
          <mat-card-content>
            <div class="card-icon"><mat-icon>schedule</mat-icon></div>
            <div class="card-value">{{ summary?.pending ?? 0 }}</div>
            <div class="card-label">Pending</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card in-progress">
          <mat-card-content>
            <div class="card-icon"><mat-icon>autorenew</mat-icon></div>
            <div class="card-value">{{ summary?.inProgress ?? 0 }}</div>
            <div class="card-label">In Progress</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card completed">
          <mat-card-content>
            <div class="card-icon"><mat-icon>check_circle</mat-icon></div>
            <div class="card-value">{{ summary?.completed ?? 0 }}</div>
            <div class="card-label">Completed</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="quick-actions">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <a mat-flat-button color="primary" routerLink="/tasks">
            <mat-icon>add</mat-icon>
            View all tasks
          </a>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 {
      margin: 0 0 6px 0;
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a237e;
      letter-spacing: -0.02em;
    }
    .subtitle { margin: 0; font-size: 0.9375rem; color: #5c6bc0; }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    .summary-card {
      transition: box-shadow 0.25s ease, transform 0.25s ease;
    }
    .summary-card:hover {
      box-shadow: var(--app-card-shadow-hover);
      transform: translateY(-4px);
    }
    .summary-card .card-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--app-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .summary-card .card-icon .mat-icon { font-size: 28px; }
    .summary-card.total .card-icon { background: #e3f2fd; color: #1565c0; }
    .summary-card.pending .card-icon { background: #fff3e0; color: #ef6c00; }
    .summary-card.in-progress .card-icon { background: #e8eaf6; color: #3949ab; }
    .summary-card.completed .card-icon { background: #e8f5e9; color: #2e7d32; }
    .card-value {
      font-family: var(--font-heading);
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a237e;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }
    .card-label { font-size: 0.9375rem; color: #5c6bc0; margin-top: 4px; font-weight: 500; }
    .quick-actions a { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-weight: 500; }
    .quick-actions .mat-icon { font-size: 20px; }
    @media (max-width: 959px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }
      .page-header h1 { font-size: 1.5rem; }
      .card-value { font-size: 1.875rem; }
      .summary-card .card-icon { width: 44px; height: 44px; }
      .summary-card .card-icon .mat-icon { font-size: 24px; }
    }
    @media (max-width: 599px) {
      .dashboard { padding: 0; }
      .page-header { margin-bottom: 24px; }
      .page-header h1 { font-size: 1.375rem; }
      .subtitle { font-size: 0.875rem; }
      .cards-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 20px;
      }
      .summary-card .card-icon { width: 40px; height: 40px; margin-bottom: 12px; }
      .summary-card .card-icon .mat-icon { font-size: 22px; }
      .card-value { font-size: 1.75rem; }
      .card-label { font-size: 0.875rem; }
      .quick-actions a { width: 100%; justify-content: center; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  summary: TaskSummary | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSummary().subscribe({
      next: (res) => { if (res.success && res.data) this.summary = res.data; },
      error: () => {},
    });
  }
}
