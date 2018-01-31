import {Component} from '@angular/core';
import {Chart} from "angular-highcharts";
import {HttpService} from "../http.service";

@Component({
  selector: 'RondetijdComponent',
  templateUrl: './rondetijd.component.html'
})
export class RondetijdComponent {
  public rondeTijden = {};
  public minRondetijd = 10;
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
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        }
      }
    },
    xAxis: {
      title: {
        text: 'Rondenummer'
      }
    },
    tooltip: {
      headerFormat: '<b>Ronde {point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y} sec.<br/>Totaal: {point.stackTotal} sec.'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: []
  });

  constructor(public httpService: HttpService) {

  }

  public drawChart() {
    while(this.chart.options.series.length > 0) {
      this.chart.removeSerie(0);
    }
    this.httpService.getRondetijden(new Date(Date.parse(this.vanDatum) - 1000 * 60 * 60), new Date(Date.parse(this.totDatum) - 1000 * 60 * 60)).subscribe(rondetijden => {
      for (const key in rondetijden) {
        const series = {};
        for (const ronde of rondetijden[key]) {
          const seriename = key + ': ' + ronde['fromNode'] + '->' + ronde['toNode'];
          if (!series[seriename]) series[seriename] = {name: seriename,  data: [], stack: key};
          if (ronde['rondeDuur'] > this.minRondetijd) series[seriename]['data'].push(ronde['rondeDuur']);
        }
        for (const serie in series){
          this.chart.addSerie(series[serie]);
        }
      }
    });
  }

}
