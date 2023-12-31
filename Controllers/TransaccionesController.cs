﻿using Microsoft.SqlServer.Server;
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
using System.Web.Util;

namespace PresupuestoSite.Controllers
{
    [AuthFilter]
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

                var data = partidas.Select(i => new ListadosVM()
                {
                    Text = $"{i.CODIGO_PARTIDA} - {i.NOMBRE_PARTIDA}",
                    Value = i.ID.ToString(),
                    Titulo = $"{i.CODIGO_PARTIDA} - {i.NOMBRE_PARTIDA}",
                    Opcional = i.ID.ToString(),
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

                var data = dataResult.Select(i => new ListadosVM()
                {
                    Text = $"{i.CODIGO_GRUPO} - {i.NOMBRE_GRUPO}",
                    Value = i.ID.ToString(),
                    Titulo = $"{i.CODIGO_GRUPO} - {i.NOMBRE_GRUPO}",
                    Opcional = i.ID.ToString(),
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

                var data = dataResult.Select(i => new ListadosVM()
                {
                    Text = $"{i.CODIGO_SUBPARTIDA} - {i.NOMBRE_SUBPARTIDA ?? i.ABREV_NOMBRE}",
                    Value = i.ID.ToString(),
                    Titulo = $"{i.CODIGO_SUBPARTIDA} - {i.NOMBRE_SUBPARTIDA ?? i.ABREV_NOMBRE}",
                    Opcional = i.ID.ToString(),
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
        public async Task<JsonResult> GetListaPresupuestoPorFiltros(int presupuestoAnualDe, int presupuestoID)
        {
            var presupuestoCargaVM =  await _cargaServicio.GetListadoPresupuestoPorAno(presupuestoAnualDe);
            var dataResult = presupuestoCargaVM.Where(x => x.ID == presupuestoID).ToList();
            if (dataResult.Any())
            {
                return Json(new
                {
                    Result = "Ok",
                    Record = dataResult,
                    Total = dataResult != null ? dataResult.Count() : 0,
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    Result = "Ok",
                    Record = new PresupuestoCargaVM(),
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
                List<ListadosVM> partidas = new List<ListadosVM>();
                List<ListadosVM> grupos = new List<ListadosVM>();
                List<ListadosVM> subpartidas = new List<ListadosVM>();
                List<ListadosVM> unidadFisc = new List<ListadosVM>();

                foreach (var item in partidasDetalles)
                {
                    if (partidas.Where(x=> x.Value == item.PARTIDA_ID.ToString()).Count() == 0)
                    {
                        partidas.Add(new ListadosVM()
                        {
                            Text = $"{item.NOMBRE_PARTIDA}",
                            Value = item.PARTIDA_ID.ToString(),
                            Titulo = $"{item.NOMBRE_PARTIDA}",
                            Opcional = item.PARTIDA_ID.ToString(),

                        });
                    }
                }
                foreach (var item in partidasDetalles.Where(x => x.PARTIDA_ID == partidaID))
                {
                    if (grupos.Where(x => x.Value == item.GRUPO_ID.ToString()).Count() == 0)
                    {
                        grupos.Add(new ListadosVM()
                        {
                            Text = $"{item.CODIGO_GRUPO} - {item.NOMBRE_GRUPO}",
                            Value = item.GRUPO_ID.ToString(),
                            Titulo = $"{item.CODIGO_GRUPO} - {item.NOMBRE_GRUPO}",
                            Opcional = item.GRUPO_ID.ToString(),
                        });
                    }
                }
                foreach (var item in partidasDetalles.Where(x => x.GRUPO_ID == grupoID))
                {
                    if (subpartidas.Where(x => x.Value == item.SUBPARTIDA_ID.ToString()).Count() == 0)
                    {
                        subpartidas.Add(new ListadosVM()
                        {
                            Text = $"{item.CODIGO_SUBPARTIDA} - {item.NOMBRE_SUBPARTIDA ?? item.ABREV_NOMBRE}",
                            Value = item.SUBPARTIDA_ID.ToString(),
                            Titulo = $"{item.CODIGO_SUBPARTIDA} - {item.NOMBRE_SUBPARTIDA ?? item.ABREV_NOMBRE}",
                            Opcional = item.SUBPARTIDA_ID.ToString(),
                        });
                    }
                }

                foreach (var item in partidasDetalles.Where(x => x.GRUPO_ID == grupoID && x.SUBPARTIDA_ID == subpartidaID))
                {
                    if (unidadFisc.Where(x => x.Value == item.SUBPARTIDA_ID.ToString()).Count() == 0)
                    {
                        unidadFisc.Add(new ListadosVM()
                        {
                            Text = $"{item.CODIGO_SUBPARTIDA} - {item.UNIDAD_FISCALIZADORA}",
                            Value = item.SUBPARTIDA_ID.ToString(),
                            Titulo = $"{item.CODIGO_SUBPARTIDA} - {item.NOMBRE_SUBPARTIDA ?? item.ABREV_NOMBRE}",
                            Opcional = JsonConvert.SerializeObject(item),
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
                    RecordPartida = new ListadosVM(),
                    RecordGrupo = new ListadosVM(),
                    RecordSubpartida = new ListadosVM(),
                    RecordUnidadFiscalizadora = new ListadosVM(),
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

        [HttpGet]
        public async Task<JsonResult> GetListadoMovimientoPorPresupuestoID(int presupuestoAnualDe, int presupuestoID)
        {

            var cargas = await _transacServicio.GetListadoMovimientoLineaGastoObjetoVM(presupuestoAnualDe);
            var dataResult = cargas.Where(x => x.PRESUPUESTO_ID == presupuestoID);

            if (dataResult.Any())
            {

                var data = dataResult.Select(i => new ListadosVM()
                {
                    Text = $"{i.DESCRIPCION_LINEA_GASTO_OBJETO} - Unidad Fisc. #{i.UNIDAD_FISCALIZADORA}",
                    Value = i.ID.ToString(),
                    Titulo = i.DESCRIPCION_LINEA_GASTO_OBJETO,
                    Opcional = JsonConvert.SerializeObject(i),
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

        [HttpPost]
        public async Task<JsonResult> AgregarLineaGastoObMovimiento(LineaGastoObjetoMovimientoDTO lineaGastoObjetoMovimiento)
        {

            var resunt = await _transacServicio.AgregarLineaGastoObjMovimiento(lineaGastoObjetoMovimiento);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> EditarLineaGastoObMovimiento(LineaGastoObjetoMovimientoDTO lineaGastoObjetoMovimiento)
        {

            var resunt = await _transacServicio.EditarLineaGastoObjMovimiento(lineaGastoObjetoMovimiento);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }


    }
}