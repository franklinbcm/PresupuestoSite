using PresupuestoSite.Models;
using PresupuestoSite.Models.DTO;
using PresupuestoSite.Servicios.Cargas;
using System;
using System.Collections.Generic;
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

            Cargas  cargas = new Cargas()
            {
               presupuestoCarga  = new Cargas().presupuestoCarga,
               TiposDocumentos = new Cargas().TiposDocumentos


            };
            
            return View(cargas);
        }
        public JsonResult GetPresupuestos()
        {

            var cargas = _cargasServicio.GetPresupuestoPorAno(2023);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas.ToList().Count()
            }, JsonRequestBehavior.AllowGet);


        }

        public JsonResult GetCuotas()
        {

            var cargas = _cargasServicio.GetCuotaPorAno(2023);

            return Json(new
            {
                Result = "Ok",
                Record = cargas,
                Total = cargas.ToList().Count()
            }, JsonRequestBehavior.AllowGet);


        }




    }
}