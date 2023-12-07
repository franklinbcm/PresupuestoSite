using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class UnidadFiscalizadora : BaseEntidad
    {
        public int ID { get; set; }
        public int PRESUPUESTO_ID { get; set; }
        public int PRESUPUESTO_ANUAL_DE { get; set; }
        public decimal COMPROMISO { get; set; }
        public DateTime FECHA { get; set; }
        public string DETALLES { get; set; }
        public string COD_PEDIDOS_RESERVAS { get; set; }
        public bool ES_PEDIDO { get; set; }
        public int? LINEA_MOV_ID { get; set; }
        public int TIPO_MOVIMIENTO_ID { get; set; }
        public string CODIGO_TIPO_MOVIMIENTO { get; set; }
        public string TIPO_MOVIMIENTO_NOMBRE { get; set; }
        public int CUOTA_ID { get; set; }
        public string DETALLES_CUOTA { get; set; }
        public int? LINEA_CAB_ID { get; set; }
        public string LIN_CAB_DESCRIPCION { get; set; }
        public string LIN_CAB_CODIGO_PRESUPUESTARIO { get; set; }
        public string LIN_CAB_CONTRATO { get; set; }
        public string LIN_CAB_PROVEEDOR { get; set; }
        public string TRIMESTRE_CODIGO_CAR { get; set; }
        public string NOMBRE_TRIMESTRE_CAR { get; set; }
        public string TRIMESTRE_CODIGO_CUO { get; set; }
        public string NOMBRE_TRIMESTRE_CUO { get; set; }


    }
}