import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideNgLytics } from '@raiffeisen-schweiz/ng-lytics';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgLytics({
      appName: 'test-app',
      environmentName: 'dev',
      dataLayerName: 'dataLayer',
      isDevMode: true
    })
  ]
}).catch((err) => console.error(err));
