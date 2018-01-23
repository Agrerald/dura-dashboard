using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace dura_vermeer_dashboard.Controllers
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
