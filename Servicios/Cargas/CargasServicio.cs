using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PresupuestoSite.Common;
using PresupuestoSite.Models;
using PresupuestoSite.Models.DTO;
using PresupuestoSite.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;

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
            PresupuestoCarga[] errorMessage = new PresupuestoCarga[0];
            using (WebClient wc = new WebClient())
            {
                try
                {
                    jSon = wc.DownloadString(Utilidades.GetApiRutaUnida($"/presupuesto/TodoPresupuestoCargadoPorPres/{presupuestoAnualDe}"));
                }
                catch (Exception ex)
                {
                  var result =  Utilidades.GetEstadoRequest(ex);
                    PresupuestoCargaVM presupuestoCarga = new PresupuestoCargaVM() { MENSAJE_REQUEST = result.MENSAJE_REQUEST,
                                                                                     ESTATUS_REQUEST = result.ESTATUS_REQUEST };
                    jSon = JsonConvert.SerializeObject(presupuestoCarga);
                    wc.Dispose();
                    

                }
                
            }
             

            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
            if(resultData != null)
            {
                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);

                var dataResult = JsonConvert.DeserializeObject<PresupuestoCargaVM[]>(resultData);

                return dataResult;
            }
            return resultData;


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
               
                try
                {
                    jSon = wc.DownloadString(Utilidades.GetApiRutaUnida($"/presupuestoCuota/TodoPresupuestoCuotaCargadoPorPres/{presupuestoAnualDe}"));
                }
                catch (Exception ex)
                {
                    var result = Utilidades.GetEstadoRequest(ex);
                    PresupuestoCuotaCargaVM presupuestoCarga = new PresupuestoCuotaCargaVM()
                    {
                        MENSAJE_REQUEST = result.MENSAJE_REQUEST,
                        ESTATUS_REQUEST = result.ESTATUS_REQUEST
                    };
                    jSon = JsonConvert.SerializeObject(presupuestoCarga);
                    wc.Dispose();


                }
            }
            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
            if (resultData != null)
            {
                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);

                var dataResult = JsonConvert.DeserializeObject<PresupuestoCuotaCargaVM[]>(resultData);

                return dataResult;
            }
            return resultData;


        }
        public void SetCargarDocumento(HttpPostedFileBase files)
        {

            var jSon = "";

            using (WebClient wc = new WebClient())
            {

                try
                {
                    jSon = wc.DownloadString(Utilidades.GetApiRutaUnida($"/Presupuesto/Presupuesto_ReadFile"));
                }
                catch (Exception ex)
                {
                    var result = Utilidades.GetEstadoRequest(ex);
                    PresupuestoCargaVM presupuestoCarga = new PresupuestoCargaVM()
                    {
                        MENSAJE_REQUEST = result.MENSAJE_REQUEST,
                        ESTATUS_REQUEST = result.ESTATUS_REQUEST
                    };
                    jSon = JsonConvert.SerializeObject(presupuestoCarga);
                    wc.Dispose();


                }
            }
            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
            if (resultData != null)
            {
                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);

                var dataResult = JsonConvert.DeserializeObject<PresupuestoCuotaCargaVM[]>(resultData);

                 
            }
             


        }

        public async Task<List<PresupuestoCarga>> SetPresupuestoPorId(PresupuestoCargaDTO presupuestoCarga)
        {
            List<PresupuestoCarga> presupuestos = new List<PresupuestoCarga>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Put, Utilidades.GetApiRutaUnida($"/presupuesto/EdiPresupuestoAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(presupuestoCarga), Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string jSon = await content.ReadAsStringAsync();

                            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
                            if (resultData != null)
                            {
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                presupuestos.AddRange(JsonConvert.DeserializeObject<PresupuestoCarga[]>(resultData));
                            }


                        }
                        else
                        {
                            presupuestos.Add(new PresupuestoCarga { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return presupuestos;

        }
        public async Task<bool> SetRemovePresupuestoPorId(PresupuestoYCuotaRemovDTO presupuestoCargaRem)
        {
            List<PresupuestoCarga> presupuestos = new List<PresupuestoCarga>();
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, Utilidades.GetApiRutaUnida($"/presupuesto/RemPresupuestoAsync")))
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(presupuestoCargaRem), Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {

                            return true;

                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            }

             

        }

        public async Task<List<PresupuestoCuotaCarga>> SetPresupuestoCuotaPorId(PresupuestoCuotaCargaDTO presupuestoCuotaCarga)
        {
            List<PresupuestoCuotaCarga> presupuestosCuota = new List<PresupuestoCuotaCarga>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Put, Utilidades.GetApiRutaUnida($"/presupuestoCuota/EdiCuotaAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear(); 
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(presupuestoCuotaCarga), Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string jSon = await content.ReadAsStringAsync();

                            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
                            if (resultData != null)
                            {
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                presupuestosCuota.AddRange(JsonConvert.DeserializeObject<PresupuestoCuotaCarga[]>(resultData));
                            }

                        }
                        else
                        {
                            presupuestosCuota.Add(new PresupuestoCuotaCarga { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return presupuestosCuota;

        }
        public async Task<bool> SetRemovePresupuestoCuotaPorId(PresupuestoYCuotaRemovDTO presupuestoCargaRem)
        {
            List<PresupuestoCarga> presupuestos = new List<PresupuestoCarga>();
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, Utilidades.GetApiRutaUnida($"/presupuestoCuota/RemCuotaAsync")))
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(presupuestoCargaRem), Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {

                            return true;

                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            }



        }

        public async Task<List<TipoMovimiento>> GetTipoPresupuesto()
        {
            List<TipoMovimiento> tipoMov = new List<TipoMovimiento>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/TipoMovimiento/TodoTipoMovimientosAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string jSon = await content.ReadAsStringAsync();

                            var resultData = (dynamic)JsonConvert.DeserializeObject(jSon);
                            if (resultData != null)
                            {
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                tipoMov.AddRange(JsonConvert.DeserializeObject<TipoMovimiento[]>(resultData));
                            }

                        }
                        else
                        {
                            tipoMov.Add(new TipoMovimiento { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return tipoMov;

        }
        public async Task<List<PresupuestoCargaVM>> GetListadoPresupuestoPorAno(int presupuestoAnualDe)
        {
            List < PresupuestoCargaVM> presupuestoCarga = new List<PresupuestoCargaVM>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/presupuesto/TodoPresupuestoCargadoPorPresAsync/{presupuestoAnualDe}")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string jSon = await content.ReadAsStringAsync();

                            var resultData = (dynamic)JsonConvert.DeserializeObject(jSon);
                            if (resultData != null)
                            {
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                presupuestoCarga.AddRange(JsonConvert.DeserializeObject<PresupuestoCargaVM[]>(resultData));
                            }

                        }
                        else
                        {
                            presupuestoCarga.Add(new PresupuestoCargaVM { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return presupuestoCarga;




        }

        public async Task<List<Trimestre>> GetTrimestreTodo()
        {
            List<Trimestre> trimestres = new List<Trimestre>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/trimestre/TodoTrimestreAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (HttpResponseMessage response = await client.SendAsync(request))
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string jSon = await content.ReadAsStringAsync();

                            var resultData = (dynamic)JsonConvert.DeserializeObject(jSon);
                            if (resultData != null)
                            {
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                trimestres.AddRange(JsonConvert.DeserializeObject<Trimestre[]>(resultData));
                            }

                        }
                        else
                        {
                            trimestres.Add(new Trimestre { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return trimestres;

        }



    }
}