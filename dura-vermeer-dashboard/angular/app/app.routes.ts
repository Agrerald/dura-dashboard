import {RouterModule, Routes} from '@angular/router';
import {DataInladenComponent} from './dataInladen/dataInladen.component';
import {HomeComponent} from './home/home.component';
import {DatapointOverzichtComponent} from "./datapointOverzicht/datapointOverzicht.component";

export const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'datainladen', component: DataInladenComponent},
  { path: 'overzicht', component: DatapointOverzichtComponent}
];

export const appRoutingProviders: any[] = [

];

export const Routing = RouterModule.forRoot(appRoutes);
