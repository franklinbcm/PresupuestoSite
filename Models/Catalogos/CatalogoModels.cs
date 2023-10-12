using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Models.Catalogos
{
    public class CatalogoModels
    {
        public IEnumerable<SelectListItem> PartidasCatalog { get; set; }
        public IEnumerable<SelectListItem> SubPartidasCatalog { get; set; }
    }
}