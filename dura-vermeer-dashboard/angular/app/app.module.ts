import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpService} from "./http.service";
import {HttpClientModule} from "@angular/common/http";
import {GatewaySelectorComponent} from "./gatewaySelector/gatewaySelector.component";
import {MenuComponent} from "./menu/menu.component";
import {HomeComponent} from "./home/home.component";
import {Routing} from "./app.routes";
import {DataInladenComponent} from "./dataInladen/dataInladen.component";
import {SelectedGatewayService} from "./gatewaySelector/selectedGateway.service";
import {DatapointOverzichtComponent} from "./datapointOverzicht/datapointOverzicht.component";
import {ChartModule} from "angular-highcharts";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    DataInladenComponent,
    GatewaySelectorComponent,
    DatapointOverzichtComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    Routing,
    ChartModule
  ],
  providers: [
    HttpService,
    SelectedGatewayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
