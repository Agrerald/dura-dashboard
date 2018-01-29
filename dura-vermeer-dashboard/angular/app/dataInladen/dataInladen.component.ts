import {Component} from "@angular/core";
import {HttpService} from "../http.service";
import {SelectedGatewayService} from "../gatewaySelector/selectedGateway.service";
import {Gateway} from "../gateway";
import {DataPoint} from "../DataPoint";

@Component({
  selector: 'DataInladenComponent',
  templateUrl: './dataInladen.component.html'
})
export class DataInladenComponent {
  public errors = [];
  public successMessage = '';
  public selectedFile: File;
  private meetdatum: Date = new Date(Date.parse('2017-01-17T12:00:00'));
  private startDatumCsv: Date = new Date(Date.parse('2018-01-18T00:00:00'));
  public meetdatumInput = '2017-01-17T12:00:00';
  public startDatumCsvInput = '2018-01-18T00:00:00';
  public fileContent = '';
  private selectedGateway: Gateway;

  constructor(public httpService: HttpService, selectedGatewayService: SelectedGatewayService) {
    selectedGatewayService.getSelectedGatewayObservable().subscribe(selectedGateway => {
      this.selectedGateway = selectedGateway;
    });
  }

  public processInput() {
    this.errors = [];
    this.successMessage = '';
    this.meetdatum = new Date(Date.parse(this.meetdatumInput + ''));
    this.startDatumCsv = new Date(Date.parse(this.startDatumCsvInput + ''));

    if (this.selectedGateway == null) this.errors.push('Selecteer een gateway');
    if (this.meetdatum.toDateString() == 'Invalid Date') this.errors.push('Geef een geldige meetdatum');
    if (this.startDatumCsv.toDateString() == 'Invalid Date') this.errors.push('Geef een geldige startdatum van het csv bestand.');
    if (!this.selectedFile) this.errors.push('Selecteer een meetbestand.');
    if (this.errors.length > 0) return;

    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile);
    fileReader.addEventListener('load', ev => {
      this.fileContent = fileReader.result;
      const data: DataPoint[] = this.CSVToArray(this.fileContent, ',');
      this.httpService.saveDatapoints(data).subscribe(message => {
        this.successMessage = message;
      });
      //this.dataService.processFile(this.fileContent, this.meetdatum, this.startDatumCsv, this.gateway);
      //this.router.navigateByUrl('/grafiek');
    });
  }

  public handleFileInput(files) {
    for(const file of files ){
      this.selectedFile = file;
    }
  }

  private CSVToArray(strData: string, strDelimiter: string): DataPoint[] {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ',');

    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
      (
        // Delimiters.
        '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +

        // Standard fields.
        '([^"\\' + strDelimiter + '\\r\\n]*))'
      ),
      'gi'
    );


    // Create an array to hold our data.
    const arrData = [];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;

    let dataPoint: DataPoint = new DataPoint(this.selectedGateway.id);
    let columnCount = 0;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )) {

      // Get the delimiter that was found.
      const strMatchedDelimiter = arrMatches[ 1 ];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ){

        // We have reached a new row of data,
        if (dataPoint) arrData.push(dataPoint);
        dataPoint = new DataPoint(this.selectedGateway.id);
        columnCount = 0;
      }

      let strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[ 2 ].replace(
          new RegExp( '""', 'g' ),
          '"'
        );

      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[ 3 ];

      }

      // als het de geregistreerde tijd is, converteren naar de echte tijd
      if (columnCount == 1) {
        dataPoint.setValue(columnCount, '' +
          (this.meetdatum.getTime() + (new Date(Date.parse(strMatchedValue)).getTime() - this.startDatumCsv.getTime())));
      } else {
        dataPoint.setValue(columnCount, strMatchedValue);
      }
      columnCount++;
      // Now that we have our value string, let's add
      // it to the data array.
      //arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
  }

}
