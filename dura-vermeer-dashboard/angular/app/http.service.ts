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

  public saveDatapoints(datapoints: DataPoint[]): Observable<string> {
    const messageObservable = new ReplaySubject<string>(1);
    this.http.post('/api/tracker/import', JSON.stringify(datapoints),  {headers:{'Content-Type': 'application/json'}}).subscribe(value => {
      messageObservable.next('Success');
    });
    return messageObservable.asObservable();
  }

  public getDataPointsOnDay(fromDate: Date, toDate: Date, nodeId: number): Observable<DataPoint[]> {
    const dataPointsObservable: ReplaySubject<DataPoint[]> = new ReplaySubject<DataPoint[]>(1);
    this.http.get('/api/tracker/datapoint?fromDate=' + fromDate.toISOString() + '&toDate=' + toDate.toISOString() + '&nodeId=' + nodeId).subscribe(data => {
      const datapoints: DataPoint[] = [];
      for (const datapoint of data as string[]){
        const dp: DataPoint = new DataPoint(datapoint['nodeId']);
        dp.Datum = new Date(Date.parse(datapoint['datum']));
        dp.Naam = datapoint['naam'];
        dp.Afstand = datapoint['afstand'];
        dp.RSSI = datapoint['rssi'];
        datapoints.push(dp);
      }
      dataPointsObservable.next(datapoints);
    });
    return dataPointsObservable.asObservable();
  }

  public getRondetijden(fromDate: Date, toDate: Date) {
    const rondetijdenObservable = new ReplaySubject(1);
    this.http.get('/api/tracker/rondetijden?fromDate=' + fromDate.toISOString() + "&toDate=" + toDate.toISOString()).subscribe(rondetijden => {
      rondetijdenObservable.next(rondetijden);
    });
    return rondetijdenObservable.asObservable();
  }

}
