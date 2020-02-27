import { Inject, Injectable } from '@angular/core';
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
  private asyncActionCounter = 0;

  constructor(@Inject(NGLYTICS_CONFIGURATION) config: NgLyticsConfig) {
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
    this.asyncActionCounter = 0;

    const event: NgLyticsPageRequestEvent = {
      event: NgLyticsEventType.PageRequested,
      ...data,
      app: {
        appName: this.config.appName,
        environmentName: this.config.environmentName
      },
      openAsyncActionCounter: this.asyncActionCounter,
      isPageLoaded: false
    };

    this.isLastPageLoaded();
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
      openAsyncActionCounter: this.asyncActionCounter,
      isPageLoaded: true
    };

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
      openAsyncActionCounter: this.asyncActionCounter
    };

    this.addEvent(event);
  }

  /**
   * Registers upcoming asynchronous action calls.
   *
   * Should be called between `trackPageRequested()` and `trackPageLoaded()`.
   */
  registerAsyncAction(numberOfActions = 1) {
    this.asyncActionCounter += numberOfActions;
  }

  /**
   * Tracks an interaction with asynchronous payload.
   *
   * Every `trackAsyncAction()` call needs to be registered beforehand by `registerAsyncAction()`
   */
  trackAsyncAction(data: NgLyticsAction) {
    this.asyncActionCounter -= 1;
    this.trackAction(data);
  }

  private isLastPageLoaded() {
    const items = (window as any)[this.config.dataLayerName].filter(
      item => item.event === NgLyticsEventType.PageRequested || item.event === NgLyticsEventType.PageLoaded
    );

    if (items.length && items[items.length - 1].type !== NgLyticsEventType.PageLoaded) {
      console.warn(
        '[NgLytics] Last event `PageRequested` has no `PageLoaded` counterpart. The event was: ',
        items[items.length - 1]
      );
    }
  }

  private addEvent(event: NgLyticsPageRequestEvent | NgLyticsPageLoadEvent | NgLyticsActionEvent) {
    if (this.config.isDevMode) {
      console.log('[NgLytics]', event);
    }
    (window as any)[this.config.dataLayerName].push(event);
  }
}
