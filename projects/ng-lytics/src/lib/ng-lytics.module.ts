import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NgLyticsConfig } from './config';
import { provideNgLytics } from './provider';

@NgModule({
  declarations: [],
  imports: []
})
export class NgLyticsModule {
  constructor(@Optional() @SkipSelf() parentModule?: NgLyticsModule) {
    if (parentModule) {
      throw new Error('NgLyticsModule is already loaded. It should only be imported in your main module.');
    }
  }

  static forRoot(config: NgLyticsConfig): ModuleWithProviders<NgLyticsModule> {
    return {
      ngModule: NgLyticsModule,
      providers: [provideNgLytics(config)]
    };
  }
}
