using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace PresupuestoSite.Models
{
    public abstract class BaseEntidad : RequestMensajes
    {
        public string CREADO_POR { get; set; }
        public DateTime CREADO_EN { get; set; }
        public string MODIFICADO_POR { get; set; }
        public DateTime? MODIFICADO_EN { get; set; }
        public string ESTATUS_REGISTRO { get; set; }


    }
    public class RequestMensajes
    {
        public string MENSAJE_REQUEST { get; set; }
        public HttpStatusCode ESTATUS_REQUEST { get; set; } = HttpStatusCode.OK;
    }
}