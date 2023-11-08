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
        public  ActionResult Index()
        {
          
            return View();
        }


        [HttpGet]
        public async Task<JsonResult> GetSubPartidas(int presupuestoAnualDe)
        {
            var dataResult = await _reportesServicio.GetSubPartidas(presupuestoAnualDe);
            await this.GroupingWithCheckBox();
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
                    Record = new SubpartidaPresupuestoCargado(),
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

        [HttpGet]
        public async Task<JsonResult> GetInformeEjecucion(int presupuestoAnualDe, string subpartidaCodigo)
        {
            var dataResult = await _reportesServicio.GetSubPartidasPresupuestosCargados(presupuestoAnualDe, 0, 0, 0);
            List<SaldoPresupuesto>  saldoPresupuestos = new List<SaldoPresupuesto>();
            var subpartidaListadoCode = subpartidaCodigo.TrimEnd(',').Split(',').OrderBy(i => i).ToList();
            if(subpartidaListadoCode.Count() > 0)
            {
                foreach (var item in subpartidaListadoCode)
                {
                    saldoPresupuestos.AddRange(dataResult.Where(x => x.CODIGO_SUBPARTIDA.Contains(string.IsNullOrEmpty(item) ? x.CODIGO_SUBPARTIDA : item.Trim())).ToList());
                }
            }
            else
            {
                saldoPresupuestos.AddRange(dataResult.Where(x => x.CODIGO_SUBPARTIDA.Contains(string.IsNullOrEmpty(subpartidaCodigo) ? x.CODIGO_SUBPARTIDA : subpartidaCodigo.Trim())).ToList());
            }


            dataResult = saldoPresupuestos;


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
                }, JsonRequestBehavior.AllowGet); ;
            }

        }

        public async Task<ActionResult> GroupingWithCheckBox()
        {
            var dataResult = await _reportesServicio.GetSubPartidas(2023);

            var data = dataResult.Select(i => new SelectListItem()
            {
                Text = $"{i.CODIGO_SUBPARTIDA} - {i.TITULO_SUBPARTIDA}",
                Value = i.SUBPARTIDA_ID.ToString(),
            }
            ).Distinct();
            ViewBag.data = data;
            return View();
        }

    }
}