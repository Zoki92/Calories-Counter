import { AsyncValidator, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UniqueEmail implements AsyncValidator {
    constructor(private authService: AuthService) { }

    validate = (control: FormGroup) => {
        const { value } = control;
        return this.authService.emailAvailable(value).pipe(
            map(
                value => {
                    if (value.available) {
                        return null;
                    }
                    else {
                        return { nonUniqueEmail: true };
                    }
                }
            ),
            catchError(error => {
                return of({
                    error: 'Could not connect to server.'
                })
            })
        );
    }
}
