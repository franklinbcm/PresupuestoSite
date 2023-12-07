using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.ViewModel
{
    public class LineaGastoObjetoMovimientoVM : LineaGastoObjetoMovimiento
    {
        public string CODIGO_PRESUPUESTARIO { get; set; }
        public string DESCRIPCION_LINEA_GASTO_OBJETO { get; set; }
        public string CONTRATO { get; set; }
        public string PROVEEDOR { get; set; }
        public string COD_DE_CLASIFICACION { get; set; }
        public string FUENTE_FINANCIAMIENTO_FONDO { get; set; }
        public string CENTRO_GESTOR { get; set; }
        public int SUBPARTIDA_ID { get; set; }
        public string CODIGO_SUBPARTIDA { get; set; }
        public string NOMBRE_SUBPARTIDA { get; set; }
        public string ABREV_NOMBRE { get; set; }
        public int GRUPO_ID { get; set; }
        public string CODIGO_GRUPO { get; set; }
        public string NOMBRE_GRUPO { get; set; }
        public int PARTIDA_ID { get; set; }
        public string CODIGO_PARTIDA { get; set; }
        public string NOMBRE_PARTIDA { get; set; }
        public string UNIDAD_FISCALIZADORA { get; set; }
        public decimal MONTO_DE_LEY { get; set; }
        public string DETALLE_PRESUPUESTO { get; set; }
        public decimal CUOTA_TRIMESTRE_UNO { get; set; }
        public decimal CUOTA_TRIMESTRE_DOS { get; set; }
        public decimal CUOTA_TRIMESTRE_TRES { get; set; }
        public decimal CUOTA_TRIMESTRE_CUATRO { get; set; }
        public decimal CUOTA_TOTAL { get; set; }
        public decimal DISPONIBLE_CUOTA_TOTAL { get; set; }
        public decimal DISPONIBLE_PRESUPUESTO_TOTAL { get; set; }
        public int PRESUPUESTO_ANUAL_DE { get; set; }
        public string NOMBRE_UNIDAD_FISCALIZADORA { get; set; }
    }
}