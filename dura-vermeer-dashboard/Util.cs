using System;
using System.Collections.Generic;
using Duravermeer.Dashboard.Models.DB;

namespace Duravermeer.Dashboard
{
  public class Util
  {
    public static Dictionary<string, List<int>> GetRondeTijden(IEnumerable<DataPoint> datapoints)
    {
      //ipv van kijken of naam anders is dan vorige en dan een ronde afronden of beginnen, tijd vergelijken met vorig opgepikte beacon.
      DataPoint previousDatapoint = null;
      var onAfgerondeRondes = new Dictionary<string, DateTime>();
      var afgerondeRondes = new Dictionary<string, List<int>>();
      foreach (var currentDatapoint in datapoints)
      {
        if (previousDatapoint == null)
        {
          previousDatapoint = currentDatapoint;
          continue;
        }

        if (previousDatapoint.Naam != currentDatapoint.Naam)
        {
          //afronden van ronde
          if (onAfgerondeRondes.ContainsKey(currentDatapoint.Naam))
          {
            var lastRegistered = onAfgerondeRondes.GetValueOrDefault(currentDatapoint.Naam);
            var rondetijden = afgerondeRondes.GetValueOrDefault(currentDatapoint.Naam);
            if (rondetijden == null)
            {
              rondetijden = new List<int>();
              afgerondeRondes.Add(currentDatapoint.Naam, rondetijden);
            }

            if (currentDatapoint.Datum != null)
              rondetijden.Add(Convert.ToInt32((currentDatapoint.Datum.Value - lastRegistered).TotalSeconds));
            onAfgerondeRondes.Remove(currentDatapoint.Naam);
          }

          //start nieuwe ronde
          if (!onAfgerondeRondes.ContainsKey(previousDatapoint.Naam))
          {
            if (previousDatapoint.Datum != null)
              onAfgerondeRondes.Add(previousDatapoint.Naam, previousDatapoint.Datum.Value);
          }
        }

        previousDatapoint = currentDatapoint;
      }

      return afgerondeRondes;
    }
  }
}
