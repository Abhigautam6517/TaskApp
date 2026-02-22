export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface TaskSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export type TaskStatus = 0 | 1 | 2; // Pending, InProgress, Completed

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  remarks?: string;
  createdOn: string;
  lastUpdatedOn?: string;
  createdBy: string;
  lastUpdatedBy?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  remarks?: string;
  createdBy: string;
}

export interface TaskUpdate {
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  remarks?: string;
  lastUpdatedBy: string;
}

export interface TaskQuery {
  pageNumber: number;
  pageSize: number;
  searchTitle?: string;
  status?: TaskStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
