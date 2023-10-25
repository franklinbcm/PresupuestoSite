/// <reference path="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js" />
var divLoading = '<div class="loading2 container-fluid px-5 blink" ><span><i class="fas fa-spinner fa-pulse"></i>&nbsp;Cargando...</span></div> ';
var divImageLoaging = '<div id="loading2Image" class="Loading" style="display:none; z-index:9999999" <iframe src="about:blank"  style="border:none; top:0; left:0; height:100%; width:100%; z-index:-1; position:absolute;" /></div>  ';
var BeginRequestHandler = function (sender, args) {
    $("body footer").prepend(divLoading);
    $("body footer").prepend(divImageLoaging);
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
    
    HideLoading();
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
                notifyToastr("Se ha perdido la conexión con el servidor", 'error');
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
var CallAjaxFiles = function (vUrl, vParameter, vDataType, vSucess, RequestType, isAsync) {

    $.ajax({

        type: RequestType,
        url: vUrl,
        data: vParameter !== undefined ? vParameter : {},
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: vDataType,
       /*< !--use this options for upload files-- >*/
        cache: false,
        contentType: false,
        processData: false,
		/*<!--end use this options for upload files-- >*/
        success: vSucess,
            async: isAsync !== undefined ? isAsync : true,
                beforeSend: function () {
                    ShowLoading();
                },
    error: function (data) {
        if (data.status === 0) {
            console.log(data);

            notifyToastr("Se ha perdido la conexión con el servidor", 'error');
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

var GetPartialView = function (vUrl, vParameter, vSucess, isAsync) {
    CallAjax(vUrl, vParameter, "html", vSucess, "POST", (isAsync === undefined ? true : isAsync));
};
var CallRedirectUrlTo = function (url, param) {
    var vUrl = (param !== undefined ? url + param : url);
    window.location.href = vUrl;
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
                    notifyToastr(data.message, 'success');
                    cargarDatatable();
                }
                else {
                    notifyToastr(data.message, 'error');
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
function ConvertDateJsonToDateShort(stringDate) {
    if (stringDate !== null && stringDate != undefined) {
        var data = new Date(parseInt(stringDate.replace('/Date(', '')));
        return moment(new Date(data)).format("DD/MM/YYYY");
    }
    else {
        return null;
    }

}
function NumberCommaSeparatedTwoDecimals(number) {
    const fixedNumber = Number.parseFloat(number).toFixed(2);
    return String(fixedNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}
function ConvertDateJsonToInputDate(stringDate) {
    if (stringDate !== null && stringDate != undefined) {
        var data = new Date(parseInt(stringDate.replace('/Date(', '')));
        return moment(new Date(data)).format("YYYY-MM-DD");
    }
    else {
        return null;
    }

}
function isNumberKey(evt) {

    console.log(evt.value);
    if ((evt.which != 46 || evt.value.indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
        //event it's fine

    }
    var input = evt.value;
    if ((input.indexOf('.') != -1) && (input.substring(input.indexOf('.')).length > 2)) {
        return false;
    }
}

jQuery.fn.ForceNumericOnly =
    function () {
        return this.each(function () {
            $(this).keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
                // home, end, period, and numpad decimal
                return (
                    key == 8 ||
                    key == 9 ||
                    key == 13 ||
                    key == 46 ||
                    key == 110 ||
                    key == 190 ||
                    (key >= 35 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105));
            });
        });
    };

function notifyToastr(msg, type) {
    toastr.clear();
    toastr.options = {
        "closeButton": true,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    switch (type) {
        case 'success':
            toastr[type](`<div class="mb-3 mt-3">
                      <div>
                        <h5 class='blink'>${msg}</h5>
                      </div>
                    </div>`);
            break;
        case 'info':
            toastr[type](`<div class="mb-3 mt-3">
                      <div>
                        <h5 class='blink'>${msg}</h5>
                      </div>
                    </div>`);
            break;
        case 'warning':
            toastr[type](`<div class="mb-3 mt-3">
                      <div>
                        <h5 class='blink'>${msg}</h5>
                      </div>
                    </div>`);
            break;
        case 'error':
            toastr[type](`<div class="mb-3 mt-3">
                      <div>
                        <h5 class='blink'>${msg}</h5>
                      </div>
                    </div>`);
            break;
        default:
            toastr["info"](`<div class="mb-4 mt-4">
                      <div>
                        <h5 class='blink'>${msg}</h5>
                      </div>
                    </div>`);
            break;
    }
     


    //var $notifyContainer = jQuery(notify).closest('.toast-top-full-width');
    //if ($notifyContainer) {
    //    // align center
    //    var containerWidth = jQuery(notify).width() + 20;
    //    $notifyContainer.css("margin-left", -containerWidth / 2);
    //}
}
/*Numeric Format with two decimals*/
function TransaccionesFormato(event, id) {
    if ((event.which != 46 || $(id).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        if ((event.which != 45 || $(id).val().indexOf('-') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    }
}
function TextCleanInputFormato(e) {  // Accept only alpha numerics, no special characters 
    
    var regex = new RegExp("^[a-zA-Z0-9 ñáéíóúÑÁÉÍÓÚ,#$:;*& \d\*\/\.\|\-\]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

    if (regex.test(str)) {

        if ($(e.currentTarget).val().indexOf('--') != -1) {
            $(e.currentTarget).val($(e.currentTarget).val().replaceAll('--', '-'));
        }
        return true;
    }

    e.preventDefault();
    return false;
}

