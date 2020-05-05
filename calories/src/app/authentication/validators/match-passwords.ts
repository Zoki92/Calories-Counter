import { Validator, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MatchPasswords implements Validator {

    validate(formGroup: FormGroup) {
        const { password, password2 } = formGroup.value;
        if (password !== password2) {
            return { passwordsDontMatch: true };
        }
        else {
            return null;
        }
    }
}
