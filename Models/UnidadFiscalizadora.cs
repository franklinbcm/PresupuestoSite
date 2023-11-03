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
        public string LINEA { get; set; }
        public int TIPO_MOVIMIENTO_ID { get; set; }
        public string CODIGO_TIPO_MOVIMIENTO { get; set; }
        public string TIPO_MOVIMIENTO_NOMBRE { get; set; }
        public int CUOTA_ID { get; set; }
        public string DETALLES_CUOTA { get; set; }


    }
}