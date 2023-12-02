using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.DTO
{
    public class LineaGastoObjetoMovimientoDTO : BaseEntidadDTO
    {
        public int ID { get; set; }
        public int LINE_ID { get; set; }
        public int PRESUPUESTO_ID { get; set; }
        public decimal ARRASTRE_COMPROMISO { get; set; } = 0;
        public decimal CONTENIDO_ECONOMICO { get; set; } = 0;
        public string CONTENIDO_ECONOMICO_DESC { get; set; }
        public decimal PEDIDO { get; set; } = 0;
        public string PEDIDO_DESC { get; set; }
        public decimal RESERVA { get; set; } = 0;
        public string RESERVA_DESC { get; set; }
        public decimal SOLICITUD_PEDIDO { get; set; } = 0;
        public string SOLICITUD_PEDIDO_DESC { get; set; }
        public decimal FACTURA { get; set; } = 0;
        public string FACTURA_DESC { get; set; }
        public DateTime FECHA { get; set; }
        public string DESCRIPCION { get; set; }

    }
}