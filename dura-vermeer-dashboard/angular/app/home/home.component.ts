import {Component} from "@angular/core";
import {Http} from "@angular/http";

@Component({
  selector: 'HomeComponent',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  apiValues: string[] = [];

  constructor(private _httpService: Http) {
    this._httpService.get('/api/values').subscribe(values => {
      this.apiValues = values.json() as string[];
    });
  }
}
