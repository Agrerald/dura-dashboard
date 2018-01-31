import { Chart } from 'angular-highcharts';
import { Component } from "@angular/core";
import * as Highcharts from "Highcharts";
import {SelectedGatewayService} from "../gatewaySelector/selectedGateway.service";
import {HttpService} from "../http.service";
import KalmanFilter from 'kalmanjs';


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
  filteredChart = new Chart({
    chart: {
      type: 'scatter'
    },
    title: {
      text: 'Geregistreerde datapunten'
    },
    subtitle: {
      text: 'Gefilterd met Kalmanfilter'
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
    while(this.filteredChart.options.series.length > 0) {
      this.filteredChart.removeSerie(0);
    }
    this.httpService.getDataPointsOnDay(new Date(Date.parse(this.vanDatum) - 1000 * 60 * 60), new Date(Date.parse(this.totDatum) - 1000 * 60 * 60), this.selectedNodeId ).subscribe(datapoints => {
      const dp = {};
      for (const datapoint of datapoints){
        if(!dp[datapoint.Naam]) dp[datapoint.Naam] = [];
        dp[datapoint.Naam].push([datapoint.Datum.getTime(), datapoint.Afstand]);
      }

      for (const key in dp){
        this.chart.addSerie({
          name: key,
          data: dp[key]
        });
      }
      for (const key in dp) {
        let distances = [];
        for (const datapoint of dp[key]){
          distances.push(datapoint[1]);
        }
        const kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});

        const dataConstantKalman = distances.map(function(v) {
          return kalmanFilter.filter(v);
        });

        for (const i in dataConstantKalman){
          dp[key][i][1] = dataConstantKalman[i];
        }
        this.filteredChart.addSerie({
          name: key,
          data: dp[key]
        });
      }
    });
  }
}
