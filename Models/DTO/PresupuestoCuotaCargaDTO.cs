using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class PresupuestoCuotaCargaDTO : BaseEntidadDTO
    {
        [Required(ErrorMessage = "ID Requerido")]
        public int ID { get; set; }
        [Required]
        public decimal CUOTA_PRESUPUESTARIA { get; set; }

        [Required(ErrorMessage = "DETALLES Requerido"), MaxLength(200)]
        public string DETALLES_CUOTA { get; set; } = "";

        [Required(ErrorMessage = "PRESUPUESTO_ANUAL_DE Requerido")]
        public int PRESUPUESTO_ANUAL_DE { get; set; }
    }

}