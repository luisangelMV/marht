import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from '../services';
import { finalize } from 'rxjs/operators';

@Injectable()
export class spinnerInterceptor implements HttpInterceptor {

    constructor(private spinnerService: SpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinnerService.callSpinner();
        return next.handle(req).pipe(
            finalize(() => this.spinnerService.stopSpinner())
        );
    }
}