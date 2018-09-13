import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MainActions } from '../actions';
import { ThankyouFormComponent } from './thankyou-form/thankyou-form.component';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Latest Thank You Messages</span>

      <span class="exampleFillRemainingSpace"></span>
      <span>
        <mat-icon class="addThankYou" (click)="openDialog()">library_add_new</mat-icon>
      </span>
    </mat-toolbar>
    <mat-list>
        <mat-list-item  *ngFor="let thankYou of thankYous | async; let i = index;">
            <mat-icon mat-list-icon>brightness_5</mat-icon>
            <h4 mat-line>&quot;{{ thankYou.original }}&quot;</h4>
            <p mat-line> {{ thankYou.submitter.replace('.', ' ') | titlecase }}</p>
        </mat-list-item>
    </mat-list>

  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  `,
  styles: [
    `
      .exampleFillRemainingSpace {
        flex: 1 1 auto;
      }

      .addThankYou {
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public thankYouList: AngularFireList<any>;
  public thankYous: Observable<any>;

  thankYou: string;
  name: string;

  constructor(
    db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.thankYouList = db.list('messages');
    this.thankYous = this.thankYouList.valueChanges();
    // MainActions.createLoadSuccessAction(this.thankYous);
    console.log(this.thankYous);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ThankyouFormComponent, {
      width: '550px',
      data: { name: this.name, thankYou: this.thankYou },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this.addThankYou(result.name, result.thankYou);
      }
    });
  }

  public async addThankYou(submitter: string, original: string): Promise<void> {
    this.thankYouList.push({
      submitter,
      original,
    });
  }
}
