import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResult, TaskSummary, Task, TaskCreate, TaskUpdate, TaskQuery } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<ApiResponse<TaskSummary>> {
    return this.http.get<ApiResponse<TaskSummary>>(`${this.baseUrl}/summary`);
  }

  getTasks(query: TaskQuery): Observable<ApiResponse<PagedResult<Task>>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());
    if (query.searchTitle?.trim()) params = params.set('searchTitle', query.searchTitle.trim());
    if (query.status != null) params = params.set('status', query.status.toString());
    if (query.dueDateFrom) params = params.set('dueDateFrom', query.dueDateFrom);
    if (query.dueDateTo) params = params.set('dueDateTo', query.dueDateTo);

    return this.http.get<ApiResponse<PagedResult<Task>>>(this.baseUrl, { params });
  }

  getTaskById(id: number): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.baseUrl}/${id}`);
  }

  createTask(dto: TaskCreate): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(this.baseUrl, dto);
  }

  updateTask(id: number, dto: TaskUpdate): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(`${this.baseUrl}/${id}`, dto);
  }

  deleteTask(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
