import {Component} from "@angular/core";
import {HttpService} from "../http.service";
import {Gateway} from "../gateway";
import {SelectedGatewayService} from "./selectedGateway.service";

@Component({
  selector: 'GatewaySelectorComponent',
  templateUrl: './gatewaySelector.component.html'
})
export class GatewaySelectorComponent {
  public gateways: Gateway[] = [];
  public selectedGateway: string;

  constructor(private httpService: HttpService, private selectedGatewayService: SelectedGatewayService){
    this.httpService.getAllNodes().subscribe(gateways => {
      this.gateways = gateways;
    });
  }

  private selectGateway() {
    for (const gateway of this.gateways){
      if (gateway.naam == this.selectedGateway){
        this.selectedGatewayService.setSelectedGateway(gateway);
        break;
      }
    }
  }
}
