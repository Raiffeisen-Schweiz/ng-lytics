export class NgLyticsConfig {
  appName?: string;
  environmentName?: string;
  dataLayerName?: string;
  isDevMode?: boolean;

  constructor(appName = 'defaultAppName', isDevMode = false, environmentName = 'dev', dataLayerName = 'dataLayer') {
    this.appName = appName;
    this.isDevMode = isDevMode;
    this.environmentName = environmentName;
    this.dataLayerName = dataLayerName;
  }
}
