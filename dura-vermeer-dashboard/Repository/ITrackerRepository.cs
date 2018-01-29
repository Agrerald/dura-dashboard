using System.Collections.Generic;
using System.Threading.Tasks;
using Duravermeer.Dashboard.Models.DB;

namespace Duravermeer.Dashboard.Repository
{
  public interface ITrackerRepository
  {
    Task AddNode(Node node);
    Task AddDataPoint(DataPoint dataPoint);
    Task<Node> FindNode(string name);
    Task<List<Node>> FindAllNodes();
    Task<IList<DataPoint>> FindDataPoint(string name, string date1, string date2, int nodeId);
    Task RemoveNode(string id);
    Task RemoveDataPoint(string id);
  }
}
