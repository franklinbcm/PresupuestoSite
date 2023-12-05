using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class UnidadFiscalizadoraDTO : BaseEntidadDTO
    {
        public int ID { get; set; }
        public int PRESUPUESTO_ID { get; set; }
        public int PRESUPUESTO_ANUAL_DE { get; set; }
        public decimal COMPROMISO { get; set; }
        public DateTime FECHA { get; set; }
        public string DETALLES { get; set; }
        public string COD_PEDIDOS_RESERVAS { get; set; }
        public bool ES_PEDIDO { get; set; }
        public int LINEA_MOV_ID { get; set; }
        public int CUOTA_ID { get; set; }
    }
}