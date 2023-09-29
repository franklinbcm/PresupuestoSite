using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public abstract class BaseEntidad
    {
        public string CREADO_POR { get; set; }
        public DateTime CREADO_EN { get; set; }
        public string MODIFICADO_POR { get; set; }
        public DateTime? MODIFICADO_EN { get; set; }
        public string ESTATUS_REGISTRO { get; set; }
    }
}