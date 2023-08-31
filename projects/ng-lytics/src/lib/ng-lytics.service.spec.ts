import { TestBed } from '@angular/core/testing';
import { NgLyticsConfig } from './config';
import { NgLyticsEventType } from './models';
import { NgLyticsModule } from './ng-lytics.module';
import { provideNgLytics } from './provider';
import { NgLyticsService } from './ng-lytics.service';

describe('NgLyticsService', () => {
  let service: NgLyticsService;

  const appName = 'test-app-name';
  const environmentName = 'test-env-name';
  const dataLayerName = 'test-dl-name';
  const isDevMode = true;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        provideNgLytics({
          appName,
          environmentName,
          dataLayerName,
          isDevMode
        })
      ]
    });
    service = TestBed.inject(NgLyticsService);
    window[dataLayerName] = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track a page requested event', () => {
    const data = {} as any;
    service.trackPageRequested(data);

    expect(window[dataLayerName].length === 1).toBeTruthy();
    expect(window[dataLayerName][0].event).toEqual(NgLyticsEventType.PageRequested);
    expect(window[dataLayerName][0].isPageLoaded).toBeFalsy();
    expect(window[dataLayerName][0].openAsyncActionCounter).toEqual(0);
    expect(window[dataLayerName][0].app.appName).toEqual(appName);
    expect(window[dataLayerName][0].app.environmentName).toEqual(environmentName);
  });

  it('should track a page requested loaded', () => {
    service.trackPageLoaded();

    expect(window[dataLayerName].length === 1).toBeTruthy();
    expect(window[dataLayerName][0].event).toEqual(NgLyticsEventType.PageLoaded);
    expect(window[dataLayerName][0].isPageLoaded).toBeTruthy();
    expect(window[dataLayerName][0].openAsyncActionCounter).toEqual(0);
  });

  it('should log a warning when a page loaded event is missing', () => {
    spyOn(window.console, 'warn');

    const data = {} as any;
    service.trackPageRequested(data);
    service.trackPageLoaded();
    expect(window.console.warn).toHaveBeenCalledTimes(0);

    service.trackPageRequested(data);
    service.trackPageRequested(data);
    expect(window.console.warn).toHaveBeenCalled();
  });

  it('should log a warning when a page requested event is missing', () => {
    spyOn(window.console, 'warn');

    service.trackPageLoaded();
    expect(window.console.warn).toHaveBeenCalledTimes(1);
    service.trackPageLoaded();
    expect(window.console.warn).toHaveBeenCalledTimes(2);
  });

  it('should not log a warning when no page requested event is missing', () => {
    spyOn(window.console, 'warn');
    const data = {} as any;
    service.trackPageRequested(data);
    service.trackPageLoaded();
    expect(window.console.warn).toHaveBeenCalledTimes(0);
  });

  it('should log a warning when openAsyncActionCounter is negative', () => {
    spyOn(window.console, 'warn');
    const data = {} as any;
    service.trackPageRequested(data);
    service.trackPageLoaded();
    service.trackAsyncAction(data);
    expect(window.console.warn).toHaveBeenCalled();
  });

  it('should log a warning when openAsyncActionCounter is positiv', () => {
    spyOn(window.console, 'warn');
    const data = {} as any;
    service.registerAsyncAction();
    service.trackPageRequested(data);
    expect(window.console.warn).toHaveBeenCalled();
  });

  it('should register an async action', () => {
    service.registerAsyncAction();
    service.trackPageLoaded();

    expect(window[dataLayerName].length === 1).toBeTruthy();
    expect(window[dataLayerName][0].openAsyncActionCounter).toEqual(1);
  });

  it('should register multiple async action', () => {
    service.registerAsyncAction();
    service.registerAsyncAction();
    service.trackPageLoaded();

    expect(window[dataLayerName].length === 1).toBeTruthy();
    expect(window[dataLayerName][0].openAsyncActionCounter).toEqual(2);
  });

  it('should register multiple async action in one call', () => {
    service.registerAsyncAction(5);
    service.trackPageLoaded();

    expect(window[dataLayerName].length === 1).toBeTruthy();
    expect(window[dataLayerName][0].openAsyncActionCounter).toEqual(5);
  });

  it('should track an action', () => {
    const data = {} as any;
    service.trackPageRequested(data);
    service.trackAction(data);

    expect(window[dataLayerName].length === 2).toBeTruthy();
    expect(window[dataLayerName][1].event).toEqual(NgLyticsEventType.Action);
    expect(window[dataLayerName][1].openAsyncActionCounter).toEqual(0);
  });

  it('should track an action', () => {
    const data = {} as any;
    service.trackPageRequested(data);
    service.registerAsyncAction();
    service.trackAsyncAction(data);

    expect(window[dataLayerName].length === 2).toBeTruthy();
    expect(window[dataLayerName][1].event).toEqual(NgLyticsEventType.Action);
    expect(window[dataLayerName][1].openAsyncActionCounter).toEqual(0);

    service.trackAsyncAction(data);
    expect(window[dataLayerName].length === 3).toBeTruthy();
    expect(window[dataLayerName][2].event).toEqual(NgLyticsEventType.Action);
    expect(window[dataLayerName][2].openAsyncActionCounter).toEqual(-1);
  });

  it('should use default config values', () => {
    let serviceDefaultConfig: NgLyticsService;
    const defaultConfig = new NgLyticsConfig();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NgLyticsModule]
    });
    serviceDefaultConfig = TestBed.inject(NgLyticsService);

    const data = {} as any;
    serviceDefaultConfig.trackPageRequested(data);

    expect(window[defaultConfig.dataLayerName].length === 1).toBeTruthy();
    expect(window[defaultConfig.dataLayerName][0].app.appName).toEqual(defaultConfig.appName);
    expect(window[defaultConfig.dataLayerName][0].app.environmentName).toEqual(defaultConfig.environmentName);
  });

  beforeEach(() => {});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should still work with NgModule import', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NgLyticsModule.forRoot({
          appName,
          environmentName,
          dataLayerName,
          isDevMode
        })
      ]
    });
    service = TestBed.inject(NgLyticsService);

    const data = {} as any;
    service.trackPageRequested(data);

    expect(window[dataLayerName].length === 1).toBeTruthy();
    expect(window[dataLayerName][0].event).toEqual(NgLyticsEventType.PageRequested);
    expect(window[dataLayerName][0].isPageLoaded).toBeFalsy();
    expect(window[dataLayerName][0].openAsyncActionCounter).toEqual(0);
    expect(window[dataLayerName][0].app.appName).toEqual(appName);
    expect(window[dataLayerName][0].app.environmentName).toEqual(environmentName);
  });
});
