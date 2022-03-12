import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Alert, AlertType} from "../../model/alert";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() id: string;

  alerts: Alert[] = [];

  constructor(private alertService: AlertService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    // https://www.positronx.io/understand-angular-change-detection-strategy/

    this.alertService.getAlert(this.id).subscribe((alert: Alert) => {
      if (!alert.message) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }

      // add alert to array
      console.log(this.alerts);
      if (this.alerts) {
        this.alerts = [...this.alerts, alert];
      } else {
        this.alerts = [alert];
      }
      this.cd.detectChanges();
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
    this.cd.detectChanges();
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert alert-success';
      case AlertType.Error:
        return 'alert alert-danger';
      case AlertType.Info:
        return 'alert alert-info';
      case AlertType.Warning:
        return 'alert alert-warning';
    }
  }
}

