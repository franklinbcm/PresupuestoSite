using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresupuestoSite.Models
{
    public class PartidaGrupoSubPartida
    {
        public int PARTIDA_ID { get; set; }
        public string CODIGO_PARTIDA { get; set; }
        public string NOMBRE_PARTIDA { get; set; }
        public string TITULO_PARTIDA { get; set; }
        public int PARTIDA_ESTATUS_REGISTRO { get; set; }
        public string SECUENCIA { get; set; }
        public int? GRUPO_ID { get; set; }
        public string CODIGO_GRUPO { get; set; }
        public string NOMBRE_GRUPO { get; set; }
        public string TITULO_GRUPO { get; set; }
        public int? GRUPO_ESTATUS_REGISTRO { get; set; }
        public int? SUBPARTIDA_ID { get; set; }
        public string CODIGO_SUBPARTIDA { get; set; }
        public string TITULO_SUBPARTIDA { get; set; }
        public string NOMBRE_SUBPARTIDA { get; set; }
        public string SUBPARTIDA_ABREV_NOMBRE { get; set; }
        public int? SUBPARTIDA_ESTATUS_REGISTRO { get; set; }
    }
}