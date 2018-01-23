using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Duravermeer.Dashboard.Controllers
{
  [Route("api/[controller]")]
  public class ValuesController: Controller
  {
    [HttpGet]
    public IEnumerable<string> Get() {
      return new string[] { "Hello", "World" };
    }
  }
}
