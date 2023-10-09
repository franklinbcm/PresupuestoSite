using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class PresupuestoYCuotaRemovDTO
    {
        [Required(ErrorMessage = "ID Requerido")]
        public int ID { get; set; }
        [Required(ErrorMessage = "PRESUPUESTO_ANUAL_DE Requerido")]
        public int PRESUPUESTO_ANUAL_DE { get; set; }

        [Required]
        public string CREADO_POR { get; set; }
    }
}