import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Task, TaskStatus } from '../../../core/models/api.models';

export interface TaskFormDialogData {
  mode: 'create' | 'edit';
  task?: Task;
}

const USER = 'Web User';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Task' : 'New Task' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Task title">
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <mat-error>Title is required (max 200 characters)</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Optional description"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option [value]="0">Pending</mat-option>
            <mat-option [value]="1">In Progress</mat-option>
            <mat-option [value]="2">Completed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Remarks</mat-label>
          <textarea matInput formControlName="remarks" rows="2" placeholder="Optional remarks"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button type="button" mat-button mat-dialog-close>Cancel</button>
        <button type="submit" mat-flat-button color="primary" [disabled]="form.invalid || submitting">
          {{ submitting ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; }
    mat-dialog-content { min-width: 400px; display: flex; flex-direction: column; gap: 8px; padding-top: 16px; }
    @media (max-width: 599px) {
      mat-dialog-content { min-width: 0; }
    }
  `],
})
export class TaskFormDialogComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private ref = inject(MatDialogRef<TaskFormDialogComponent>);
  private data: TaskFormDialogData = inject(MAT_DIALOG_DATA);

  form: FormGroup;
  submitting = false;
  isEdit = false;

  constructor() {
    this.isEdit = this.data.mode === 'edit' && !!this.data.task;
    const t = this.data.task;
    this.form = this.fb.group({
      title: [t?.title ?? '', [Validators.required, Validators.maxLength(200)]],
      description: [t?.description ?? ''],
      dueDate: [t?.dueDate ? new Date(t.dueDate) : null],
      status: [t?.status ?? 0, Validators.required],
      remarks: [t?.remarks ?? ''],
    });
  }

  submit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;

    if (this.isEdit && this.data.task) {
      this.api.updateTask(this.data.task.id, {
        title: this.form.value.title,
        description: this.form.value.description || undefined,
        dueDate: this.form.value.dueDate ? (this.form.value.dueDate as Date).toISOString().split('T')[0] : undefined,
        status: this.form.value.status as TaskStatus,
        remarks: this.form.value.remarks || undefined,
        lastUpdatedBy: USER,
      }).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toast.success('Task updated.');
            this.ref.close(true);
          }
        },
        error: () => { this.submitting = false; },
      });
    } else {
      this.api.createTask({
        title: this.form.value.title,
        description: this.form.value.description || undefined,
        dueDate: this.form.value.dueDate ? (this.form.value.dueDate as Date).toISOString().split('T')[0] : undefined,
        status: this.form.value.status as TaskStatus,
        remarks: this.form.value.remarks || undefined,
        createdBy: USER,
      }).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toast.success('Task created.');
            this.ref.close(true);
          }
        },
        error: () => { this.submitting = false; },
      });
    }
  }
}
