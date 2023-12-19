using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PresupuestoSite.Controllers
{
    public class AuthController : Controller
    {
        // GET: Auth
        public ActionResult Autenticacion()
        {
            return View();
        }
    }
}