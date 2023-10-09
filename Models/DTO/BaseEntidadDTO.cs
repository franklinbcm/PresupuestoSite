using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class BaseEntidadDTO
    {
        [Required]
        public string CREADO_POR { get; set; }

        [Required]
        public string ESTATUS_REGISTRO { get; set; }
    }
}