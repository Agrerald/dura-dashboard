using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Duravermeer.Dashboard.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace Duravermeer.Dashboard.Repository
{
  public class TrackerRepository : ITrackerRepository
  {
    public duravermeerContext _context { get; }

    public TrackerRepository(duravermeerContext duravermeerContext)
    {
      _context = duravermeerContext;
    }

    public async Task AddNode(Node node)
    {
      await _context.Node.AddAsync(node);
      await _context.SaveChangesAsync();
    }

    public async Task AddDataPoint(DataPoint dataPoint)
    {
      await _context.DataPoint.AddAsync(dataPoint);
      await _context.SaveChangesAsync();
    }

    public async Task AddDataPoint(List<DataPoint> dataPoints)
    {
      foreach (var dataPoint in dataPoints)
      {
        await _context.DataPoint.AddAsync(dataPoint);
      }

      await _context.SaveChangesAsync();
    }

    public async Task<Node> FindNode(string name)
    {
      return await _context.Node
        .Where(predicate: n => n.Naam == name)
        .SingleOrDefaultAsync();
    }

    public async Task<List<Node>> FindAllNodes()
    {
      return await _context.Node.ToListAsync();
    }

    public async Task<IList<DataPoint>> FindDataPoint(string date1, string date2, int nodeId)
    {
      var dateTime1 = DateTime.Parse(date1);
      var dateTime2 = DateTime.Parse(date2);
      return await _context.DataPoint
        .Where(predicate: d =>  d.Datum.Value >= dateTime1
                               && d.Datum.Value <= dateTime2
                               && d.NodeId == nodeId)
        .ToListAsync();
    }

    public async Task<IList<DataPoint>> FindDataPoint(string date1, string date2)
    {
      var dateTime1 = DateTime.Parse(date1);
      var dateTime2 = DateTime.Parse(date2);
      return await _context.DataPoint
        .Where(predicate: d => d.Datum.Value >= dateTime1
                               && d.Datum.Value <= dateTime2)
        .ToListAsync();
    }

    public async Task RemoveNode(string id)
    {
      var node = _context.Node
        .SingleOrDefault(predicate: n => n.Naam == id);
      if (node == null)
      {
        return;
      }

      _context.Node.Remove(node);
      await _context.SaveChangesAsync();
    }

    public async Task RemoveDataPoint(string id)
    {
      var datapoint = _context.DataPoint
        .SingleOrDefault(predicate: d => d.DataPointId == int.Parse(id));
      if (datapoint == null)
      {
        return;
      }

      _context.DataPoint.Remove(datapoint);
      await _context.SaveChangesAsync();
    }
  }
}
