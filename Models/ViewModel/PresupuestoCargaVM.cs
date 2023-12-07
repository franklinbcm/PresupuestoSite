using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models.ViewModel
{
    public class PresupuestoCargaVM : PresupuestoCarga
    {
        public string CODIGO_SUBPARTIDA { get; set; }
        public string NOMBRE_SUBPARTIDA { get; set; }
        public string ABREV_NOMBRE { get; set; }
        public int GRUPO_ID { get; set; }
        public string CODIGO_GRUPO { get; set; }
        public string NOMBRE_GRUPO { get; set; }
        public int PARTIDA_ID { get; set; }
        public string CODIGO_PARTIDA { get; set; }
        public string NOMBRE_PARTIDA { get; set; }
        public int? SECUENCIA { get; set; }
        public string CODIGO_MONEDA { get; set; }
        public string MONEDA { get; set; }
        public string CODIGO_TIPO_MOVIMIENTO { get; set; }
        public string TIPO_MOVIMIENTO_NOMBRE { get; set; }
        public string NOMBRE_UNIDAD_FISCALIZADORA { get; set; }
        public string TRIMESTRE_CODIGO { get; set; }
        public string NOMBRE_TRIMESTRE { get; set; }
    }

}