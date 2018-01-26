
export class DataPoint {
  public Naam = '';
  public Datum: Date;
  public RSSI: number;
  public Afstand: number;
  public NodeId: number;


  constructor(NodeId: number) {
    this.NodeId = NodeId;
  }

  public setValue(index: number, value: string) {
    switch (index) {
      case 0:
        this.Naam = value;
        break;
      case 1:
        this.Datum = new Date(Number.parseInt(value));
        console.log('new data: ' + this.Datum);
        break;
      case 2:
        this.RSSI = Number.parseFloat(value);
        this.BerekenAfstand();
        break;
    }
  }

  private BerekenAfstand() {
    const txPower = -72.0833;
    //this.Afstand = Math.round( Math.pow(10, ((txPower - this.RSSI) / (10 * 2))) * 1000) / 1000; // in meters
    this.Afstand = Math.round( Math.pow(10, ((txPower - this.RSSI) / (10 * 2))) * 100); // in centimeters
  }

}
