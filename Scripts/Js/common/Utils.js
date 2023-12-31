﻿/// <reference path="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js" />
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
function fnFechaReporteUltimoDiaMes() {
    var month = parseInt(moment(new Date()).format("MM", "es"));
    var lastDay = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format("DD", "es");
    var monthStr = '';
    var year = moment(new Date()).format("YYYY", "es");
    switch (month) {
        case 1:
            monthStr = 'ENERO';
            break;
        case 2:
            monthStr = 'FEBRERO';
            break;
        case 3:
            monthStr = 'MARZO';
            break;
        case 4:
            monthStr = 'ABRIL';
            break;
        case 5:
            monthStr = 'MAYO';
            break;
        case 6:
            monthStr = 'JUNIO';
            break;
        case 7:
            monthStr = 'JULIO';
            break;
        case 8:
            monthStr = 'AGOSTO';
            break;
        case 9:
            monthStr = 'SEPTIEMBRE';
            break;
        case 10:
            monthStr = 'OCTUBRE';
            break;
        case 11:
            monthStr = 'NOVIEMBRE';
            break;
        case 12:
            monthStr = 'DICIEMBRE';
            break;
        default:
    }
    return `AL ${lastDay} DE ` + monthStr + ' DE ' + year;
}
function GetReportInforme(data,esInforme = true) {
    const vPARTIDA = 'PARTIDA', vGRUPO = 'GRUPO', vSUBPARTIDA = 'SUBPARTIDA';
    var recordInforme = [];
    var partidaIndex = 0;
    var gastoOpMontoLeyTotal = 0;

    if (data.Record.length != undefined) {

        var partidaListado = data.Record.map(item => item.TITULO_PARTIDA)
            .filter((value, index, self) => self.indexOf(value) === index).sort();

        /*Partida*/
        for (var i = 0; i < partidaListado.length; i++) {
            var partidaTitulo = partidaListado[i];
            var montoLey = 0;
            var comprometido = 0;
            var devengado = 0;
            var solicitado = 0;
            var modificaciones = 0;
            var gastoOperativoMontoLey = 0;

            

            /*Grupo*/
            var grupoListado = data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo).map(item => item.TITULO_GRUPO)
                .filter((value, index, self) => self.indexOf(value) === index).sort();

            /*Subpartida*/
            var subPartidaListado = data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo).map(item => item.TITULO_SUBPARTIDA)
                .filter((value, index, self) => self.indexOf(value) === index).sort();
            
            for (var item = 0; item < data.Record.length; item++) {
                var partidaData = data.Record.filter(item => item.TITULO_PARTIDA == partidaTitulo);
                if (data.Record[item].TITULO_PARTIDA == partidaTitulo) {
                    montoLey = + parseFloat(partidaData.reduce((total, obj) => obj.MONTO_DE_LEY + total, 0));
                    comprometido = + parseFloat(partidaData.reduce((total, obj) => obj.COMPROMISO + total, 0));
                    devengado = + parseFloat(partidaData.reduce((total, obj) => obj.DEVENGADO + total, 0));
                    modificaciones = + parseFloat(partidaData.reduce((total, obj) => obj.MODIFICACIONES_MONTO + total, 0));
                }
            }
            
            partidaIndex = partidaIndex + 1;
            recordInforme.push(
                {
                    ID: recordInforme.length,
                    CENTRO_GESTOR: data.Record.find(x => x.TITULO_PARTIDA == partidaTitulo).CENTRO_GESTOR,
                    PARTIDA_SUBPARTIDA: partidaTitulo,
                    PARTIDA_PRINCIPAL: partidaTitulo,
                    FUENTE_FINANCIAMIENTO_FONDO: data.Record.find(x => x.TITULO_PARTIDA == partidaTitulo).FUENTE_FINANCIAMIENTO_FONDO,
                    PRESUPUESTO_INICIAL: montoLey,
                    MODIFICACIONES: modificaciones,
                    PRESUPUESTO_TOTAL: (parseFloat(montoLey) - parseFloat(modificaciones)),
                    PRESUPUESTO_GASTO_OPERATIVO: 0,
                    SOLICITADO: solicitado,
                    COMPROMISO: comprometido,
                    REC_MCIA: 0,
                    COMPROMISO_TOTAL: parseFloat(solicitado) + parseFloat(comprometido),
                    DEVENGADO: devengado,
                    PORCENT_EJECUCION: (devengado == 0 ? 0 : (devengado / parseFloat(montoLey) - parseFloat(modificaciones)) * 100),
                    BGCOLOR: 'bg-orange',
                    TIPO: vPARTIDA,
                    PARTIDA_SEC: partidaIndex

                }
            );
            

            /*Grupo*/
            for (var g = 0; g < grupoListado.length; g++) {
                var grupoTitulo = grupoListado[g];
                montoLey = 0;
                comprometido = 0;
                devengado = 0;
                modificaciones = 0;
                gastoOperativoMontoLey = 0;

                for (var itemGrupo = 0; itemGrupo < data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo).length; itemGrupo++) {
                    if (data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo)[itemGrupo].TITULO_GRUPO == grupoTitulo) {
                        montoLey =  parseFloat(data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo && x.TITULO_GRUPO == grupoTitulo).reduce((total, obj) => obj.MONTO_DE_LEY + total, 0));
                        comprometido = parseFloat(comprometido) + parseFloat(data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo)[itemGrupo].COMPROMISO);
                        devengado = parseFloat(devengado) + parseFloat(data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo)[itemGrupo].DEVENGADO);
                        modificaciones = parseFloat(modificaciones) + parseFloat(data.Record.filter(x => x.TITULO_PARTIDA == partidaTitulo)[itemGrupo].MODIFICACIONES_MONTO);
                    }
                    
                }
                
                recordInforme.push(
                    {
                        ID: recordInforme.length,
                        CENTRO_GESTOR: data.Record.find(x => x.TITULO_PARTIDA == partidaTitulo).CENTRO_GESTOR,
                        PARTIDA_SUBPARTIDA: grupoTitulo,
                        PARTIDA_PRINCIPAL: partidaTitulo,
                        FUENTE_FINANCIAMIENTO_FONDO: data.Record.find(x => x.TITULO_PARTIDA == partidaTitulo).FUENTE_FINANCIAMIENTO_FONDO,
                        PRESUPUESTO_INICIAL: montoLey,
                        MODIFICACIONES: modificaciones,
                        PRESUPUESTO_TOTAL: (parseFloat(montoLey) - parseFloat(modificaciones)),
                        PRESUPUESTO_GASTO_OPERATIVO: 0,
                        SOLICITADO: 0,
                        COMPROMISO: comprometido,
                        REC_MCIA: 0,
                        COMPROMISO_TOTAL: parseFloat(solicitado) + parseFloat(comprometido),
                        DEVENGADO: devengado,
                        PORCENT_EJECUCION: (devengado == 0 ? 0 : (devengado / parseFloat(montoLey) - parseFloat(modificaciones)) * 100),
                        BGCOLOR: 'bg-yellow',
                        TIPO: vGRUPO,
                        PARTIDA_SEC: partidaIndex

                    }
                );
  
                var prevMontoGral = 0, prevCompromisoGral = 0, prevModificacionesGral = 0;
                /*Subpartida*/
                for (var s = 0; s < subPartidaListado.length; s++) {
                    var subpartidaTitulo = subPartidaListado[s];
                    
                    montoLey = 0;
                    comprometido = 0;
                    devengado = 0;
                    modificaciones = 0;

                    for (var item = 0; item < data.Record.length; item++) {
                        
                        var SupartidaData = data.Record.find(x => x.TITULO_PARTIDA == partidaTitulo && x.TITULO_SUBPARTIDA == subpartidaTitulo && x.TITULO_GRUPO == grupoTitulo);
                         
                        if (SupartidaData != undefined) {
                            montoLey = parseFloat(SupartidaData.MONTO_DE_LEY);
                            gastoOperativoMontoLey = parseFloat(SupartidaData.PRESUPUESTO_GASTO_OPERATIVO);
                            comprometido = comprometido = parseFloat(data.Record.filter(x => x.TITULO_SUBPARTIDA == subpartidaTitulo).reduce((total, obj) => obj.COMPROMISO + total, 0));
                            devengado = devengado = parseFloat(data.Record.filter(x => x.TITULO_SUBPARTIDA == subpartidaTitulo).reduce((total, obj) => obj.DEVENGADO + total, 0));
                            modificaciones = modificaciones = parseFloat(data.Record.filter(x => x.TITULO_SUBPARTIDA == subpartidaTitulo).reduce((total, obj) => obj.MODIFICACIONES_MONTO + total, 0));
                        }
                        if (item == data.Record.length - 1) {
                            prevMontoGral = parseFloat(prevMontoGral) + parseFloat(montoLey);
                            prevCompromisoGral = parseFloat(prevCompromisoGral) + parseFloat(comprometido);
                            prevModificacionesGral = parseFloat(prevModificacionesGral) + parseFloat(modificaciones);
                            
                        }
                        
                         
                    }
                    recordInforme.find(x => x.TIPO == vGRUPO && x.PARTIDA_SUBPARTIDA == grupoTitulo).PRESUPUESTO_INICIAL = prevMontoGral;
                    recordInforme.find(x => x.TIPO == vGRUPO && x.PARTIDA_SUBPARTIDA == grupoTitulo).COMPROMISO = prevCompromisoGral;
                    recordInforme.find(x => x.TIPO == vGRUPO && x.PARTIDA_SUBPARTIDA == grupoTitulo).PRESUPUESTO_TOTAL = prevMontoGral;
                    recordInforme.find(x => x.TIPO == vGRUPO && x.PARTIDA_SUBPARTIDA == grupoTitulo).MODIFICACIONES_MONTO = prevModificacionesGral;
                    
                    if (SupartidaData != undefined) {
                        
                        gastoOpMontoLeyTotal = parseFloat(gastoOpMontoLeyTotal) + parseFloat(gastoOperativoMontoLey);

                        recordInforme.push(
                            {
                                ID: recordInforme.length,
                                CENTRO_GESTOR: SupartidaData.CENTRO_GESTOR,
                                PARTIDA_SUBPARTIDA: '&nbsp;&nbsp;&nbsp;' + SupartidaData.TITULO_SUBPARTIDA,
                                PARTIDA_PRINCIPAL: partidaTitulo,
                                FUENTE_FINANCIAMIENTO_FONDO: SupartidaData.FUENTE_FINANCIAMIENTO_FONDO,
                                PRESUPUESTO_INICIAL: montoLey,
                                MODIFICACIONES: modificaciones,
                                PRESUPUESTO_TOTAL: (parseFloat(montoLey) - parseFloat(modificaciones)),
                                PRESUPUESTO_GASTO_OPERATIVO: gastoOperativoMontoLey,
                                SOLICITADO: 0,
                                COMPROMISO: comprometido,
                                REC_MCIA: 0,
                                COMPROMISO_TOTAL: parseFloat(solicitado) + parseFloat(comprometido),
                                DEVENGADO: devengado,
                                PORCENT_EJECUCION: (devengado == 0 ? 0 : (devengado / parseFloat(montoLey) - parseFloat(modificaciones)) * 100),
                                BGCOLOR: '',
                                TIPO: vSUBPARTIDA,
                                PARTIDA_SEC: partidaIndex

                            }
                        );
                    }



                }

            }
            

        }


        /*Total por Grupo*/
        var partidaList = recordInforme.map(item => item.PARTIDA_SEC)
            .filter((value, index, self) => self.indexOf(value) === index);

        for (var ipart = 1; ipart <= partidaList.length; ipart++) {
            
            if (recordInforme.filter(x => x.TIPO == vPARTIDA && x.PARTIDA_SEC == ipart)[0] !== undefined) {    
                
                recordInforme.filter(x => x.TIPO == vPARTIDA && x.PARTIDA_SEC == ipart)[0].PRESUPUESTO_INICIAL = recordInforme.filter(x => x.TIPO == vGRUPO && x.PARTIDA_SEC == ipart).reduce((total, obj) => obj.PRESUPUESTO_INICIAL + total, 0);
                recordInforme.filter(x => x.TIPO == vPARTIDA && x.PARTIDA_SEC == ipart)[0].COMPROMISO = recordInforme.filter(x => x.TIPO == vGRUPO && x.PARTIDA_SEC == ipart).reduce((total, obj) => obj.COMPROMISO_TOTAL + total, 0);
                recordInforme.filter(x => x.TIPO == vPARTIDA && x.PARTIDA_SEC == ipart)[0].PRESUPUESTO_TOTAL = parseFloat(recordInforme.filter(x => x.TIPO == vGRUPO && x.PARTIDA_SEC == ipart).reduce((total, obj) => obj.PRESUPUESTO_INICIAL + total, 0)) - parseFloat(recordInforme.filter(x => x.TIPO == vGRUPO && x.PARTIDA_SEC == ipart).reduce((total, obj) => obj.MODIFICACIONES_MONTO + total, 0));
            }
        }


        /*Total*/
        var generalMontoLey = parseFloat(recordInforme.filter(x => x.TIPO == vGRUPO).reduce((total, obj) => obj.PRESUPUESTO_INICIAL + total, 0));
        var generalComprometido = parseFloat(recordInforme.filter(x => x.TIPO == vGRUPO).reduce((total, obj) => obj.COMPROMISO + total, 0));
        var generalDevengado = parseFloat(recordInforme.filter(x => x.TIPO == vGRUPO).reduce((total, obj) => obj.DEVENGADO + total, 0));
        var generalModificaciones = parseFloat(recordInforme.filter(x => x.TIPO == vGRUPO).reduce((total, obj) => obj.MODIFICACIONES_MONTO + total, 0));
        var generalSolicitado = 0;
        
                 
        recordInforme.push(
            {
                ID: 999996,
                CENTRO_GESTOR: '&nbsp;',
                PARTIDA_SUBPARTIDA: 'TOTAL',
                PARTIDA_PRINCIPAL: '',
                FUENTE_FINANCIAMIENTO_FONDO: '&nbsp;',
                PRESUPUESTO_INICIAL: generalMontoLey,
                MODIFICACIONES: generalModificaciones,
                PRESUPUESTO_TOTAL: (parseFloat(generalMontoLey) - parseFloat(generalModificaciones)),
                PRESUPUESTO_GASTO_OPERATIVO: 0,
                SOLICITADO: 0,
                COMPROMISO: generalComprometido,
                REC_MCIA: 0,
                COMPROMISO_TOTAL: parseFloat(generalSolicitado) + parseFloat(generalComprometido),
                DEVENGADO: generalDevengado,
                PORCENT_EJECUCION: (generalDevengado == 0 ? 0 : (generalDevengado / parseFloat(generalMontoLey) - parseFloat(0)) * 100),
                BGCOLOR: 'bg-primary-title primer-grupo text-white',
                TIPO: 'TOTAL',
                PARTIDA_SEC: partidaIndex

            }
        );
        debugger
        if (esInforme) {
            recordInforme.push(
                {
                    ID: 999997,
                    CENTRO_GESTOR: '',
                    PARTIDA_SUBPARTIDA: '',
                    PARTIDA_PRINCIPAL: '',
                    FUENTE_FINANCIAMIENTO_FONDO: '',
                    PRESUPUESTO_INICIAL: generalMontoLey,
                    MODIFICACIONES: generalModificaciones,
                    PRESUPUESTO_TOTAL: (parseFloat(generalMontoLey) - parseFloat(generalModificaciones)),
                    PRESUPUESTO_GASTO_OPERATIVO: 0,
                    SOLICITADO: 0,
                    COMPROMISO: generalComprometido,
                    REC_MCIA: 0,
                    COMPROMISO_TOTAL: generalComprometido,
                    DEVENGADO: 0,
                    PORCENT_EJECUCION: 0,
                    BGCOLOR: 'bg-white text-white',
                    TIPO: '',
                    PARTIDA_SEC: partidaIndex

                }
            );
            /*GASTO OPERATIVO*/
            recordInforme.push(
                {
                    ID: 999999998,
                    CENTRO_GESTOR: '',
                    PARTIDA_SUBPARTIDA: '',
                    PARTIDA_PRINCIPAL: '',
                    FUENTE_FINANCIAMIENTO_FONDO: '',
                    PRESUPUESTO_INICIAL: null,
                    MODIFICACIONES: null,
                    PRESUPUESTO_TOTAL: gastoOpMontoLeyTotal,
                    PRESUPUESTO_GASTO_OPERATIVO: gastoOpMontoLeyTotal,
                    SOLICITADO: 0,
                    COMPROMISO: generalComprometido,
                    REC_MCIA: 0,
                    COMPROMISO_TOTAL: generalComprometido,
                    DEVENGADO: 0,
                    PORCENT_EJECUCION: 0,
                    BGCOLOR: 'bg-secondary',
                    TIPO: '',
                    PARTIDA_SEC: partidaIndex

                }
            );
        }
        


    }
    
    return recordInforme;
}
function validarFieldTexto(e) {
    var currentValue = e.currentTarget.value.trim();
    var result = true;
    if (currentValue == '' && currentValue.length <= 1) {
        $(e.currentTarget).removeClass("is-valid").addClass("is-invalid");
        $($(e.currentTarget).parent().find('label')).addClass("cs-isrequired-label");
        $($(e.currentTarget).parent().parent().find('label')[0]).addClass("cs-isrequired-label");

        result = false;
    } else {
        $(e.currentTarget).removeClass("is-invalid").addClass("is-valid");
        $($(e.currentTarget).parent().find('label')).removeClass("cs-isrequired-label");
        $($(e.currentTarget).parent().parent().find('label')[0]).removeClass("cs-isrequired-label");
    }
    return result;
         
}
function validarFieldSelectBlinkLabel(controlId) {
    var currentValue = parseInt($('#' + controlId + ' option:selected').val());
    var result = true;
    if (currentValue > 0) {
        $($("#" + controlId).parent().find('label')).removeClass("cs-isrequired-label");
        $("#" + controlId).removeClass("is-invalid").addClass("is-valid");
        result = false;
    }
    else {
        $($("#" + controlId).parent().find('label')).addClass("cs-isrequired-label");
        $("#" + controlId).removeClass("is-valid").addClass("is-invalid");

    }
    return result;

    
}

function CargaSelectOpcions(url, control, opcional= null) {
    CallAjax(url, undefined, "json", function (data) {

        if (data && data.Record) {
            var s = '<option value="-1">-Seleccione-</option>';
            for (var i = 0; i < data.Record.length; i++) {
                s += '<option title="' + data.Record[i].Titulo +'" value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
            }
            $(control).html(s).attr('title', '');


        }
        else {
            toastr.error(data.message);
        }


    }, "GET", true);
}

