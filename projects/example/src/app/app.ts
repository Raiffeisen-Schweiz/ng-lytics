import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgLyticsService, NgLyticsAction } from '@raiffeisen-schweiz/ng-lytics';

@Component({
    selector: 'app-root',
    imports: [CommonModule],
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App implements OnInit, AfterViewInit {
  private ngLyticsService = inject(NgLyticsService);

  constructor() {}

  ngOnInit() {
    this.ngLyticsService.trackPageRequested({
      page: {
        pageName: 'home',
        pageURL: '/',
        language: 'en'
      }
    });

    this.ngLyticsService.registerAsyncAction();
    setTimeout(() => {
      this.ngLyticsService.trackAsyncAction({
        eventInfo: {
          eventAction: 'setData',
          eventType: 'setCustomerData',
          eventName: 'set customer data'
        },
        data: {
          customerId: 1
        }
      });
    }, 2000);
  }

  ngAfterViewInit() {
    this.ngLyticsService.trackPageLoaded();
  }

  onClick() {
    // you can use an optional custom interface for the data payload to be type safe
    const action: NgLyticsAction<ClickButtonActionData> = {
      eventInfo: {
        eventAction: 'clickButton',
        eventType: 'clickCallToAction',
        eventName: 'click on call-to-action button'
      },
      data: {
        foo: 'bar'
      }
    };
    this.ngLyticsService.trackAction(action);
  }

}

export interface ClickButtonActionData {
  foo: string;
}
