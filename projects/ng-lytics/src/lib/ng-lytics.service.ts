import { Inject, Injectable, Optional } from '@angular/core';
import { NgLyticsConfig } from './config';
import {
  NgLyticsAction,
  NgLyticsActionEvent,
  NgLyticsEventType,
  NgLyticsPageLoadedEvent as NgLyticsPageLoadEvent,
  NgLyticsPageRequest,
  NgLyticsPageRequestEvent
} from './models';
import { NGLYTICS_CONFIGURATION } from './token';

@Injectable({ providedIn: 'root' })
export class NgLyticsService {
  private readonly config: NgLyticsConfig;
  private openAsyncActionCounter = 0;

  constructor(@Optional() @Inject(NGLYTICS_CONFIGURATION) config: NgLyticsConfig) {
    const defaultConfig = new NgLyticsConfig();
    this.config = {
      appName: (config && config.appName) || defaultConfig.appName,
      environmentName: (config && config.environmentName) || defaultConfig.environmentName,
      isDevMode: (config && config.isDevMode) || defaultConfig.isDevMode,
      dataLayerName: (config && config.dataLayerName) || defaultConfig.dataLayerName
    };

    (window as any)[this.config.dataLayerName] = (window as any)[this.config.dataLayerName] || [];
  }

  /**
   * Tracks a specific view as a pageconstcn
   */
  trackPageRequested(data: NgLyticsPageRequest) {
    this.checkForPositivAsyncCounter();
    this.openAsyncActionCounter = 0;

    const event: NgLyticsPageRequestEvent = {
      event: NgLyticsEventType.PageRequested,
      ...data,
      app: {
        appName: this.config.appName,
        environmentName: this.config.environmentName
      },
      openAsyncActionCounter: this.openAsyncActionCounter,
      isPageLoaded: false
    };

    this.checkForMissingPageLoaded();
    this.addEvent(event);
  }

  /**
   * Sends an event that a view is rendered completly.
   * This is needed because actions can disptach between pageRequested and pageLoaded.
   * Those actions are not real interactions but an inital state of a view which may not be taken into account.
   *
   * Recommended to be called in `ngAfterViewInit()`
   */

  trackPageLoaded() {
    const event: NgLyticsPageLoadEvent = {
      event: NgLyticsEventType.PageLoaded,
      openAsyncActionCounter: this.openAsyncActionCounter,
      isPageLoaded: true
    };

    this.checkForMissingPageRequested();
    this.addEvent(event);
  }

  /**
   * Tracks an interaction in the app.
   *
   * Recommended to be used on click handlers.
   */
  trackAction(data: NgLyticsAction) {
    const event: NgLyticsActionEvent = {
      event: NgLyticsEventType.Action,
      ...data,
      openAsyncActionCounter: this.openAsyncActionCounter
    };

    this.addEvent(event);
  }

  /**
   * Registers upcoming asynchronous action calls.
   *
   * Should be called between `trackPageRequested()` and `trackPageLoaded()`.
   */
  registerAsyncAction(numberOfActions = 1) {
    this.openAsyncActionCounter += numberOfActions;
  }

  /**
   * Tracks an interaction with asynchronous payload.
   *
   * Every `trackAsyncAction()` call needs to be registered beforehand by `registerAsyncAction()`
   */
  trackAsyncAction(data: NgLyticsAction) {
    this.openAsyncActionCounter -= 1;
    this.trackAction(data);
    this.checkForNegativeAsyncCounter();
  }

  private checkForMissingPageLoaded() {
    if (!this.config.isDevMode) {
      return;
    }

    const items = (window as any)[this.config.dataLayerName].filter(
      item => item.event === NgLyticsEventType.PageRequested || item.event === NgLyticsEventType.PageLoaded
    );

    if (items.length && items[items.length - 1].event !== NgLyticsEventType.PageLoaded) {
      console.warn(
        '[NgLytics] Last event `PageRequested` has no `PageLoaded` counterpart. The event was: ',
        items[items.length - 1]
      );
    }
  }

  /**
   * Checks if every PageRequested has a following PageLoaded event.
   */
  private checkForMissingPageRequested() {
    if (!this.config.isDevMode) {
      return;
    }

    const items = (window as any)[this.config.dataLayerName].filter(
      item => item.event === NgLyticsEventType.PageRequested || item.event === NgLyticsEventType.PageLoaded
    );
    if (items.length === 0 || items[items.length - 1].event !== NgLyticsEventType.PageRequested) {
      console.warn('[NgLytics] There was a `PageLoaded` without a `PageRequested` event.');
    }
  }

  /**
   * Checks if openAsyncActionCounter is negative.
   */
  private checkForNegativeAsyncCounter() {
    if (this.config.isDevMode && this.openAsyncActionCounter < 0) {
      console.warn(
        '[NgLytics] The openAsyncActionCounter is negativ.',
        'That means that not all async actions were registered. Every async action needs to be registered.',
        'Or it could be that accidentally a trackAsyncAction() instead of a trackAction() was used.'
      );
    }
  }

  /**
   * Checks if openAsyncActionCounter is positiv.
   */
  private checkForPositivAsyncCounter() {
    if (this.config.isDevMode && this.openAsyncActionCounter > 0) {
      console.warn(
        '[NgLytics] A `PageRequested` event will be added, but the openAsyncActionCounter is still positiv',
        'which indicates that there might be an error.\n',
        'Possible source of errors:\n',
        '• used trackAction() instead of trackAsyncAction()\n',
        '• registered more async actions than needed\n',
        '• an async request failed, so a trackAsyncAction() was not called \n',
        '• navigated away before a trackAsyncAction() got called\n'
      );
    }
  }

  /**
   * Adds an event to the data layer array on the window object
   */
  private addEvent(event: NgLyticsPageRequestEvent | NgLyticsPageLoadEvent | NgLyticsActionEvent) {
    if (this.config.isDevMode) {
      console.log('[NgLytics]', event);
    }
    (window as any)[this.config.dataLayerName].push(event);
  }
}
