import { Chart } from 'angular-highcharts';
import { Component } from "@angular/core";
import * as Highcharts from "Highcharts";
import {SelectedGatewayService} from "../gatewaySelector/selectedGateway.service";
import {HttpService} from "../http.service";

@Component({
  selector: 'DatapointOverzichtComponent',
  templateUrl: './datapointOverzicht.component.html'
})
export class DatapointOverzichtComponent {
  public vanDatum: string = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().substr(0, 16);
  public totDatum: string = new Date(Date.now()).toISOString().substr(0, 16);
  private selectedNodeId = 0;
  chart = new Chart({
    chart: {
      type: 'scatter'
    },
    title: {
      text: 'Geregistreerde datapunten'
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Afstand (centimeter)'
      }
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Tijd'
      }
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b %H:%M:%S}: {point.y:.2f} cm'
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      }
    },
    series: []
  });

  constructor(selectedGatewayService: SelectedGatewayService, public httpService: HttpService) {
    selectedGatewayService.getSelectedGatewayObservable().subscribe(value => {
      this.selectedNodeId = value.id;
    });
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
  }

  public drawChart() {
    while(this.chart.options.series.length > 0) {
      this.chart.removeSerie(0);
    }
    this.httpService.getDataPointsOnDay(new Date(Date.parse(this.vanDatum) - 1000 * 60 * 60), new Date(Date.parse(this.totDatum) - 1000 * 60 * 60), this.selectedNodeId ).subscribe(datapoints => {
      const dp = {};
      for (const datapoint of datapoints){
        if(!dp[datapoint.Naam]) dp[datapoint.Naam] = [];
        dp[datapoint.Naam].push([datapoint.Datum.getTime(), datapoint.Afstand]);
      }
      for (const key in dp){
        console.log(dp[key]);
        this.chart.addSerie({
          name: key,
          data: dp[key]
        });
      }
    });
  }
}
