/// <reference path="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js" />
var divLoading = '<div class="loading2" > </div> ';
var divImageLoaging = '<div id="loading2Image" class="Loading" style="display:none; z-index:9999999" <iframe src="about:blank"  style="border:none; top:0; left:0; height:100%; width:100%; z-index:-1; position:absolute;" /></div>  ';
var BeginRequestHandler = function (sender, args) {
    $("body").append(divLoading);
    $("body").append(divImageLoaging);
    $("#loading2Image").css("display", "block");
};
var EndRequestHandler = function (sender, args) {
    $("#loading2Image , .loading2").remove();
};
var ShowLoading = function () {
    BeginRequestHandler();
};
var HideLoading = function () {
    EndRequestHandler();
};
var LangSpanish = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún registro disponible!",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};
var CallAjax = function (vUrl, vParameter, vDataType, vSucess, RequestType, isAsync) {
    $.ajax({
        type: RequestType,
        url: vUrl,
        data: vParameter !== undefined ? vParameter : {},
        contentType: "application/json; charset=utf-8",
        dataType: vDataType,
        success: vSucess,
        async: isAsync !== undefined ? isAsync : true,
        beforeSend: function () {
            ShowLoading();
        },
        error: function (data) {
            if (data.status === 0) {
                toastr.error("Se ha perdido la conexión con el servidor");
                return false;
            }
            if (data.status !== 200) {
                console.log("Url:" + vUrl);
                console.log((vParameter !== undefined ? "Param:" + vParameter : {}));
                if (data !== undefined && data.responseXML !== undefined)
                    toastr.error("<span>" + vUrl + "</span>" + data.responseXML);
                else
                    toastr.error("<span>" + vUrl + "</span>" + data.responseText);
            }
        }
    }).always(function () {
        HideLoading();
    });
};

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }

    return val;
}
function Delete(url) {
    swal({
        title: "Esta seguro de borrar?",
        text: "Este contenido no se puede recuperar!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, borrar!",
        closeOnconfirm: true
    }, function () {
        $.ajax({
            type: 'DELETE',
            url: url,
            success: function (data) {
                if (data.success) {
                    toastr.success(data.message);
                    cargarDatatable();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}

function ConvertDateJsonToDate(stringDate) {
    if (stringDate !== null && stringDate != undefined) {
        var data = new Date(parseInt(stringDate.replace('/Date(', '')));
        return moment(new Date(data)).format("DD/MM/YYYY hh:mm:ss A");
    }
    else {
        return null;
    }
        
}
