import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  group,
} from '@angular/animations';

import { MainActions } from '../actions';
import { ThankyouFormComponent } from './thankyou-form/thankyou-form.component';
import { ThankYouModel } from '../models';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  <div id="container">
    <div [@takeOffState]="takeOff" id="infoi" [class.birdVisible]="takeOff" [ngClass]="takeOff ? 'birdVisible' : 'birdHidden'">
      <img [src]="photoUrl" class="bird">
    </div>
    <div id="navi">
        <mat-toolbar color="primary">
          <span>Latest Thank You Messages</span>

          <span class="exampleFillRemainingSpace"></span>
          <span>
            <mat-icon class="addThankYou" (click)="openDialog()">library_add_new</mat-icon>
          </span>
        </mat-toolbar>
            <mat-list>
                <mat-list-item  *ngFor="let thankYou of thankYous | async; let i = index;">
                    <mat-icon mat-list-icon>star</mat-icon>
                    <h4 mat-line>&quot;{{ thankYou.original }}&quot;</h4>
                    <p mat-line> {{ thankYou.submitter.replace('.', ' ') | titlecase }}</p>
                </mat-list-item>
            </mat-list>


      <mat-toolbar color="primary">
        <span>Thank You Statistics</span>

        <span class="example-fill-remaining-space"></span>
      </mat-toolbar>

      <h4 mat-line>Total Thank Yous:</h4>{{ (thankYous | async).length }}
      <h4 mat-line>Random Thank You:</h4>
      <button raised color="accent" (click)="getRandom()">Get Random Thank You</button>
      <ng-template [ngIf]="showRandom">
        <mat-list>
          <mat-list-item>
              <mat-icon mat-list-icon>stars</mat-icon>
              <h4 mat-line>&quot;{{ randomThankYou.original }}&quot;</h4>
              <p mat-line> {{ randomThankYou.submitter.replace('.', ' ') | titlecase }}</p>
          </mat-list-item>
        </mat-list>
      </ng-template>
      </div>
    </div>

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

      .bird {
        position: absolute;
        width: 200px;
        height: 200px;
        top: 100px;
        left: 0px;
      }

      .birdHidden {
        visibility: hidden;
      }

      .birdVisible {
        visibility: visible;
      }

      #container {
        position: relative;
        margin: auto;
      }

      #infoi {
        z-index: 10;
        position: relative;
        border-radius: 50%;
      }
    `,
  ],
  animations: [
    trigger('takeOffState', [
      state('true', style({ transform: 'translateX(400vw)' })),
      transition(
        '* <=> *',
        animate(
          '3500ms ease-in',
          keyframes([
            style({ transform: 'translateX(100vw)', offset: 0.4 }),
            style({ transform: 'translateX(200vw)', offset: 0.7 }),
            style({
              transform: 'translateX(100vw)',
              offset: 1,
            }),
          ]),
        ),
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  public thankYouList: AngularFireList<any>;
  public thankYous: Observable<ThankYouModel[]>;
  public thankYouArray: ThankYouModel[];
  public randomThankYou: ThankYouModel;
  public showRandom = false;
  thankYou: string;
  name: string;
  takeOff = false;
  birds = [
    'flappy-bird.gif',
    'Animate-bird-slide-25.gif',
    '3HOL.gif',
    'bird-grump.gif',
    'crow.gif',
    'derp-yellow.gif',
    'dragon.gif',
    'flappy-2.gif',
    'giphy.gif',
    'pegasus.gif',
    'seagull.gif',
    't-bird.gif',
  ];
  photoUrl = './assets/' + this.birds[Math.floor(Math.random() * this.birds.length)];
  // photoUrl = './assets/flappy-bird.gif';
  interval: Subscription;

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.interval.unsubscribe();
  }

  constructor(db: AngularFireDatabase, public dialog: MatDialog) {
    this.thankYouList = db.list('messages');
    this.thankYous = this.thankYouList.valueChanges();
    // MainActions.createLoadSuccessAction(this.thankYous);
    this.thankYous.subscribe(thankYous => {
      return (this.thankYouArray = thankYous);
    });
  }

  toggle() {
    this.takeOff = !this.takeOff;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ThankyouFormComponent, {
      width: '550px',
      data: { name: this.name, thankYou: this.thankYou },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.takeOff = true;

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
    //this.takeOff = false;
  }

  getRandom() {
    this.randomThankYou = this.thankYouArray[
      Math.floor(Math.random() * this.thankYouArray.length)
    ];
    this.showRandom = true;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
