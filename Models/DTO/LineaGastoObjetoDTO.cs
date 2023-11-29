using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class LineaGastoObjetoDTO : BaseEntidadDTO
    {
        public int ID { get; set; }

        public int PRESUPUESTO_ANUAL_DE { get; set; }
 
        public string CODIGO_PRESUPUESTARIO { get; set; }

        public string DESCRIPCION { get; set; }

        public string CONTRATO { get; set; }
  
        public string PROVEEDOR { get; set; }

    }
}