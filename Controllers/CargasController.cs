using Microsoft.SqlServer.Server;
using PresupuestoSite.Models;
using PresupuestoSite.Models.DTO;
using PresupuestoSite.Servicios.Cargas;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Controllers
{
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
        [HttpPost]
        public ActionResult CargarDocumento(HttpPostedFileBase postedFiles)
        {
            var EvidenceFiles = System.Web.HttpContext.Current.Request.Form["postedFiles"];
      

            _cargasServicio.SetCargarDocumento(postedFiles);

            return Json(new
            {
                Result = "Ok",
            }, JsonRequestBehavior.AllowGet);


        }




    }
}