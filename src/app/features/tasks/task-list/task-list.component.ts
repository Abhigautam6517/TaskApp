import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Task, TaskQuery, TaskStatus, PagedResult } from '../../../core/models/api.models';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Completed' },
];

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  template: `
    <div class="task-list-page">
      <header class="page-header">
        <h1>Tasks</h1>
        <p class="subtitle">Manage your tasks with search and filters</p>
      </header>

      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search by title</mat-label>
              <input matInput [(ngModel)]="query.searchTitle" (keyup.enter)="loadTasks()" placeholder="Type to search...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="status-field">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="query.status" (selectionChange)="loadTasks()">
                <mat-option [value]="null">All</mat-option>
                @for (opt of statusOptions; track opt.value) {
                  <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Due from</mat-label>
              <input matInput [matDatepicker]="pickerFrom" [(ngModel)]="dueDateFrom" (dateChange)="onDueDateFromChange($event)">
              <mat-datepicker-toggle matSuffix [for]="pickerFrom"></mat-datepicker-toggle>
              <mat-datepicker #pickerFrom></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Due to</mat-label>
              <input matInput [matDatepicker]="pickerTo" [(ngModel)]="dueDateTo" (dateChange)="onDueDateToChange($event)">
              <mat-datepicker-toggle matSuffix [for]="pickerTo"></mat-datepicker-toggle>
              <mat-datepicker #pickerTo></mat-datepicker>
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="loadTasks()">
              <mat-icon>filter_list</mat-icon>
              Apply
            </button>
            <button mat-stroked-button (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              New Task
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" class="tasks-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>Id</th>
            <td mat-cell *matCellDef="let row">{{ row.id }}</td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let row">{{ row.title }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <span class="status-badge" [class]="'status-' + row.status">{{ statusLabel(row.status) }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let row">{{ row.dueDate ? (row.dueDate | date:'mediumDate') : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button (click)="openEditDialog(row)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="openDeleteDialog(row)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">No tasks found.</td>
          </tr>
        </table>
        </div>

        <mat-paginator
          [length]="totalRecords"
          [pageSize]="query.pageSize"
          [pageIndex]="query.pageNumber - 1"
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="onPage($event)">
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .task-list-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 {
      margin: 0 0 6px 0;
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a237e;
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 0;
      font-size: 0.9375rem;
      color: #5c6bc0;
      font-weight: 400;
    }
    .filters-card { margin-bottom: 24px; }
    .filters-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
    .filters-row .mat-icon { font-size: 20px; }
    .search-field { min-width: 220px; }
    .status-field { min-width: 140px; }
    .date-field { min-width: 140px; }
    .table-card { overflow: hidden; }
    .tasks-table { width: 100%; }
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8125rem;
      font-weight: 600;
      font-family: var(--font-body);
      letter-spacing: 0.02em;
    }
    .status-0 { background: #fff3e0; color: #e65100; }
    .status-1 { background: #e8eaf6; color: #3949ab; }
    .status-2 { background: #e8f5e9; color: #2e7d32; }
    .mat-mdc-paginator { border-top: 1px solid rgba(0,0,0,0.06); font-family: var(--font-body); }
    .tasks-table .mat-icon { font-size: 22px; }
    .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    @media (max-width: 959px) {
      .page-header h1 { font-size: 1.5rem; }
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }
      .search-field, .status-field, .date-field { min-width: 100%; width: 100%; }
      .filters-row button { width: 100%; justify-content: center; }
      .table-wrapper { margin: 0 -16px; border-radius: 0; }
      .tasks-table { min-width: 600px; }
    }
    @media (max-width: 599px) {
      .task-list-page { padding: 0; }
      .page-header { margin-bottom: 20px; }
      .page-header h1 { font-size: 1.375rem; }
      .subtitle { font-size: 0.875rem; }
      .filters-card { margin-bottom: 16px; }
      .table-wrapper { margin: 0 -12px; }
      .tasks-table { min-width: 500px; font-size: 0.875rem; }
      .status-badge { padding: 4px 10px; font-size: 0.75rem; }
      .tasks-table .mat-icon { font-size: 20px; }
    }
  `],
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'status', 'dueDate', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);
  totalRecords = 0;
  query: TaskQuery = { pageNumber: 1, pageSize: 10 };
  dueDateFrom: Date | null = null;
  dueDateTo: Date | null = null;
  statusOptions = STATUS_OPTIONS;

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const q: TaskQuery = {
      ...this.query,
      dueDateFrom: this.dueDateFrom ? this.dueDateFrom.toISOString().split('T')[0] : undefined,
      dueDateTo: this.dueDateTo ? this.dueDateTo.toISOString().split('T')[0] : undefined,
    };
    this.api.getTasks(q).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dataSource.data = res.data.items;
          this.totalRecords = res.data.totalRecords;
        }
      },
    });
  }

  onPage(e: PageEvent): void {
    this.query.pageNumber = e.pageIndex + 1;
    this.query.pageSize = e.pageSize;
    this.loadTasks();
  }

  onDueDateFromChange(e: unknown): void {
    const ev = e as { value: Date | null };
    this.dueDateFrom = ev.value ?? null;
  }

  onDueDateToChange(e: unknown): void {
    const ev = e as { value: Date | null };
    this.dueDateTo = ev.value ?? null;
  }

  statusLabel(s: TaskStatus): string {
    return STATUS_OPTIONS.find(o => o.value === s)?.label ?? 'Unknown';
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(TaskFormDialogComponent, {
      width: '520px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result === true) this.loadTasks();
    });
  }

  openEditDialog(task: Task): void {
    const ref = this.dialog.open(TaskFormDialogComponent, {
      width: '520px',
      data: { mode: 'edit', task },
    });
    ref.afterClosed().subscribe((result) => {
      if (result === true) this.loadTasks();
    });
  }

  openDeleteDialog(task: Task): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.deleteTask(task.id).subscribe({
          next: (res) => {
            if (res.success) {
              this.toast.success('Task deleted.');
              this.loadTasks();
            }
          },
        });
      }
    });
  }
}
