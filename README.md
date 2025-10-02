# NgLytics [![Build Status](https://github.com/Raiffeisen-Schweiz/ng-lytics/actions/workflows/ci.yml/badge.svg)](https://github.com/Raiffeisen-Schweiz/ng-lytics/actions/workflows/ci.yml) [![npm version](https://badge.fury.io/js/%40raiffeisen-schweiz%2Fng-lytics.svg)](https://badge.fury.io/js/%40raiffeisen-schweiz%2Fng-lytics)

An Angular wrapper for Analytics by using the datalayer concept.

## Installation

1. First you need to install the npm module:

`npm i @raiffeisen-schweiz/ng-lytics`

1. Use the Standalone API with `provideNgLytics`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideNgLytics } from '@raiffeisen-schweiz/ng-lytics';

bootstrapApplication(App, {
  providers: [
    provideNgLytics({
      appName: 'test-app',
      environmentName: 'dev',
      dataLayerName: 'dataLayer',
      isDevMode: true
    })
  ]
}).catch((err) => console.error(err));
```


or import the `NgLytics` module

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
  bootstrap: [App]
})
export class AppModule {}
```

If your NgLytics configuration is depending on another service (in this example the ConfigService), you can provide it like this:

```typescript
providers: [
  {
    provide: NGLYTICS_CONFIGURATION,
    useFactory: (configService: ConfigService) =>
      new NgLyticsConfig(
        'defaultAppName',
        isDevMode(),
        config.environmentName,
        'dataLayer'
      ),
    deps: [ConfigService],
  },
]
```

`provideNgLytics` and `NgLyticsModule.forRoot` do the same but in a more user-friendly way.
After adding the above example, you can inject the service into components and use it.

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

This library would work on its own and add all events by default to `window.dataLayer`. But you'll need to include a script from an analytics provider (Google Analytics, Adobe Analytics, ..) which consumes those events.

## Sample App

Sample app with Standalone API: [demo](https://github.com/Raiffeisen-Schweiz/ng-lytics/tree/master/projects/example/src/app).
Sample app with NgModule: [demo](https://github.com/Raiffeisen-Schweiz/ng-lytics/tree/master/projects/example-module/src/app).

## API

### NgLyticsService methods

- `trackPageRequested(data: NgLyticsPageRequested): void`: Tracks a page as initialized and adds an event to the dataLayer array.
- `trackPageLoaded(): void`: Tracks a page as rendered and adds an event the dataLayer array. Needs to be called after _trackPageRequested(data)_.
- `trackAction(data: NgLyticsAction<T = {}>): void`: Tracks an interaction and adds an event to the dataLayer array.
- `trackAsyncAction(data: NgLyticsAction<T = {}>): void`: Tracks an interaction with asynchronous payload and adds an event to the dataLayer array.
- `registerAsyncAction(numberOfActions = 1): void`: Registers upcoming asynchronous action calls.

## FAQs

**When and why use `trackAsyncAction()`?**

This method is used for handling asynchronous actions like loading or saving data.

Example: You open page A and track it. There is a HTTP call to load additional data you want to track as an action. Before the loading of the HTTP call completes, the user navigates to page B. Now the HTTP call has finished loading and is being tracked. In this case, the action would be counted to page B which is not intended.

To keep the correct order you would call `registerAsyncAction()` before navigating to page B. With this, the action after the HTTP call resolves would be counted to page A.

## Compatibility

| Angular | NgLytics |
|---------|----------|
| 20.x    | 20.x     |
| 19.x    | 19.x     |
| 18.x    | 18.x     |
| 17.x    | 17.x     |
| 16.x    | 16.x     |
| 15.x    | 15.x     |
| 14.x    | 14.x     |
| 13.x    | 13.x     |
| 12.x    | 4.x      |
| 11.x    | 3.x      |
| 10.x    | 2.x      |
| 9.x     | 1.x      |

## License

MIT
