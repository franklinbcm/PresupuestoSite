using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class Grupo : BaseEntidad
    {
        public int ID { get; set; }
        public string CODIGO_GRUPO { get; set; }
        public string NOMBRE_GRUPO { get; set; }
        public int PARTIDA_ID { get; set; }

    }
}