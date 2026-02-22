import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = false;

  get loading(): boolean {
    return this._loading;
  }

  setLoading(value: boolean): void {
    this._loading = value;
  }

  show(): void {
    this._loading = true;
  }

  hide(): void {
    this._loading = false;
  }
}
