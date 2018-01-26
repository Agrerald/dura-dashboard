import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Gateway} from "../gateway";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SelectedGatewayService {
  private selectedGatewayObservable: ReplaySubject<Gateway>;

  constructor(){
    this.selectedGatewayObservable = new ReplaySubject(1);
  }

  public setSelectedGateway(gateway: Gateway){
    this.selectedGatewayObservable.next(gateway);
  }

  public getSelectedGatewayObservable(): Observable<Gateway> {
    return this.selectedGatewayObservable.asObservable();
  }
}
