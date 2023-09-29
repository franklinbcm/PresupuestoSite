using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class PresupuestoCarga : BaseEntidad
    {
        public int ID { get; set; }
        public string COD_DE_CLASIFICACION { get; set; }
        public string FUENTE_FINANCIAMIENTO_FONDO { get; set; }
        public string CENTRO_GESTOR { get; set; }
        public int SUBPARTIDA_ID { get; set; }
        public string UNIDAD_FISCALIZADORA { get; set; }
        public int TIPO_MONEDA_ID { get; set; }
        public decimal MONTO_DE_LEY { get; set; }
        public string DETALLES { get; set; }
        public int PRESUPUESTO_ANUAL_DE { get; set; }
    }
}