using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PresupuestoSite.Common;
using PresupuestoSite.Models;
using PresupuestoSite.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PresupuestoSite.Servicios.Cargas
{
    public class CargasServicio
    {
        private HttpClient client = new HttpClient();
        public  IEnumerable<PresupuestoCargaVM> GetPresupuestoPorAno(int presupuestoAnualDe)
        {
            var rutaApi = ConfigurationManager.AppSettings["PresupuestoApi"];

            //client.DefaultRequestHeaders.Accept.Clear();
            //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            ////De esta manera se puede reutilizar y no tener que pasar la irl base como en el caso del metodo de GetGorestUsers de abajo.

            //var result = await client.GetAsync(rutaApi + @"/presupuesto/TodoPresupuestoCargadoPorPres/2023");
            //var resuldData = result.Content.ReadFromJsonAsync<PresupuestoCarga[]>().Result;

            var jSon = "";

            using (WebClient wc = new WebClient())
            {
                jSon = wc.DownloadString(Utilidades.GetApiRutaUnida($"/presupuesto/TodoPresupuestoCargadoPorPres/{presupuestoAnualDe}"));
            }
            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
            resultData = JsonConvert.SerializeObject((dynamic)resultData.data);

             var dataResult = JsonConvert.DeserializeObject<PresupuestoCargaVM[]>(resultData);

            return dataResult;


        }
        public IEnumerable<PresupuestoCuotaCargaVM> GetCuotaPorAno(int presupuestoAnualDe)
        {
            var rutaApi = ConfigurationManager.AppSettings["PresupuestoApi"];

            //client.DefaultRequestHeaders.Accept.Clear();
            //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            ////De esta manera se puede reutilizar y no tener que pasar la irl base como en el caso del metodo de GetGorestUsers de abajo.

            //var result = await client.GetAsync(rutaApi + @"/presupuesto/TodoPresupuestoCargadoPorPres/2023");
            //var resuldData = result.Content.ReadFromJsonAsync<PresupuestoCarga[]>().Result;

            var jSon = "";

            using (WebClient wc = new WebClient())
            {
                jSon = wc.DownloadString(Utilidades.GetApiRutaUnida($"/presupuestoCuota/TodoPresupuestoCuotaCargadoPorPres/{presupuestoAnualDe}"));
            }
            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
            resultData = JsonConvert.SerializeObject((dynamic)resultData.data);

            var dataResult = JsonConvert.DeserializeObject<PresupuestoCuotaCargaVM[]>(resultData);

            return dataResult;


        }

    }
}