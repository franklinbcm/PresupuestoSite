using PresupuestoSite.Common;
using PresupuestoSite.Models;
using PresupuestoSite.Servicios.Reportes;
using PresupuestoSite.Servicios.Trascacciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Controllers
{
    public class ReportesController : Controller
    {
        private readonly ReportesServicio _reportesServicio = new ReportesServicio();
        // GET: Reportes
        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public async Task<JsonResult> GetSubPartidas(int presupuestoAnualDe)
        {
            var dataResult = await _reportesServicio.GetSubPartidas(presupuestoAnualDe);

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
                    Record = Utilidades.ListaVacia(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public async Task<JsonResult> GetSubPartidasPresupuestosCargados(int presupuestoAnualDe, int partidaID, int grupoID, int subpartidaID)
        {
            var dataResult = await _reportesServicio.GetSubPartidasPresupuestosCargados(presupuestoAnualDe, partidaID, grupoID, subpartidaID);

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
                    Record = new SaldoPresupuesto(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);;
            }

        }

    }
}