using System;
using System.Collections.Generic;
using System.Linq;
using Duravermeer.Dashboard.Models;
using Duravermeer.Dashboard.Models.DB;

namespace Duravermeer.Dashboard
{
  public class Util
  {
    public static Dictionary<string, List<Rondetijd>> GetRondeTijden(IList<DataPoint> datapoints, IList<Node> allNodes)
    {
      List<string> beacons = new List<string>();
      Dictionary<string, List<Rondetijd>> afgerondeRondes = new Dictionary<string, List<Rondetijd>>();

      //alle beacons ophalen en in lijst zetten
      foreach (IGrouping<string, DataPoint> grouping in datapoints.GroupBy(datapoint => datapoint.Naam))
      {
        beacons.Add(grouping.Key);
        afgerondeRondes.Add(grouping.Key, new List<Rondetijd>());
      }

      foreach (string beacon in beacons)
      {
        DataPoint previousDatapoint = null;
        foreach (DataPoint currentDatapoint in datapoints.Where(datapoint => datapoint.Naam == beacon)
          .OrderBy(datapoint => datapoint.Datum))
        {
          if (previousDatapoint == null)
          {
            previousDatapoint = currentDatapoint;
            continue;
          }

          if (previousDatapoint.NodeId != currentDatapoint.NodeId)
          {
            if (currentDatapoint.Datum.HasValue && previousDatapoint.Datum.HasValue)
            {
              Rondetijd rondetijd = new Rondetijd
              {
                FromNode = allNodes.Where(node => node.NodeId == previousDatapoint.NodeId).Select(node => node.Naam).FirstOrDefault(),
                RondeDuur = Convert.ToInt32((currentDatapoint.Datum.Value - previousDatapoint.Datum.Value).TotalSeconds),
                ToNode = allNodes.Where(node => node.NodeId == currentDatapoint.NodeId).Select(node => node.Naam).FirstOrDefault()
              };
              afgerondeRondes.GetValueOrDefault(currentDatapoint.Naam).Add(rondetijd);
            }
          }
          previousDatapoint = currentDatapoint;
        }
      }
      return afgerondeRondes;
    }
  }
}
