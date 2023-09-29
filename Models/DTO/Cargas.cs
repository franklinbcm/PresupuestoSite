using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Models.DTO
{
    public class Cargas
    {
        public PresupuestoCarga  presupuestoCarga { get; set; }
        public IEnumerable<SelectListItem> TiposDocumentos = new List<SelectListItem>()
        {
            new SelectListItem(){ Text = "Carga de Presupuesto", Value="PRESUPUESTO"},
            new SelectListItem(){ Text = "Carga de Cuotas", Value="CUOTA"},
        };
    }
}      