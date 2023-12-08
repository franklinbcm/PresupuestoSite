using Newtonsoft.Json;
using PresupuestoSite.Common;
using PresupuestoSite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace PresupuestoSite.Servicios.Reportes
{
    public class ReportesServicio
    {
        private HttpClient client = new HttpClient();
        
        public async Task<List<SubpartidaPresupuestoCargado>> GetSubPartidas(int presupuestoAnualDe)
        {
            List<SubpartidaPresupuestoCargado> subpartidas = new List<SubpartidaPresupuestoCargado>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/subpartida/SubpartidaPresupuestoCargadoAsync/{presupuestoAnualDe}/")))
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
                                subpartidas.AddRange(JsonConvert.DeserializeObject<SubpartidaPresupuestoCargado[]>(resultData));
                            }

                        }
                        else
                        {
                            subpartidas.Add(new SubpartidaPresupuestoCargado { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return subpartidas;

        }


        public async Task<List<SaldoPresupuesto>> GetSubPartidasPresupuestosCargados(int presupuestoAnualDe, int partidaID = 0, int grupoID = 0, int subpartidaID=0)
        {
            List<SaldoPresupuesto> subpartidas = new List<SaldoPresupuesto>();

            //string token = "";
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, Utilidades.GetApiRutaUnida($"/saldoPresupuesto/SaldoPresupuestoAsync/{presupuestoAnualDe}/{partidaID}/{grupoID}/{subpartidaID}/")))
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
                            var montoLey = (dynamic)JsonConvert.DeserializeObject(jSon);
                            var saldoDisp = (dynamic)JsonConvert.DeserializeObject(jSon);
                            if (resultData != null)
                            {
                                montoLey = JsonConvert.SerializeObject((dynamic)resultData.montoLey);
                                saldoDisp = JsonConvert.SerializeObject((dynamic)resultData.saldoDisp);
                                resultData = JsonConvert.SerializeObject((dynamic)resultData.data);
                                subpartidas.AddRange(JsonConvert.DeserializeObject<SaldoPresupuesto[]>(resultData));
                                subpartidas[0].GENERAL = new SaldoPresupuestoGeneral()
                                {
                                    montoLey = Convert.ToDecimal((dynamic)montoLey),
                                    saldoDisp = Convert.ToDecimal((dynamic)saldoDisp)
                                };
                            }

                        }
                        else
                        {
                            subpartidas.Add(new SaldoPresupuesto { IsSuccessStatusCode = false, StatusInfo = JsonConvert.SerializeObject(response) });
                        }
                    }
                }
            }

            return subpartidas;

        }

    }
}