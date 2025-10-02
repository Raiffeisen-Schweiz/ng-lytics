import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
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
