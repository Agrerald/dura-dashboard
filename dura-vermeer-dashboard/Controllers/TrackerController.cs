using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Duravermeer.Dashboard.Models.DB;
using Duravermeer.Dashboard.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Duravermeer.Dashboard.Controllers
{
  [Route("api/[controller]")]
  public class TrackerController : Controller
  {
    private ITrackerRepository TrackerRepo { get; }

    public TrackerController(ITrackerRepository trackerRepo)
    {
      TrackerRepo = trackerRepo;
    }

    [HttpGet("node", Name = "GetNode")]
    public async Task<IActionResult> GetNodeByName([FromQuery]string name)
    {
      var node = await TrackerRepo.FindNode(name);
      if (node == null)
      {
        return NotFound();
      }

      return Ok(node);
    }

    [HttpGet("datapoint", Name = "GetDataPoint")]
    public async Task<IActionResult> GetDataPointByName([FromQuery]string fromDate, [FromQuery]string toDate, [FromQuery]int nodeId)
    {
      var dataPoints = await TrackerRepo.FindDataPoint(fromDate, toDate, nodeId);
      if (dataPoints == null)
      {
        return NotFound();
      }

      return Ok(dataPoints);
    }

    [HttpGet]
    [Route("allNodes")]
    public async Task<IActionResult> GetAllNode()
    {
      var nodes = await TrackerRepo.FindAllNodes();
      if (nodes == null)
      {
        return NotFound();
      }

      return Ok(nodes);
    }


    [HttpPost]
    [Route("node")]
    public async Task<IActionResult> CreateNode([FromBody] Node node)
    {
      if (node == null)
      {
        return BadRequest();
      }
      await TrackerRepo.AddNode(node);
      return CreatedAtRoute("GetNode", new { Controller = "Tracker", name = node.Naam }, node);
    }

    [HttpPost]
    [Route("datapoint")]
    public async Task<IActionResult> CreateDataPoint([FromBody] DataPoint dataPoint)
    {
      if (dataPoint == null)
      {
        return BadRequest();
      }
      await TrackerRepo.AddDataPoint(dataPoint);
      return CreatedAtRoute("GetDataPoint", new { Controller = "Tracker", name = dataPoint.Naam, datum = dataPoint.Datum }, dataPoint);
    }

    [HttpDelete]
    [Route("datapoint")]
    public async Task<IActionResult> RemoveDataPoint(string id)
    {
      if (id == null)
      {
        return BadRequest();
      }
      await TrackerRepo.RemoveDataPoint(id);
      return Accepted();
    }

    [HttpDelete]
    [Route("node")]
    public async Task<IActionResult> RemoveNode(string id)
    {
      if (id == null)
      {
        return BadRequest();
      }
      await TrackerRepo.RemoveNode(id);
      return Accepted();
    }

    [HttpPost]
    [Route("import")]
    public async Task<IActionResult> Import([FromBody] List<DataPoint> dataPoints)
    {
      if (dataPoints == null)
      {
        return BadRequest();
      }
      foreach (var dataPoint in dataPoints)
      {
        await TrackerRepo.AddDataPoint(dataPoint);
      }
      return Accepted();
    }

    [HttpGet]
    [Route("rondetijden")]
    public async Task<IActionResult> RondeTijden([FromQuery] string fromDate, [FromQuery] string toDate)
    {
      IList<DataPoint> dataPoints = await TrackerRepo.FindDataPoint(fromDate, toDate);
      IList<Node> nodes = await TrackerRepo.FindAllNodes();
      var rondeTijden = Util.GetRondeTijden(dataPoints, nodes);
      return Ok(rondeTijden);
    }

  }
}
