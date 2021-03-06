# NgLytics [![Build Status](https://travis-ci.org/Raiffeisen-Schweiz/ng-lytics.svg?branch=master)](https://travis-ci.org/Raiffeisen-Schweiz/ng-lytics) [![npm version](https://badge.fury.io/js/%40raiffeisen-schweiz%2Fng-lytics.svg)](https://badge.fury.io/js/%40raiffeisen-schweiz%2Fng-lytics)

An Angular wrapper for Analytics by using the datalayer concept.

## Installation

1. First you need to install the npm module:

`npm i @raiffeisen-schweiz/ng-lytics`

2. Import the `NgLytics` module

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgLyticsModule } from '@raiffeisen-schweiz/ng-lytics';

@NgModule({
  imports: [
    BrowserModule,
    NgLyticsModule.forRoot({
      appName: 'defaultAppName',
      environmentName: 'dev',
      dataLayerName: 'dataLayer',
      isDevMode: false
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

#### Configuration

- **appName**
  - Type: `string?`
  - Determines the name of the app.
  - Default: **defaultAppName**
- **environmentName**
  - Type: `string?`
  - Determines the environment.
  - Default: **dev**
- **dataLayerName**
  - Type: `string?`
  - Determines the key on the window object, where the events are stored.
  - Default: **dataLayer**
- **isDevMode**
  - Type: `boolean?`
  - If set to _true_, additional logging will be enabled
  - Default: **false**

3. Add script from analytics provider.

This module would work on its own and add all events by default to `window.dataLayer`. But you'll need to include a script from an analytics provider (Google Analytics, Adobe Analytics, ..) which consumes those events.

## Sample App

Sample app is available [here](https://github.com/Raiffeisen-Schweiz/ng-lytics/tree/master/projects/example/src/app).

## API

### NgLyticsService methods

- `trackPageRequested(data: NgLyticsPageRequested): void`: Tracks a page as initialized and adds an event to the dataLayer array.
- `trackPageLoaded(): void`: Tracks a page as rendered and adds an event the dataLayer array. Needs to be called after _trackPageRequested(data)_.
- `trackAction(data: NgLyticsAction<T = {}>): void`: Tracks an interaction and adds an event to the dataLayer array.
- `trackAsyncAction(data: NgLyticsAction<T = {}>): void`: Tracks an interaction with asynchronous payload and adds an event to the dataLayer array.
- `registerAsyncAction(numberOfActions = 1): void`: Registers upcoming asynchronous action calls.

## Compatibility

| Angular | NgLytics |
| ------- | -------- |
| 11.x    | 3.x      |
| 10.x    | 2.x      |
| 9.x     | 1.x      |

## License

MIT
