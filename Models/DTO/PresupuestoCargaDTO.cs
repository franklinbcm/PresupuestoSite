using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class PresupuestoCargaDTO : BaseEntidadDTO
    {
        [Required(ErrorMessage = "ID Requerido")]
        public int ID { get; set; }
        [Required]
        public decimal MONTO_DE_LEY { get; set; }

        [Required(ErrorMessage = "DETALLES Requerido"), MaxLength(200)]
        public string DETALLES { get; set; } = "";

        [Required(ErrorMessage = "PRESUPUESTO_ANUAL_DE Requerido")]
        public int PRESUPUESTO_ANUAL_DE { get; set; }
    }

}