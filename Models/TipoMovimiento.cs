using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class TipoMovimiento: BaseEntidad
    {
        public int ID { get; set; }
        public string CODIGO { get; set; }
        public string MOVIMIENTO_NOMBRE { get; set; }
        public string DETALLES { get; set; }
        public string SECUENCIA { get; set; }
        public bool ES_CARGA { get; set; }
    }
}