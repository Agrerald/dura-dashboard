import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Gateway} from "./gateway";
import {DataPoint} from "./DataPoint";
import {Observable} from "rxjs/Observable";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {

  }

  public getAllNodes(): Observable<Gateway[]> {
    const observable: ReplaySubject<Gateway[]> = new ReplaySubject(1);
    this.http.get('/api/tracker/allNodes').subscribe(data => {
      const gateways: Gateway[] = [];
      for (const node of data as string[]){
        gateways.push(new Gateway(Number.parseInt(node['nodeId']), node['naam']));
      }
      observable.next(gateways);
    });
    return observable.asObservable();
  }

  public saveDatapoints(datapoints: DataPoint[]) {
    this.http.post('/api/tracker/import', JSON.stringify(datapoints),  {headers:{'Content-Type': 'application/json'}}).subscribe(value => {
      console.log(value);
    });
  }

  public getDataPointsOnDay(day: Date): Observable<DataPoint[]> {
    const dataPointsObservable: ReplaySubject<DataPoint[]> = new ReplaySubject<DataPoint[]>(1);
    this.http.get('/api/tracker/BlueUp-01-016167/' + day.toLocaleDateString() ).subscribe(data => {
      const datapoints: DataPoint[] = [];
      for (const datapoint of data as string[]){
        const dp: DataPoint = new DataPoint(datapoint['nodeId']);
        dp.Datum = new Date(Date.parse(datapoint['datum']));
        dp.Naam = datapoint['naam'];
        dp.Afstand = datapoint['afstand'];
        dp.RSSI = datapoint['rssi'];
        console.log(dp);
        datapoints.push(dp);
      }
      dataPointsObservable.next(datapoints);
    });
    return dataPointsObservable.asObservable();
  }

}
