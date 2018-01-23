using System;
using System.Collections.Generic;

namespace dura_vermeer_dashboard.Models.DB
{
    public partial class DataPoint
    {
        public int DataPointId { get; set; }
        public string Naam { get; set; }
        public DateTime? Datum { get; set; }
        public int Rssi { get; set; }
        public int Afstand { get; set; }
        public int NodeId { get; set; }

        public Node Node { get; set; }
    }
}
