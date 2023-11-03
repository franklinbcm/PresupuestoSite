using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Models
{
    public class ListadosVM : SelectListItem
    {
        public string Titulo { get; set; }
        public string Opcional { get; set; }
    }
}