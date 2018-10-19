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
            <br><br>
            <search (filter)="onSearch($event)" (clear)="onClear()" type="Thank Yous">
            </search>
            <mat-list>
              <ng-template [ngIf]="loadAll">
                <mat-list-item *ngFor="let thankYou of thankYouArray; let i = index;">
                  <mat-icon mat-list-icon>star</mat-icon>
                  <h4 mat-line>&quot;{{ thankYou.original }}&quot;</h4>
                  <p mat-line> {{ thankYou.submitter.replace('.', ' ') | titlecase }}</p>
                </mat-list-item>
              </ng-template>
              <ng-template [ngIf]="!loadAll">
                <mat-list-item *ngFor="let thankYou of newThankYouArray; let i = index;">
                  <mat-icon mat-list-icon>star</mat-icon>
                  <h4 mat-line>&quot;{{ thankYou.original }}&quot;</h4>
                  <p mat-line> {{ thankYou.submitter.replace('.', ' ') | titlecase }}</p>
                </mat-list-item>
              </ng-template>
            </mat-list>

        <ng-template [ngIf]="loaded">
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

          <h4 mat-line>Top 5 Most Thankful:</h4>

          <ng-template [ngIf]="showThankful">
            <mat-list>
              <mat-list-item *ngFor="let thankYou of thankfulObject; let i = index;">
                <mat-icon mat-list-icon>stars</mat-icon>
                <h4 mat-line>{{ thankYou.name  | titlecase}} has given {{ thankYou.number }} thank yous!</h4>
              </mat-list-item>
            </mat-list>
          </ng-template>

          <button raised color="accent" (click)="onGetThankful()">Get Top 5 Thankful People</button>
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
  public thankYouArray: ThankYouModel[] = [];
  public newThankYouArray: ThankYouModel[] = [];
  public randomThankYou: ThankYouModel;
  public thankfulObject: { name: string; number: number }[] = [];
  public showRandom = false;
  public loaded = false;
  public loadAll = true;
  public showThankful = false;
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
      this.thankYouArray = thankYous;
      return this.thankYouArray.reverse();
    });
    this.loaded = true;
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
    // this.takeOff = false;
  }

  getRandom() {
    this.randomThankYou = this.thankYouArray[
      Math.floor(Math.random() * this.thankYouArray.length)
    ];
    this.showRandom = true;
  }

  onSearch(term) {
    this.newThankYouArray = this.thankYouArray.filter(
      thankYou =>
        thankYou.original.toLowerCase().includes(term.toLowerCase()) ||
        thankYou.submitter.toLowerCase().includes(term.toLowerCase()),
    );
    this.loadAll = false;
    if (term === '') {
      this.onClear();
    }
  }

  onGetThankful() {
    const people = this.thankYouArray.map(thankYou => {
      if (thankYou.submitter.indexOf('and') > 0) {
        return thankYou.submitter
          .toLowerCase()
          .replace(/\s/g, '')
          .split('and');
      }
      return thankYou.submitter
        .toLowerCase()
        .split(' ')[0]
        .split('.')[0];
    });
    const peopleArray: string[] = [].concat.apply([], people);
    const peopleSet = new Set(peopleArray);
    let thanks = {};
    for (var i = 0; i < peopleArray.length; i++) {
      if (this.hasProp(thanks, peopleArray[i])) {
        thanks[peopleArray[i]]++;
      } else {
        thanks[peopleArray[i]] = 1;
      }
    }

    for (var i = 0; i < (peopleSet as any).length; i++) {
      if (this.hasProp(thanks, peopleArray[i])) {
        thanks[peopleArray[i]]++;
      } else {
        thanks[peopleArray[i]] = 0;
      }
    }

    var sortable = [];
    for (var vehicle in thanks) {
      sortable.push([vehicle, thanks[vehicle]]);
    }

    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });

    // This cuts it to top 5, but it's alphabetical so someone might tie and be left off the list
    sortable = sortable.slice(0, 5);

    this.thankfulObject = sortable.map(function(x) {
      return {
        name: x[0],
        number: x[1],
      };
    });

    this.showThankful = true;
  }

  hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  onClear() {
    this.loadAll = true;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
