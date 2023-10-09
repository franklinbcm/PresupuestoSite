using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class Prueba
    {
        public int ID { get; set; }
        public decimal MONTO_DE_LEY { get; set; }
        public string DETALLES { get; set; } = "";
        public string CREADO_POR { get; set; }
        public string ESTATUS_REGISTRO { get; set; }

        public int PRESUPUESTO_ANUAL_DE { get; set; }
    }
}