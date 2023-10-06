using PresupuestoSite.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace PresupuestoSite.Common
{
    public static class Utilidades
    {
        public static string GetApiRutaUnida(string endpointRuta)
        {
            var rutaApi = ConfigurationManager.AppSettings["PresupuestoApi"] + endpointRuta;
            return rutaApi;
        }
        public static string ArreglarCulturaString(string jsonString)
        {
            byte[] bytes = Encoding.Default.GetBytes(jsonString);
            jsonString = Encoding.UTF8.GetString(bytes);
            return jsonString;
        }
        public static RequestMensajes GetEstadoRequest(dynamic objectMensaje)
        {
            var result = GetEstatusRequestStr(objectMensaje.Message);

            return result;
        }
        public static byte[] ConvertToByteArray(string filePath)
        {
            byte[] fileByteArray = File.ReadAllBytes(filePath);
            return fileByteArray;
        }
        public static RequestMensajes GetEstatusRequestStr(string mensaje)
        {
            RequestMensajes Estado = new RequestMensajes() { MENSAJE_REQUEST = mensaje };

            if (mensaje.Contains("200"))
                Estado.ESTATUS_REQUEST =  HttpStatusCode.OK;
            if (mensaje.Contains("201"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.Created;
            if (mensaje.Contains("202"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.Accepted;
            if (mensaje.Contains("204"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.NoContent;
            if (mensaje.Contains("400"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.BadRequest;
            if (mensaje.Contains("401"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.Unauthorized;
            if (mensaje.Contains("403"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.Forbidden;
            if (mensaje.Contains("404"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.NotFound;
            if (mensaje.Contains("405"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.MethodNotAllowed;
            if (mensaje.Contains("406"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.NotAcceptable;
            if (mensaje.Contains("500"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.InternalServerError;
            if (mensaje.Contains("501"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.NotImplemented;
            if (mensaje.Contains("502"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.BadGateway;
            if (mensaje.Contains("503"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.ServiceUnavailable;
            if (mensaje.Contains("504"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.GatewayTimeout;
            if (mensaje.Contains("505"))
                Estado.ESTATUS_REQUEST = HttpStatusCode.HttpVersionNotSupported;


            return Estado;
        }
    }
}