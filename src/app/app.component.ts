import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSidenavContainer,
    MatSidenavContent,
    MatListModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <mat-sidenav-container class="layout">
      <mat-sidenav #sidenav [mode]="sidenavMode" [opened]="sidenavOpened" class="sidenav">
        <div class="sidenav-header">
          <h2>Task Manager</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="sidenav.mode === 'over' && sidenav.close()">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/tasks" routerLinkActive="active" (click)="sidenav.mode === 'over' && sidenav.close()">
            <mat-icon matListItemIcon>list</mat-icon>
            <span matListItemTitle>Tasks</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()" type="button" aria-label="Toggle sidenav">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Task Management</span>
        </mat-toolbar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
    <app-loading-spinner></app-loading-spinner>
  `,
  styles: [`
    .layout { height: 100vh; }
    .sidenav {
      width: 280px;
      border-right: 1px solid rgba(0,0,0,0.06);
    }
    .sidenav-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    .sidenav-header h2 {
      margin: 0;
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--app-primary-dark);
      letter-spacing: -0.02em;
    }
    .sidenav .active {
      background: rgba(21, 101, 192, 0.08);
      color: var(--app-primary-dark);
      font-weight: 500;
    }
    .sidenav .mat-mdc-list-item {
      font-family: var(--font-body);
    }
    .sidenav .mat-icon {
      color: inherit;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      font-family: var(--font-heading);
    }
    .toolbar-title {
      margin-left: 12px;
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .content {
      padding: 28px 32px;
      min-height: calc(100vh - 64px);
      box-sizing: border-box;
    }
    @media (max-width: 959px) {
      .sidenav { width: 260px; max-width: 85vw; }
      .content { padding: 16px; }
      .toolbar-title { font-size: 1rem; }
    }
    @media (max-width: 599px) {
      .content { padding: 12px; }
    }
  `],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Task Management';
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        const isLarge = state.matches;
        this.sidenavMode = isLarge ? 'side' : 'over';
        this.sidenavOpened = isLarge;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
