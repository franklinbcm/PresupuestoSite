$(document).ready(function () {
    //toastr.error("Se ha perdido la conexión con el servidor");
    $("#imgLogo").fadeIn(3000);
});


function Validar() {

    swal({
        title: "Esta seguro de borrar?",
        text: "Este contenido no se puede recuperar!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, borrar!",
        closeOnconfirm: true
    }, function () {
            toastr.success("Entro!");
        //$.ajax({
        //    type: 'DELETE',
        //    url: url,
        //    success: function (data) {
        //        if (data.success) {
        //            toastr.success(data.message);
        //            cargarDatatable();
        //        }
        //        else {
        //            toastr.error(data.message);
        //        }
        //    }
        //});
    });

};