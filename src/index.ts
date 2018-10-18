import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

export class AppComponent {
  public items: Observable<any[]>;

  private itemCollection: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.itemCollection = db.collection('/messages');
    this.items = this.itemCollection.valueChanges();
  }

  public addMessage(): void {
    this.itemCollection.add({
      anotherTest: 'another value',
    });
  }
}
