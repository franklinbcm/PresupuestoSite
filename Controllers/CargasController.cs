using Microsoft.SqlServer.Server;
using Newtonsoft.Json;
using PresupuestoSite.Common;
using PresupuestoSite.Models;
using PresupuestoSite.Models.DTO;
using PresupuestoSite.Models.ViewModel;
using PresupuestoSite.Servicios.Cargas;
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
    [AuthFilter]
    public class CargasController : Controller
    {
        // GET: Cargas
        private readonly CargasServicio _cargasServicio = new CargasServicio();
        public ActionResult Index()
        {
            ViewBag.Api = ConfigurationManager.AppSettings["PresupuestoApi"];
            Cargas  cargas = new Cargas()
            {
               presupuestoCarga  = new Cargas().presupuestoCarga,
               TiposDocumentos = new Cargas().TiposDocumentos


            };
            
            return View(cargas);
        }
        [HttpGet]
        public JsonResult GetPresupuestos(int presupuestoAnualDe)
        {

            var cargas = _cargasServicio.GetPresupuestoPorAno(presupuestoAnualDe);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpGet]
        public JsonResult GetCuotas(int presupuestoAnualDe)
        {

            var cargas = _cargasServicio.GetCuotaPorAno(presupuestoAnualDe);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas != null ? cargas.ToList().Count() : 0,
            }, JsonRequestBehavior.AllowGet);


        }
        //[HttpPost]
        //public ActionResult CargarDocumento(HttpPostedFileBase postedFiles)
        //{
        //    var EvidenceFiles = System.Web.HttpContext.Current.Request.Form["postedFiles"];
      

        //    _cargasServicio.SetCargarDocumento(postedFiles);

        //    return Json(new
        //    {
        //        Result = "Ok",
        //    }, JsonRequestBehavior.AllowGet);


        //}
        [HttpPost]
        public async Task<JsonResult> EditPresupuestoPorId(PresupuestoCargaDTO presupuestoCarga)
        {
            
            var resunt = await  _cargasServicio.SetPresupuestoPorId(presupuestoCarga);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> RemovePresupuestoPorId(PresupuestoYCuotaRemovDTO presupuestoCarga)
        {

            var resunt = await _cargasServicio.SetRemovePresupuestoPorId(presupuestoCarga);
            return Json(new
            {
                Result = resunt == true? "Ok" : "Fail",
                Record = resunt,
            }, JsonRequestBehavior.AllowGet);


        }

        //}
        [HttpPost]
        public async Task<JsonResult> EditPresupuestoCuotaPorId(PresupuestoCuotaCargaDTO presupuestoCarga)
        {

            var resunt = await _cargasServicio.SetPresupuestoCuotaPorId(presupuestoCarga);
            return Json(new
            {
                Result = "Ok",
                Record = resunt,
                Total = resunt != null ? 1 : 0,
            }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public async Task<JsonResult> RemovePresupuestoCuotaPorId(PresupuestoYCuotaRemovDTO presupuestoCarga)
        {

            var resunt = await _cargasServicio.SetRemovePresupuestoCuotaPorId(presupuestoCarga);
            return Json(new
            {
                Result = resunt == true ? "Ok" : "Fail",
                Record = resunt,
            }, JsonRequestBehavior.AllowGet);


        }
        [HttpGet]
        public async Task<JsonResult> GetListaTipoMovimiento(bool esCarga)
        {
            var dataResult = await _cargasServicio.GetTipoPresupuesto();
            dataResult = dataResult.Where(x => x.ES_CARGA == esCarga).ToList();

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
                    Record = new TipoMovimiento(),
                    Total = 0,
                }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public async Task<JsonResult> GetListaTrimestre()
        {
            var dataResult = await _cargasServicio.GetTrimestreTodo();
            dataResult = dataResult.ToList();

            if (dataResult.Any())
            {

                var data = dataResult.Select(i => new ListadosVM()
                {
                    Text = $"{i.NOMBRE_TRIMESTRE}",
                    Value = i.CODIGO.ToString(),
                    Titulo = i.NOMBRE_TRIMESTRE,
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



    }
}