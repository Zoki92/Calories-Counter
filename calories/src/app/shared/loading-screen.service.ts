import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {
  private _loading: boolean = false;
  loadingStatus: Subject<boolean> = new Subject();

  constructor() { }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value) {
    this._loading = value;
  }

  startLoading() {
    this._loading = true;
  }

  stopLoading() {
    this._loading = false;
  }

}
