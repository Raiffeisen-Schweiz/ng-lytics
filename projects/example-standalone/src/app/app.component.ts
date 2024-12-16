import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgLyticsService, NgLyticsAction } from '@raiffeisen-schweiz/ng-lytics';
import { ClickButtonActionData } from './models';

@Component({
    selector: 'app-root',
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private ngLyticsService: NgLyticsService) {}

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
