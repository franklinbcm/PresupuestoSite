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

namespace PresupuestoSite.Servicios.Trascacciones
{
    public class TransaccionesServicio
    {
        private HttpClient client = new HttpClient();

        public async Task<List<PresupuestoCuotaMontoLeyTotal>> GetPresupuestoMontoLeyCuotaPorPres(int presupuestoAnualDe)
        {
            List<PresupuestoCuotaMontoLeyTotal> presupuestos = new List<PresupuestoCuotaMontoLeyTotal>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/partidas/Partidas")))
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

                            var resultData = (dynamic)JsonConvert.DeserializeObject(Utilidades.ArreglarCulturaString(jSon));
                            if (resultData != null)
                            {
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                presupuestos.AddRange(JsonConvert.DeserializeObject<PresupuestoCuotaMontoLeyTotal[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }

        public async Task<List<Partidas>> GetPartida()
        {
            List<Partidas> presupuestos = new List<Partidas>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/partidas/Partidas")))
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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<Partidas[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }
        public async Task<List<Grupo>> GetGrupo()
        {
            List<Grupo> grupos = new List<Grupo>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/grupo/TodoGrupos")))
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
                                grupos.AddRange(JsonConvert.DeserializeObject<Grupo[]>(resultData));
                            }


                        }
                    }
                }
            }

            return grupos;

        }

        public async Task<List<Subpartida>> GetSubPartidas()
        {
            List<Subpartida> subpartidas = new List<Subpartida>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/subpartida/TodoSubpartidas")))
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
                                subpartidas.AddRange(JsonConvert.DeserializeObject<Subpartida[]>(resultData));
                            }


                        }
                    }
                }
            }

            return subpartidas;

        }

        public async Task<List<PresupCuotaUnidadFiscTotal>> GetPresupCuotaUnidadFiscTotalFiltros(int? presupuestoAnualDe, int? partidaID, int? grupoID, int? subpartidaID)
        {
            List<PresupCuotaUnidadFiscTotal> presupuestos = new List<PresupCuotaUnidadFiscTotal>();
            var stpresupuestoAnualDe = presupuestoAnualDe == null? "null" : presupuestoAnualDe.ToString();
            var stpartidaID = partidaID == null ? "null" : partidaID.ToString();
            var stgrupoID = grupoID == null ? "null" : grupoID.ToString();
            var stsubpartidaID = subpartidaID == null ? "null" : subpartidaID.ToString();
            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/PresupCuotaUnidadFiscTotal/PresupCuotaUnidadFiscTotalFiltrosAsync/{stpresupuestoAnualDe}/{stpartidaID}/{stgrupoID}/{stsubpartidaID}")))
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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<PresupCuotaUnidadFiscTotal[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }

        public async Task<List<UnidadFiscalizadora>> GetUnidadesFiscalizadoras(int? presupuestoAnualDe, int? presupuestoID)
        {
            List<UnidadFiscalizadora> presupuestos = new List<UnidadFiscalizadora>();
            var stpresupuestoAnualDe = presupuestoAnualDe == null ? "null" : presupuestoAnualDe.ToString();
            var stpresupuestoID = presupuestoID == null ? "null" : presupuestoID.ToString();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/unidadFiscalizadora/UnidadFiscalizadoraProPresupuestoAsync/{stpresupuestoAnualDe}/{presupuestoID}")))
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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<UnidadFiscalizadora[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }


    }
}