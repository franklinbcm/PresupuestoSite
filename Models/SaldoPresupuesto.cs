using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class SaldoPresupuesto 
    {
        public int ID { get; set; }
        public string COD_DE_CLASIFICACION { get; set; }
        public string FUENTE_FINANCIAMIENTO_FONDO { get; set; }
        public string CENTRO_GESTOR { get; set; }
        public int PRESUPUESTO_ANUAL_DE { get; set; }
        public int PARTIDA_ID { get; set; }
        public string NOMBRE_PARTIDA { get; set; }
        public int GRUPO_ID { get; set; }
        public string NOMBRE_GRUPO { get; set; }
        public int SUBPARTIDA_ID { get; set; }
        public string CODIGO_SUBPARTIDA { get; set; }
        public string NOMBRE_SUBPARTIDA { get; set; }
        public string ABREV_NOMBRE { get; set; }
        public int TIPO_MONEDA_ID { get; set; }
        public string CODIGO_MONEDA { get; set; }
        public string MONEDA { get; set; }
        public decimal APROPIACION { get; set; }
        public decimal MONTO_DE_LEY { get; set; }
        public decimal SALDO { get; set; } = 0;
        public decimal COMPROMISO { get; set; }
        public DateTime FECHA { get; set; }
        public string DETALLES { get; set; }
        public string COD_PEDIDOS_RESERVAS { get; set; }
        public string UNIDAD_FISCALIZADORA { get; set; }
        public string TITULO_PARTIDA { get; set; }
        public string TITULO_GRUPO { get; set; }
        public string TITULO_SUBPARTIDA { get; set; }
        public string NOMBRE_UNIDAD_FISCALIZADORA { get; set; }
        public SaldoPresupuestoGeneral GENERAL { get; set; }
    }
    public class SaldoPresupuestoGeneral
    {
        public decimal montoLey { get; set; }
        public decimal saldoDisp { get; set; }
    }
}