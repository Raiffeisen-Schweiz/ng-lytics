import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgLyticsModule } from '@raiffeisen-schweiz/ng-lytics';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgLyticsModule.forRoot({
      appName: 'test-app',
      environmentName: 'dev',
      dataLayerName: 'dataLayer',
      isDevMode: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
