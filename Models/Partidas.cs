using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class Partidas : BaseEntidad
    {
        public int ID { get; set; }
        public string CODIGO_PARTIDA { get; set; }
        public string NOMBRE_PARTIDA { get; set; }
        public int? SECUENCIA { get; set; }
    }
}