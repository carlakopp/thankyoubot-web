import { debounceTime } from 'rxjs/operators';

import { merge, Scheduler, Subject } from 'rxjs';
import { async } from 'rxjs/scheduler/async';
import { Component, Input, Output, Optional, EventEmitter } from '@angular/core';

export class SearchComponentSettings {
  time = 300;
  scheduler: Scheduler = async;
}

@Component({
  selector: 'search',
  styles: [
    `
      :host {
        display: inline-block;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        padding: 5px;
        border-radius: 2px;
      }

      .searchClear {
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 200ms;
      }

      .searchClear:hover {
        opacity: 1;
      }

      input {
        padding: 10px 10px 10px 10px;
        height: 40px;
        width: 400px;
        line-height: 20px;
        border: 0;
        border-radius: 2px;
      }

      .search {
        display: flex;
        justify-content: space-around;
      }

      input:focus {
        outline: none;
      }

      button {
        height: 100%;
        min-width: 200px;
        left: 4px;
        padding: 10;
        margin: 10;
      }

      @media screen and (max-width: 500px) {
        :host {
          width: 100%;
        }
      }
    `,
  ],
  template: `
    <div class="search">
      <input matInput type="text" [attr.placeholder]="'Search ' + type" (input)="input$.next($event.target.value)" />
      <button raised color="accent" (click)="onClear()">
        Clear
      </button>
    </div>
  `,
})
export class SearchComponent {
  @Input()
  term: string;
  @Input()
  type = '';
  @Output()
  clear = new EventEmitter();
  settings: SearchComponentSettings;
  input$ = new Subject<string>();
  clear$ = new Subject<string>();

  constructor(@Optional() settings: SearchComponentSettings) {
    this.settings = settings || new SearchComponentSettings();
  }

  @Output()
  get filter() {
    const { time, scheduler } = this.settings;

    return merge(this.input$.pipe(debounceTime(time, scheduler)), this.clear$);
  }

  get realTerm() {
    return this.term.trim();
  }

  onClear() {
    this.clear.emit();
  }
}
