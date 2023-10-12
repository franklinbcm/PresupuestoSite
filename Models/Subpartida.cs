using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class Subpartida : BaseEntidad
    {
        public int ID { get; set; }
        public string CODIGO_SUBPARTIDA { get; set; }
        public string NOMBRE_SUBPARTIDA { get; set; }
        public string ABREV_NOMBRE { get; set; }
        public int GRUPO_ID { get; set; }
    }
}