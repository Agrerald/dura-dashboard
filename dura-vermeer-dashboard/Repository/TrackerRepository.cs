using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Duravermeer.Dashboard.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace Duravermeer.Dashboard.Repository
{
  public class TrackerRepository: ITrackerRepository
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

    public async Task<Node> FindNode(string name)
    {
      return await _context.Node
        .Where(n => n.Naam == name)
        .SingleOrDefaultAsync();
    }

    public async Task<IList<DataPoint>> FindDataPoint(string id, string datum)
    {
      return await _context.DataPoint
        .Where(d => d.Naam == id && DateTime.Compare(d.Datum.Value.Date, DateTime.Parse(datum).Date) == 0)
        .ToListAsync();
    }

    public async Task RemoveNode(string id)
    {
      throw new System.NotImplementedException();
    }

    public async Task RemoveDataPoint(string id, string datum)
    {
      throw new System.NotImplementedException();
    }
  }
}
