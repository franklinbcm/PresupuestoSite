using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class LineaGastoObjetoMovimiento : BaseEntidad
    {
        public int ID { get; set; }
        public int LINE_ID { get; set; }
        public int PRESUPUESTO_ID { get; set; }
        public decimal ARRASTRE_COMPROMISO { get; set; }
        public decimal CONTENIDO_ECONOMICO { get; set; }
        public string CONTENIDO_ECONOMICO_DESC { get; set; }
        public decimal PEDIDO { get; set; }
        public string PEDIDO_DESC { get; set; }
        public decimal RESERVA { get; set; }
        public string RESERVA_DESC { get; set; }
        public decimal SOLICITUD_PEDIDO { get; set; }
        public string SOLICITUD_PEDIDO_DESC { get; set; }
        public decimal FACTURA { get; set; }
        public string FACTURA_DESC { get; set; }
        public DateTime FECHA { get; set; }
        public string DESCRIPCION { get; set; }

    }
}