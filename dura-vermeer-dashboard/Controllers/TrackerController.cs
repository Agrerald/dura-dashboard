using System.Collections.Generic;
using System.Threading.Tasks;
using Duravermeer.Dashboard.Models.DB;
using Duravermeer.Dashboard.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Duravermeer.Dashboard.Controllers
{
  [Route("api/[controller]")]
  public class TrackerController : Controller
  {
    public ITrackerRepository TrackerRepo { get; set; }

    public TrackerController(ITrackerRepository trackerRepo)
    {
      TrackerRepo = trackerRepo;
    }

    [HttpGet("{name}", Name = "GetNode")]
    public async Task<IActionResult> GetNodeByName(string name)
    {
      var node = await TrackerRepo.FindNode(name);
      if (node == null)
      {
        return NotFound();
      }

      return Ok(node);
    }

    [HttpGet("{name}/{datum}", Name = "GetDataPoint")]
    public async Task<IActionResult> GetDataPointByName(string name, string datum)
    {
      var dataPoints = await TrackerRepo.FindDataPoint(name, datum);
      if (dataPoints == null)
      {
        return NotFound();
      }

      return Ok(dataPoints);
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
      return CreatedAtRoute("GetNode", new { Controller = "", name = node.Naam }, node);
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
      return CreatedAtRoute("GetDataPoint", new { Controller = $"Tracker", name = dataPoint.Naam }, dataPoint);
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
      return Ok();
    }

  }
}
