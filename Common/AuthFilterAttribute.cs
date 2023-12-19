using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PresupuestoSite.Common
{
    public class AuthFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Comprueba si el usuario está autenticado
            if (filterContext.HttpContext.Session["authenticate"] == null)
            {
                // Redirige al usuario a la página de login
                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary
                    {
                    { "controller", "Account" },
                    { "action", "Login" }
                    });
            }

            base.OnActionExecuting(filterContext);
        }
    }
}