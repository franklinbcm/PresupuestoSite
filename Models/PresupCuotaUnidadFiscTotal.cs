using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class PresupCuotaUnidadFiscTotal
    {
        public string COD_DE_CLASIFICACION { get; set; }
        public string FUENTE_FINANCIAMIENTO_FONDO { get; set; }
        public string CENTRO_GESTOR { get; set; }
        public int PRESUPUESTO_ANUAL_DE { get; set; }
        public int PARTIDA_ID { get; set; }
        public string NOMBRE_PARTIDA { get; set; }
        public int GRUPO_ID { get; set; }
        public string TITULO_NOMBRE_GRUPO { get; set; }
        public int SUBPARTIDA_ID { get; set; }
        public string NOMBRE_SUBPARTIDA { get; set; }
        public string CODIGO_SUBPARTIDA { get; set; }
        public string UNIDAD_FISCALIZADORA { get; set; }
        public int TIPO_MONEDA_ID { get; set; }
        public string TIPO_MONEDA_CODIGO { get; set; }
        public string MONEDA { get; set; }
        public decimal MONTO_DE_LEY { get; set; }
        public decimal CUOTA_PRESUPUESTARIA_TOTAL { get; set; }
        public int PRESUPUESTOS_CARGADOS_ID { get; set; }
        public decimal COMPROMISO_TOTAL { get; set; }
        public decimal DISPONIBILIDAD { get; set; }
        public int TIPO_MOVIMIENTO_ID { get; set; }
        public string CODIGO_TIPO_MOVIMIENTO { get; set; }
        public string TIPO_MOVIMIENTO_NOMBRE { get; set; }
    }
}