import { makeEnvironmentProviders, EnvironmentProviders } from '@angular/core';
import { NGLYTICS_CONFIGURATION } from './token';
import { NgLyticsConfig } from './config';

export function provideNgLytics(config: NgLyticsConfig = null): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: NGLYTICS_CONFIGURATION, useValue: config }]);
}
