import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgLyticsComponent } from './ng-lytics.component';

describe('NgLyticsComponent', () => {
  let component: NgLyticsComponent;
  let fixture: ComponentFixture<NgLyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgLyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgLyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
