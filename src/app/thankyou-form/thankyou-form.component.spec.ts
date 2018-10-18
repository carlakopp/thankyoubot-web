import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouFormComponent } from './thankyou-form.component';

describe('ThankyouFormComponent', () => {
  let component: ThankyouFormComponent;
  let fixture: ComponentFixture<ThankyouFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankyouFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
