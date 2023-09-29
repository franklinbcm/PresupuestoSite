using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
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
    }
}