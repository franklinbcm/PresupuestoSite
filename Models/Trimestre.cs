using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class Trimestre : BaseEntidad
    {
        public int ID { get; set; }
        public string CODIGO { get; set; }
        public string NOMBRE_TRIMESTRE { get; set; }

    }
}