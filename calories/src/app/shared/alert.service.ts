import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Alert, AlertType } from './alert';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  constructor() { }

  // Enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id))
  }
  success(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }))
  }
  info(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }))
  }
  warn(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }))
  }

  error(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }))
  }

  alert(alert: Alert) {
    console.log("here ", alert);
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}
