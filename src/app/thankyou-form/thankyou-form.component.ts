import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-thankyou-form',
  template: `
  <h2 mat-dialog-title>Say Thanks</h2>
    <mat-dialog-content>
    <form [formGroup]="thankYouForm" name="form">
        <mat-form-field>
            <input matInput placeholder="Thanks..." type="string" formControlName="thankYou" required>
        </mat-form-field>
        <br><br>
        <mat-form-field>
          <input matInput placeholder="Your Name" type="string" formControlName="name" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button color="primary" [mat-dialog-close]=thankYouForm.value>Submit</button>
    </mat-dialog-actions>`,
  styles: [
    `
      .mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class ThankyouFormComponent {
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ThankyouFormComponent>,
  ) {}

  thankYouForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.min(0)]],
    thankYou: ['', [Validators.required, Validators.min(0)]],
  });
}
