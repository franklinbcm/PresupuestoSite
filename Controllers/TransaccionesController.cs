using Microsoft.SqlServer.Server;
using Newtonsoft.Json;
using PresupuestoSite.Common;
using PresupuestoSite.Models;
using PresupuestoSite.Models.Catalogos;
using PresupuestoSite.Models.DTO;
using PresupuestoSite.Models.ViewModel;
using PresupuestoSite.Servicios.Cargas;
using PresupuestoSite.Servicios.Trascacciones;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Controllers
{
    public class TransaccionesController : Controller
    {
        // GET: Transacciones
        private readonly TransaccionesServicio _transacServicio = new TransaccionesServicio();
        private readonly CargasServicio _cargaServicio = new CargasServicio();

        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<JsonResult> GetPresupuestoMontoLeyCuotaPorPres(int presupuestoAnualDe)
        {

            var transacciones = await _transacServicio.GetPresupuestoMontoLeyCuotaPorPres(presupuestoAnualDe);

            return Json(new
            {
                Result = "Ok",
                Record = transacciones,
                Total = transacciones != null ? transacciones.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }
        [HttpGet]
        public async Task<JsonResult> GetListaPartidas()
        {
            var partidas = await _transacServicio.GetPartida();
            if (partidas.Any())
            {
                var data = partidas.Select(i => new SelectListItem()
                {
                    Text = $"{i.CODIGO_PARTIDA} - {i.NOMBRE_PARTIDA}",
                    Value = i.ID.ToString()
                }
                ).Distinct();

                return Json(new
                {
                    Result = "Ok",
                    Record = data,
                    Total = data != null ? data.ToList().Count() : 0,
                }, JsonRequestBehavior.AllowGet);


            }
            else {
                return Json(new
                {
                    Result = "Ok",
                    Record = Utilidades.ListaVacia(),
                    Total =   0,
                }, JsonRequestBehavior.AllowGet);
            }

        }
        [HttpGet]
        public async Task<JsonResult> GetListaGrupo(int partidaID)
        {
            var subpartidas = await _transacServicio.GetGrupo();

            var dataResult = subpartidas.Where(x => x.PARTIDA_ID == partidaID);
            if (dataResult.Any())
            {

                var data = dataResult.Select(i => new SelectListItem()
                {
                    Text = $"{i.CODIGO_GRUPO} - {i.NOMBRE_GRUPO}",
                    Value = i.ID.ToString()
                }
                ).Distinct();

                return Json(new
                {
                    Result = "Ok",
                    Record = data,
                    Total = data != null ? data.ToList().Count() : 0,
                }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new
                {
                    Result = "Ok",
                    Record = Utilidades.ListaVacia(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public async Task<JsonResult> GetListaSubpartida(int grupoID)
        {
            var subpartidas = await _transacServicio.GetSubPartidas();

            var dataResult = subpartidas.Where(x => x.GRUPO_ID == grupoID);
            if (dataResult.Any())
            {

                var data = dataResult.Select(i => new SelectListItem()
                {
                    Text = $"{i.CODIGO_SUBPARTIDA} - {i.NOMBRE_SUBPARTIDA ?? i.ABREV_NOMBRE}",
                    Value = i.ID.ToString()
                }
                ).Distinct();

                return Json(new
                {
                    Result = "Ok",
                    Record = data,
                    Total = data != null ? data.ToList().Count() : 0,
                }, JsonRequestBehavior.AllowGet);

            } else
            {

                return Json(new
                {
                    Result = "Ok",
                    Record = Utilidades.ListaVacia(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);
            }

        }
        [HttpGet]
        public async Task<JsonResult> GetLineasPartidasPorPresupuesto(int presupuestoAnualDe, int partidaID = 0, int grupoID=0, int subpartidaID = 0)
        {
            var partidasDetalles = await _cargaServicio.GetListadoPresupuestoPorAno(presupuestoAnualDe);

            if (partidasDetalles.Any())
            {
                List<ListadoOpcionesModels> partidas = new List<ListadoOpcionesModels>();
                List<ListadoOpcionesModels> grupos = new List<ListadoOpcionesModels>();
                List<ListadoOpcionesModels> subpartidas = new List<ListadoOpcionesModels>();
                List<ListadoOpcionesModels> unidadFisc = new List<ListadoOpcionesModels>();

                foreach (var item in partidasDetalles)
                {
                    if (partidas.Where(x=> x.Value == item.PARTIDA_ID.ToString()).Count() == 0)
                    {
                        partidas.Add(new ListadoOpcionesModels()
                        {
                            Text = $"{item.NOMBRE_PARTIDA}",
                            Value = item.PARTIDA_ID.ToString(),
                        });
                    }
                }
                foreach (var item in partidasDetalles.Where(x => x.PARTIDA_ID == partidaID))
                {
                    if (grupos.Where(x => x.Value == item.GRUPO_ID.ToString()).Count() == 0)
                    {
                        grupos.Add(new ListadoOpcionesModels()
                        {
                            Text = $"{item.CODIGO_GRUPO} - {item.NOMBRE_GRUPO}",
                            Value = item.GRUPO_ID.ToString(),
                        });
                    }
                }
                foreach (var item in partidasDetalles.Where(x => x.GRUPO_ID == grupoID))
                {
                    if (subpartidas.Where(x => x.Value == item.SUBPARTIDA_ID.ToString()).Count() == 0)
                    {
                        subpartidas.Add(new ListadoOpcionesModels()
                        {
                            Text = $"{item.CODIGO_SUBPARTIDA} - {item.NOMBRE_SUBPARTIDA ?? item.ABREV_NOMBRE}",
                            Value = item.SUBPARTIDA_ID.ToString(),
                        });
                    }
                }

                foreach (var item in partidasDetalles.Where(x => x.GRUPO_ID == grupoID && x.SUBPARTIDA_ID == subpartidaID))
                {
                    if (unidadFisc.Where(x => x.Value == item.SUBPARTIDA_ID.ToString()).Count() == 0)
                    {
                        unidadFisc.Add(new ListadoOpcionesModels()
                        {
                            Text = $"{item.CODIGO_SUBPARTIDA} - {item.UNIDAD_FISCALIZADORA}",
                            Value = item.SUBPARTIDA_ID.ToString(),
                            OpcionalData = JsonConvert.SerializeObject(item),
                        });
                    }
                }



                return Json(new
                {
                    Result = "Ok",
                    RecordPartida = partidas,
                    RecordGrupo = grupos,
                    RecordSubpartida = subpartidas,
                    RecordUnidadFiscalizadora = unidadFisc,
                    Total = partidasDetalles != null ? partidasDetalles.ToList().Count() : 0,
                }, JsonRequestBehavior.AllowGet);

            }
            else
            {

                return Json(new
                {
                    Result = "Ok",
                    RecordPartida = new ListadoOpcionesModels(),
                    RecordGrupo = new ListadoOpcionesModels(),
                    RecordSubpartida = new ListadoOpcionesModels(),
                    RecordUnidadFiscalizadora = new ListadoOpcionesModels(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);
            }

        }
        [HttpGet]
        public async Task<JsonResult> GetListaTipoMovimientoPorFiltros(int presupuestoAnualDe,int presupuestoCargadoID, int subpartidaID, string unidadFiscalizadora)
        {
            var presupuestoCargaVM = await _transacServicio.GetListaTipoMovimientoPorFiltros(presupuestoAnualDe, presupuestoCargadoID, subpartidaID, unidadFiscalizadora);

            var dataResult = presupuestoCargaVM;
            if (dataResult.Any())
            {

                var data = dataResult.Select(i => new ListadosVM()
                {
                    Text = $"{i.TIPO_MOVIMIENTO_NOMBRE} - Cuota #{i.ID.ToString()}",
                    Value = i.ID.ToString(),
                    Titulo = i.DETALLES_CUOTA,
                    Opcional = i.TIPO_MOVIMIENTO_ID.ToString(),
                }
                ).Distinct();

                return Json(new
                {
                    Result = "Ok",
                    Record = data,
                    Total = data != null ? data.ToList().Count() : 0,
                }, JsonRequestBehavior.AllowGet);

            }
            else
            {

                return Json(new
                {
                    Result = "Ok",
                    Record = new ListadosVM(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public async Task<JsonResult> GetPresupCuotaUnidadFiscTotalFiltros(int? presupuestoAnualDe, int? partidaID, int? grupoID, int? subpartidaID)
        {

            var cargas = await _transacServicio.GetPresupCuotaUnidadFiscTotalFiltros(presupuestoAnualDe, partidaID, grupoID, subpartidaID);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null ? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }
        [HttpGet]
        public async Task<JsonResult> GetPresupCuotaUnidadFiscIndividual(int presupuestoAnualDe, int subpartidaID)
        {

            var cargas = await _transacServicio.GetPresupCuotaUnidadFiscTotalFiltros(presupuestoAnualDe, 0, 0, 0);
            cargas = cargas.Where(x=>x.SUBPARTIDA_ID == subpartidaID).ToList();

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null ? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }
        [HttpGet]
        public async Task<JsonResult> GetUnidadesFiscalizadoras(int? presupuestoAnualDe, int? presupuestoID)
        {

            var cargas = await _transacServicio.GetUnidadesFiscalizadoras(presupuestoAnualDe, presupuestoID);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null ? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> AgregarUnidadFiscalizadora(UnidadFiscalizadoraDTO unidadFiscalizadora)
        {

            var resunt = await _transacServicio.AddUnidadFiscalizadora(unidadFiscalizadora);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> EditUnidadFiscalizadora(UnidadFiscalizadoraDTO  unidadFiscalizadora)
        {

            var resunt = await _transacServicio.EditUnidadFiscalizadora(unidadFiscalizadora);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpGet]
        public async Task<JsonResult> GetListadoLineaGastoObjeto(int presupuestoAnualDe)
        {

            var cargas = await _transacServicio.GetLineaGastoObjeto(presupuestoAnualDe);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null ? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }
        [HttpGet]
        public async Task<JsonResult> GetListadoMovimientoLineaGastoObjeto(int presupuestoAnualDe)
        {

            var cargas = await _transacServicio.GetListadoMovimientoLineaGastoObjetoVM(presupuestoAnualDe);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null ? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> AgregarLineaGastoOb(LineaGastoObjetoDTO lineaGastoObjetoDTO)
        {

            var resunt = await _transacServicio.AgregarLineaGastoObjeto(lineaGastoObjetoDTO);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> EditarLineaGastoOb(LineaGastoObjetoDTO lineaGastoObjetoDTO)
        {

            var resunt = await _transacServicio.EditarLineaGastoObjeto(lineaGastoObjetoDTO);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }




    }
}