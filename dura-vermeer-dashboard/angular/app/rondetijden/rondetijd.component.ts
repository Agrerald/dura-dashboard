import {Component} from '@angular/core';
import {Chart} from "angular-highcharts";
import {HttpService} from "../http.service";

@Component({
  selector: 'RondetijdComponent',
  templateUrl: './rondetijd.component.html'
})
export class RondetijdComponent {
  public rondeTijden = {};
  public vanDatum: string = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().substr(0, 16);
  public totDatum: string = new Date(Date.now()).toISOString().substr(0, 16);

  public chart = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Rondetijden'
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Duur ronde (seconden)'
      }
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      },
      column: {
        stacking: 'normal'
      }
    },
    series: []
  });

  constructor(public httpService: HttpService) {
    this.chart.addSerie({
      name: 'BlueUp-01-016167 naar 2de',
      data: [56, 52, 60],
      stack: "67"
    });
    this.chart.addSerie({
      name: 'BlueUp-01-016167 naar 4de',
      data: [53, 56, 56],
      stack: "67"
    });
    this.chart.addSerie({
      name: 'BlueUp-01-016166 naar 2de',
      data: [50, 78, 109],
      stack: "66"
    });
    this.chart.addSerie({
      name: 'BlueUp-01-016166 naar 4de',
      data: [54, 51, 88],
      stack: "66"
    });
  }

  public drawChart() {
    while(this.chart.options.series.length > 0) {
      this.chart.removeSerie(0);
    }
    this.httpService.getRondetijden(new Date(Date.parse(this.vanDatum) - 1000 * 60 * 60), new Date(Date.parse(this.totDatum) - 1000 * 60 * 60)).subscribe(rondetijden => {
      for (const key in rondetijden) {
        const series = {};
        console.log(key);
        for (const ronde of rondetijden[key]) {
          const seriename = key + ': ' + ronde['fromNode'] + '->' + ronde['toNode'];
          if (!series[seriename]) series[seriename] = {name: seriename,  data: [], stack: key};
          series[seriename]['data'].push(ronde['rondeDuur']);
        }
        for (const serie in series){
          this.chart.addSerie(series[serie]);
        }
      }
    });
  }
}
