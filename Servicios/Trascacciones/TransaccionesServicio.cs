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
            var stcuotaID = presupuestoID == null ? "null" : presupuestoID.ToString();

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

        public async Task<List<UnidadFiscalizadora>> AddUnidadFiscalizadora(UnidadFiscalizadoraDTO unidadFiscalizadora)
        {
            List<UnidadFiscalizadora> presupuestos = new List<UnidadFiscalizadora>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, Utilidades.GetApiRutaUnida($"/unidadFiscalizadora/agregarUnidadAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(unidadFiscalizadora), Encoding.UTF8, "application/json");

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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<UnidadFiscalizadora[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }
        public async Task<List<UnidadFiscalizadora>> EditUnidadFiscalizadora(UnidadFiscalizadoraDTO unidadFiscalizadora)
        {
            List<UnidadFiscalizadora> presupuestos = new List<UnidadFiscalizadora>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Put, Utilidades.GetApiRutaUnida($"/unidadFiscalizadora/editarUnidadAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(unidadFiscalizadora), Encoding.UTF8, "application/json");

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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<UnidadFiscalizadora[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }

        public async Task<List<PresupuestoCuotaCargaVM>> GetListaTipoMovimientoPorFiltros(int presupuestoAnualDe, int presupuestoCargadoID, int subpartidaID, string unidadFiscalizadora)
        {
            List<PresupuestoCuotaCargaVM> presupuestoCargaVM = new List<PresupuestoCuotaCargaVM>();
            var stpresupuestoAnualDe = presupuestoAnualDe == null ? "null" : presupuestoAnualDe.ToString();
            var stpresupuestoCargadoID = presupuestoCargadoID == null ? "null" : presupuestoCargadoID.ToString();
            var stsubpartidaID = subpartidaID == null ? "null" : subpartidaID.ToString();
            var stunidadFiscalizadora = unidadFiscalizadora == null ? "null" : unidadFiscalizadora.ToString();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/presupuestoCuota/GetPresupuestoCuotaUnidadFiscalizadoraTipoMovAsync/{stpresupuestoAnualDe}/{stpresupuestoCargadoID}/{stsubpartidaID}/{stunidadFiscalizadora}")))
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
                                presupuestoCargaVM.AddRange(JsonConvert.DeserializeObject<PresupuestoCuotaCargaVM[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestoCargaVM;

        }

        public async Task<List<LineaGastoObjeto>> GetLineaGastoObjeto(int presupuestoAnualDe)
        {
            List<LineaGastoObjeto> presupuestos = new List<LineaGastoObjeto>();
            var stpresupuestoAnualDe = presupuestoAnualDe == null ? "null" : presupuestoAnualDe.ToString();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/LineaGastoObjeto/GetLineaGastoObjetoPorPresAsync/{stpresupuestoAnualDe}")))
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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<LineaGastoObjeto[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }

        public async Task<List<LineaGastoObjetoMovimientoVM>> GetListadoMovimientoLineaGastoObjetoVM(int presupuestoAnualDe)
        {
            List<LineaGastoObjetoMovimientoVM> presupuestos = new List<LineaGastoObjetoMovimientoVM>();
            var stpresupuestoAnualDe = presupuestoAnualDe == null ? "null" : presupuestoAnualDe.ToString();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/LineaGastoObjeto/GetLineaMovimientoGastoObjetoVMPorPresAsync/{stpresupuestoAnualDe}")))
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
                                presupuestos.AddRange(JsonConvert.DeserializeObject<LineaGastoObjetoMovimientoVM[]>(resultData));
                            }


                        }
                    }
                }
            }

            return presupuestos;

        }


        public async Task<List<LineaGastoObjeto>> AgregarLineaGastoObjeto(LineaGastoObjetoDTO lineaGastoObjeto)
        {
            List<LineaGastoObjeto> lineaGastoObjetoList = new List<LineaGastoObjeto>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, Utilidades.GetApiRutaUnida($"/LineaGastoObjeto/agregarLineaAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(lineaGastoObjeto), Encoding.UTF8, "application/json");

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
                                lineaGastoObjetoList.AddRange(JsonConvert.DeserializeObject<LineaGastoObjeto[]>(resultData));
                            }


                        }
                    }
                }
            }

            return lineaGastoObjetoList;

        }

        public async Task<List<LineaGastoObjeto>> EditarLineaGastoObjeto(LineaGastoObjetoDTO lineaGastoObjeto)
        {
            List<LineaGastoObjeto> lineaGastoObjetoList = new List<LineaGastoObjeto>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Put, Utilidades.GetApiRutaUnida($"/LineaGastoObjeto/editarLineaAsync")))
            {
                //Usando Token
                //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Parameters
                request.Content = new StringContent(JsonConvert.SerializeObject(lineaGastoObjeto), Encoding.UTF8, "application/json");

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
                                lineaGastoObjetoList.AddRange(JsonConvert.DeserializeObject<LineaGastoObjeto[]>(resultData));
                            }


                        }
                    }
                }
            }

            return lineaGastoObjetoList;

        }


    }
}