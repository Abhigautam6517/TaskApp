import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // API returns { success, message?, data?, errors? } (camelCase)
      const body = err.error as { message?: string; errors?: string[] } | null;
      let message = 'An error occurred. Please try again.';
      if (body?.message) message = body.message;
      if (body?.errors?.length) message = [message, ...body.errors].filter(Boolean).join(' ');
      if (err.status === 404 && !body?.message) message = 'Resource not found.';
      toast.error(message);
      return throwError(() => err);
    })
  );
};
