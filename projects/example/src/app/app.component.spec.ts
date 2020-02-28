import { async, TestBed } from '@angular/core/testing';
import { NgLyticsConfig } from '../../../ng-lytics/src/lib/config';
import { NgLyticsModule } from '../../../ng-lytics/src/lib/ng-lytics.module';
import { NGLYTICS_CONFIGURATION } from '../../../ng-lytics/src/lib/token';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [NgLyticsModule],
      providers: [
        {
          provide: NGLYTICS_CONFIGURATION,
          useClass: NgLyticsConfig
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
