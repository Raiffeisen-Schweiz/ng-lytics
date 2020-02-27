export enum NgLyticsEventType {
  PageRequested = 'PageRequested',
  PageLoaded = 'PageLoaded',
  Action = 'Action'
}

export interface NgLyticsPageRequest {
  page: {
    pageName: string;
    pageURL: string;
    language: string;
  };
  /** Additional optional data for this event. */
  data?: {};
}

export interface NgLyticsPageRequestEvent extends NgLyticsPageRequest {
  event: NgLyticsEventType.PageRequested;
  app: {
    appName: string;
    environmentName: string;
  };
  openAsyncActionCounter: number;
  isPageLoaded: boolean;
}

export interface NgLyticsPageLoadedEvent {
  event: NgLyticsEventType.PageLoaded;
  openAsyncActionCounter: number;
  isPageLoaded: true;
}

export interface NgLyticsAction {
  eventInfo: {
    /** Type of event. E.g. openModal, submitForm, download, search */
    eventType: string;
    /** Technical event name */
    eventAction: string;
    /** An easy to understand event name. Intended to be used for displaying in reports. */
    eventName: string;
  };
  /** Additional optional data for this event. */
  data?: {};
}

export interface NgLyticsActionEvent extends NgLyticsAction {
  event: NgLyticsEventType.Action;
  openAsyncActionCounter: number;
}
