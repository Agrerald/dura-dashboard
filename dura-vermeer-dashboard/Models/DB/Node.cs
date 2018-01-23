using System;
using System.Collections.Generic;

namespace Duravermeer.Dashboard.Models.DB
{
  public partial class Node
  {
    public Node()
    {
      DataPoint = new HashSet<DataPoint>();
    }

    public int NodeId { get; set; }
    public string Naam { get; set; }
    public string Locatie { get; set; }
    public string Latitude { get; set; }
    public string Longtitude { get; set; }

    public ICollection<DataPoint> DataPoint { get; set; }
  }
}
