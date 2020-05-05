import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AlertService } from '../alert.service';
import { Alert, AlertType } from '../alert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    // subscribe to new alerts notifications
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange)
          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          return;
        }
        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => {
            this.removeAlert(alert)
          }, 3000);
        }
      });
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert
      this.alerts.find(x => x === alert).fade = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 250);
    }
    else {
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = [];

    const alertTypeClass = {
      [AlertType.Success]: { class: 'ui green message', header: 'Success!' },
      [AlertType.Error]: { class: 'ui red message', header: 'Error!' },
      [AlertType.Info]: { class: 'ui blue message', header: 'Info!' },
      [AlertType.Warning]: { class: 'ui yellow message', header: 'Warning!' },
    }

    classes.push(alertTypeClass[alert.type]['class']);

    if (alert.fade) {
      classes.push('fade');
    }

    return { classes: classes.join(' '), header: alertTypeClass[alert.type]['header'] };
  }

}
