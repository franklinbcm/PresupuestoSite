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
        public async Task<JsonResult> GetLineasPartidasPorPresupuesto(int presupuestoAnualDe, int partidaID, int grupoID, int subpartidaID)
        {
            var partidasDetalles = await _cargaServicio.GetListadoPresupuestoPorAno(presupuestoAnualDe);

            var dataResult = partidasDetalles.Where(x => x.GRUPO_ID == grupoID);
            if (dataResult.Any())
            {

                var data = dataResult.Select(i => new ListadoOpcionesModels()
                {
                    Text = $"{i.CODIGO_SUBPARTIDA} - {i.NOMBRE_SUBPARTIDA ?? i.ABREV_NOMBRE}",
                    Value = i.ID.ToString(),
                    OpcionalData = JsonConvert.SerializeObject(i)
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
                    Record = new ListadoOpcionesModels(),
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


    }
}