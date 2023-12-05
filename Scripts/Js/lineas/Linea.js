/// <reference path="../common/utils.js" />
/// <reference path="LineaMovimiento.js" />
$(document).ready(function () {
	onInitPaginaLinea();

});

function onInitPaginaLinea() {

	$('#sopPresupAnLinea').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear() - 1
	});

	$('#inpPresupAnLinea').val($('#sopPresupAnLinea').val());
	LimpiarPasos();
	ClickesLinea();
	ChangesLinea();
	cargarTransLineaObjecDatatable();
}
function PasoUnoAtras() {
	$(".divOpcionesLinea").attr('style', 'display: none !important');
	$("#divLinea").show();
	$("#divPasoIni").show();
	$("#divPasoUnoLinea").hide();
	$("#divPasoDosLinea").hide();
}

function LimpiarPasos() {
	var limpiar = '';
	$('#inpPresupAnLinea').val(limpiar);
	$('#inpCodPresupuestario').val(limpiar);
	$('#inpDescripcion').val(limpiar);
	$('#inpContrato').val(limpiar);
	$('#inpProveedor').val(limpiar);
	$('#inpRegCrePor').val(limpiar);
	$('#inpRegCreacionFecha').val(limpiar);
	$('#inpRegModPor').val(limpiar);
	$('#inpRegModifFecha').val(limpiar);
	$('#inpID').val(limpiar);

	$('#inpPresupAnLineaPasoDos').val(limpiar);
	$('#inpCodPresupuestarioPasoDos').val(limpiar);
	$('#inpDescripcionPasoDos').val(limpiar);
	$('#inpContratoPasoDos').val(limpiar);
	$('#inpProveedorPasoDos').val(limpiar);
	$('#inpRegCrePorPasoDos').val(limpiar);
	$('#inpRegCreacionFecha').val(limpiar);
	$('#inpRegModPor').val(limpiar);
	$('#inpRegModifFecha').val(limpiar);
	$('#inpIDPasoDos').val(limpiar);
	$('.cs-isfield').each((idx) => {
		$($('.cs-isfield')[idx]).val(limpiar);
	});
}
function ExitTodos() {
	$(".divOpcionesLinea").attr('style', 'display: none');
	$("#h5textHeader").text('MOVIMIENTOS UNIDAD FISCALIZADORA').removeClass("blink text-success text-warning").addClass("text-info");;
	$("#divRegresar").show();
	$('#btnpasoBackUno').click();
	$("#divTransacciones.divOpciones").show();
	$("#divMoviGeneral").show();
	$("#offcanvasExampleLabelLinea").attr('style', 'display: none !important');
	$("#offcanvasExampleLabelTitulo").show();
	$("#divPasoIni").show();
	$("#divPasoUnoLinea").hide();
	$("#divPasoDosLinea").hide();

}
function OcultarLinea() {
	$("#divPasoIni").hide();
}
function OcultarLineaMovimiento() {
	$("#divPasoMovimiento").hide();
}
function ClickesLinea() {

	$('#btnAddLinea').click((e) => {
		CargarPartidaLinea();
		LimpiarLinea();
		$("#offcanvasExampleLabelTitulo").attr('style', 'display: none !important');
		$("#offcanvasExampleLabelLinea").show();
		OcultarLineaMovimiento();
		$("#divPasoIni").show();
	})
	
	$('#btnpasoBackUno').click((e) => {
		e.preventDefault();
		PasoUnoAtras();

	})

	
	$('#btnExitPasoUno').click((e) => {
		e.preventDefault();
		ExitTodos();

	})
	$('#btnExitIni').click((e) => {
		e.preventDefault();
		ExitTodos();

	})

	
	$('#btnExitPasoDos').click((e) => {
		e.preventDefault();
		ExitTodos();
		$("#h5textHeader").text('MOVIMIENTOS UNIDAD FISCALIZADORA').removeClass("blink text-success text-warning").addClass("text-info");


	})
	

	$('#btnCrearLineaG').click((e) => {
		e.preventDefault();
		GuardarOActualizarLinea(e)

	});
	$('#btnEditLineaG').click((e) => {
		e.preventDefault();
		GuardarOActualizarLinea(e, false)

	});

	

}
function GuardarOActualizarLinea(e, esCrear = true) {
	var params = {
		"ID": esCrear ? 0 : parseInt($('#inpID').val()),
		"PRESUPUESTO_ANUAL_DE": parseInt($('#inpPresupAnLinea').val()),
		"CODIGO_PRESUPUESTARIO": $('#inpCodPresupuestario').val(),
		"DESCRIPCION": $('#inpDescripcion').val(),
		"CONTRATO": $('#inpContrato').val(),
		"PROVEEDOR": $('#inpProveedor').val(),
		"CREADO_POR": $('#inpUsr').val(),
		"ESTATUS_REGISTRO": $('#ckEstadoLinea').is(":checked") == true ? "1" : "0",
	}

	var titulo = esCrear ? 'creará' : 'actualizará';
	var uriPatch = esCrear ? 'AgregarLineaGastoOb' : 'EditarLineaGastoOb';
	swal({
		title: "¿Esta seguro de Continuar?",
		html: true,
		customClass: 'swal-wide',
		text: `Se ${titulo} la Línea de Gasto Objeto <span class= "fw-bold text-success" > ${params.DESCRIPCION}</span>.`,
		type: "info",
		showCancelButton: true,
		confirmButtonColor: "#3459e6",
		confirmButtonText: "Si, continuar!",
		closeOnconfirm: true
	}, function () {
		CallAjax(`/Transacciones/${uriPatch}`, JSON.stringify(params), "json", function (data) {
			debugger
			if (data && data.Record) {

				if (data.Result == 'Ok') {

					notifyToastr(esCrear ? 'Registro Creado' : 'Registro Actualizado', 'success');
					cargarTransLineaObjecDatatable();
					$('#btnpasoBackUno').click();

				} else {
					toastr.error(data.Record[0].MENSAJE_REQUEST);
				}

			}
			else {
				toastr.error(data.message);
			}


		}, "POST", true);


	});
}
function ChangesLinea() {
	
	$('#sopPresupAnLinea').change((e) => {
		$('#inpPresupAnLinea').val($('#sopPresupAnLinea').val());
		CargarPartidaLinea();
		$("#sopPartidaLinea").change();
	})

	$('#inpPresupAnLineaPasoDos').change((e) => {
		CargarLineas();
		CargarPartidaLinea();
	})
	
	$("#sopPartidaLinea").change(() => {
		CargarGrupoLinea();
	})
	$("#sopGrupoLinea").change(() => {
		CargarSubpartidaLinea();
	})
	$("#sopSubPartidaLinea").change(() => {
		CargarUnidadFiscalizadoraLinea();
	})

	$("#inpCodPresupuestario").change((e) => {
		ValidadorLinea(validarFieldTexto(e));
	})
	$("#inpDescripcion").change((e) => {
		ValidadorLinea(validarFieldTexto(e));
	})
	$("#inpContrato").change((e) => {
		ValidadorLinea(validarFieldTexto(e));

	})
	$("#inpProveedor").change((e) => {
		ValidadorLinea(validarFieldTexto(e));

	})
	
	

}
function ValidadorLinea(esValido) {
	var deshabilitar = false;
	$('#divLineaG .cs-line-gasto').each((idx) => {
		if ($($('#divLineaG .cs-line-gasto')[idx]).hasClass('is-invalid') == true) {
			deshabilitar = true;
		}

	});
	
	var TipoProceso = parseInt($('#inpID').val());
	var controlProceso = '#btnCrearLineaG';

	if (TipoProceso != NaN && TipoProceso > 0) {
		controlProceso = '#btnEditLineaG';
	}
	 
	if (deshabilitar) {
		$(controlProceso).attr("disabled", true);

	} else {
		$(controlProceso).attr("disabled", false);
	}
}

function EventosLinea(partidaID) {
	CargarGrupo(partidaID)
	$('#sopSubPartidaLinea').val("-1");
	//LimpiarTablas()
	//cargarTransDatatable();
}

function GetParametrosPartidas() {
	return {
		presupuestoAnualDe: parseInt($('#sopPresupAnLinea').val()),
		partidaID: parseInt($('#sopPartidaLinea  option:selected').val()) > 0 ? parseInt($('#sopPartidaLinea  option:selected').val()) : 0,
		grupoID: parseInt($('#sopGrupoLinea  option:selected').val()) > 0 ? parseInt($('#sopGrupoLinea  option:selected').val()) : 0,
		subpartidaID: parseInt($('#sopSubPartidaLinea  option:selected').val()) > 0 ? parseInt($('#sopSubPartidaLinea  option:selected').val()) : 0,

	}
}
function CargarPartidaLinea() {
	
	CallAjax("/Transacciones/GetLineasPartidasPorPresupuesto?presupuestoAnualDe=" + GetParametrosPartidas().presupuestoAnualDe + "&partidaID=0&grupoID=0&subpartidaID=0", undefined, "json", function (data) {
		
		if (data && data.RecordPartida
		) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.RecordPartida.length; i++) {
				s += '<option value="' + data.RecordPartida[i].Value + '">' + data.RecordPartida[i].Text + '</option>';
			}
			$("#sopPartidaLinea").html(s);
			

		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function CargarLineas() {
	var presupuestoAnualDe = parseInt($("#inpPresupAnLineaPasoDos").val());
	CallAjax(`/Transacciones/GetListadoLineaGastoObjeto?presupuestoAnualDe=${presupuestoAnualDe}`, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option data-item="' + btoa(JSON.stringify(data.Record[i])) + '" title="' + data.Record[i].DESCRIPCION + ', CÓD. PRESUP.: ' + data.Record[i].CODIGO_PRESUPUESTARIO + ', CONTRATO: ' + data.Record[i].CONTRATO + ', PROVEEDOR: ' + data.Record[i].PROVEEDOR + '"   value="' + data.Record[i].ID + '">' + data.Record[i].DESCRIPCION + ', PROVEEDOR: ' + data.Record[i].PROVEEDOR + '</option>';
			}
			$("#sopLineasActivas").html(s);


			}
		else {
				toastr.error(data.message);
			}

	}, "GET", true);
	
}
function CargarGrupoLinea() {

	CallAjax("/Transacciones/GetLineasPartidasPorPresupuesto?presupuestoAnualDe=" + GetParametrosPartidas().presupuestoAnualDe + "&partidaID=" + GetParametrosPartidas().partidaID + "&grupoID=0&subpartidaID=0", undefined, "json", function (data) {

		if (data && data.RecordGrupo) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.RecordGrupo.length; i++) {
				s += '<option value="' + data.RecordGrupo[i].Value + '">' + data.RecordGrupo[i].Text + '</option>';
			}
			$("#sopGrupoLinea").html(s);
			CargarSubpartidaLinea();


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}

function CargarSubpartidaLinea() {

	CallAjax("/Transacciones/GetLineasPartidasPorPresupuesto?presupuestoAnualDe=" + GetParametrosPartidas().presupuestoAnualDe + "&partidaID=" + GetParametrosPartidas().partidaID + "&grupoID=" + GetParametrosPartidas().grupoID + "&subpartidaID=0", undefined, "json", function (data) {

		if (data && data.RecordSubpartida) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.RecordSubpartida.length; i++) {
				s += '<option value="' + data.RecordSubpartida[i].Value + '">' + data.RecordSubpartida[i].Text + '</option>';
			}
			$("#sopSubPartidaLinea").html(s);
			CargarUnidadFiscalizadoraLinea();

		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}

function CargarUnidadFiscalizadoraLinea() {

	CallAjax("/Transacciones/GetLineasPartidasPorPresupuesto?presupuestoAnualDe=" + GetParametrosPartidas().presupuestoAnualDe + "&partidaID=" + GetParametrosPartidas().partidaID + "&grupoID=" + GetParametrosPartidas().grupoID + "&subpartidaID=" + GetParametrosPartidas().subpartidaID, undefined, "json", function (data) {

		if (data && data.RecordUnidadFiscalizadora) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.RecordUnidadFiscalizadora.length; i++) {
				var items = JSON.parse(data.RecordUnidadFiscalizadora[i].OpcionalData);
				s += '<option data-id="' + items.ID + '" title="' + items.NOMBRE_SUBPARTIDA + ', ' + data.RecordUnidadFiscalizadora[i].Text + '" value="' + data.RecordUnidadFiscalizadora[i].Value + '">' + data.RecordUnidadFiscalizadora[i].Text + '</option>';
			}
			$("#sopUnidadFisLinea").html(s);


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function UsarLinea(linea) {
	var data = JSON.parse(atob($(linea).attr('data-item')));
	LimpiarPasos();
	$('#inpCodPresupuestarioPasoDos').val(data.CODIGO_PRESUPUESTARIO);
	$('#inpDescripcionPasoDos').val(data.DESCRIPCION);
	$('#inpContratoPasoDos').val(data.CONTRATO);
	$('#inpProveedorPasoDos').val(data.PROVEEDOR);
	$('#inpRegCrePorPasoDos').val(data.CREADO_POR);
	$('#inpRegCreacionFecha').val(ConvertDateJsonToDate(data.CREADO_EN));
	$('#inpRegModPor').val(data.MODIFICADO_POR);
	$('#inpRegModifFecha').val(ConvertDateJsonToDate(data.MODIFICADO_EN));
	$('#inpIDPasoDos').val(data.ID);
	$(".is-new-record").attr('style', 'display: none !important');
	$("#divPasoIni").hide();
	$("#divPasoUnoLinea").hide();
	$("#divPasoDosLinea").show();

}

function EditLinea(linea) {
	var data = JSON.parse(atob($(linea).attr('data-item')));
	LimpiarPasos();
	$('#inpPresupAnLinea').val(data.PRESUPUESTO_ANUAL_DE);
	$('#inpCodPresupuestario').val(data.CODIGO_PRESUPUESTARIO);
	$('#inpDescripcion').val(data.DESCRIPCION);
	$('#inpContrato').val(data.CONTRATO);
	$('#inpProveedor').val(data.PROVEEDOR);
	$('#inpRegCrePor').val(data.CREADO_POR);
	$('#inpRegCreacionFecha').val(ConvertDateJsonToDate(data.CREADO_EN));
	$('#inpRegModPor').val(data.MODIFICADO_POR);
	$('#inpRegModifFecha').val(ConvertDateJsonToDate(data.MODIFICADO_EN));
	$('#inpID').val(data.ID);
	$(".is-new-record").attr('style', 'display: block !important');
	$("#btnEditLineaG").attr('style', 'display: block !important');
	$("#btnCrearLineaG").attr('style', 'display: none !important');
	$('#divLineaG .cs-line-gasto').each((idx) => {
		$($('#divLineaG .cs-line-gasto')[idx]).removeClass("is-invalid").addClass("is-valid");
	});
	
	$("#divPasoIni").hide();
	$("#divPasoUnoLinea").show();
	$("#divPasoDosLinea").hide();
	$("#divPasoMovimiento").hide();
}

function GenerarNuevaLinea() {
	LimpiarPasos();
	$(".is-new-record").attr('style', 'display: none !important');
	$('#inpPresupAnLinea').val($('#sopPresupAnLinea').val());
	$("#divPasoIni").hide();
	$("#divPasoUnoLinea").show();
	$("#divPasoDosLinea").hide();
	$("#btnEditLineaG").attr('style', 'display: none !important');
	$("#btnCrearLineaG").attr('style', 'display: block !important');
	$('#btnCrearLineaG').attr("disabled", true);
	$("#h5textHeader").text('NUEVA LÍNEA GASTO OBJETO').removeClass("text-info text-warning").addClass("blink text-success");
	$('#divLineaG .cs-line-gasto').each((idx) => {
		$($('#divLineaG .cs-line-gasto')[idx]).removeClass("is-valid").addClass("is-invalid");
	});
}

function fillPresupuesto() {sopPresupAnLinea
	$('#inpPresupAnLineaPasoDos').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear() - 1
	}).change();
}
function LimpiarLinea() {

	var limpiar = '';
	$(".divOpciones").attr('style', 'display: none !important');
	$("#h5textHeader").text('').removeClass("text-info text-warning").addClass("text-success");
	$("#divLinea").show();
	$(".is-new-record").attr('style', 'display: none');
	$('#inpCuotaID').val(limpiar);
	$('#inpCuotaTot').val(commaSeparateNumber($('#inpCuota').val()));
	$('#inpCompromisoTot').val(commaSeparateNumber($('#inpCompromiso').val()));
	/*	SaldoDisponible();*/
	$('#inpID').val('');
	$('.cs-Compromiso').val('').attr('data-item', '0').change();
	$('.cs-PresupuestoAct').val($('#inpPresupuesto').val()).change();
	$('#inpCodPedidosReserva').val(limpiar);
	$('#taDetalles').val(limpiar);
	$('#inpRegCrePor').val(limpiar);
	$('#inpRegCreacionFecha').val(limpiar);
	$('#inpRegModPor').val(limpiar);
	$('#inpRegModifFecha').val(limpiar);
	$('#ckEstadoLinea').prop("checked", true);
	$('#inpRdoPedidos').prop("checked", true);
	$('#inpTipoMovimi').val(limpiar);
	//CargarTipoMovimiento($('#sopPresupAn').val(), $('#hfRegID').val(), $("#inpSubpartidaDesc").attr('data-item'), $('#inpUnidadFisc').val());
	//setDefaultFecha();

	$('#divUnidades .cs-montos').each((idx) => {
		$($('.cs-montos')[idx]).parent().removeClass("has-success").addClass("has-danger");
		$($('.cs-montos')[idx]).removeClass("is-valid").addClass("is-invalid");
	})
	$('#btnCrear').attr("disabled", true).parent().attr('style', 'display: block !important');
	$('#btnEdit').parent().attr('style', 'display: none !important');
}

function cargarTransLineaObjecDatatable() {

	var presupuestoAnualDe = parseInt($("#sopPresupAnLinea").val());

	CallAjax(`/Transacciones/GetListadoLineaGastoObjeto?presupuestoAnualDe=${presupuestoAnualDe}`, undefined, "json", function (data) {

		if (data && data.Record) {
			
			$("#tblLiniaGastoObjeto").show();
			dataTable = $("#tblLiniaGastoObjeto").DataTable({
				scrollX: true,
				data: data.Record,
				destroy: true,
				searching: true,
				language: LangSpanish,
				colReorder: true,
				responsive: true,
				/*"paging": false,*/
				"zeroRecords": " ",
				lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				dom: '<"top"B>, lfrtip',
				buttons: [
					{
						extend: 'collection',
						className: "btn btn-success fa fa-thin fa-credit-card text-white",
						text: ' Agregar Línea',
						action: () => {
							GenerarNuevaLinea();

						}
					}

				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {

							return `<div class="text-center">
								<a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar Línea"  class="btn btn-sm btn-warning text-white font-size-09"  onclick='EditLinea(this);'  style="cursor:pointer; width:30px;">
									<i class="fa fa-regular fa-pen"></i>
                                </a>
                            </div>
                            `;
						}, "width": "10%"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).CODIGO_PRESUPUESTARIO}" >${data.Record.find(x => x.ID == item).CODIGO_PRESUPUESTARIO}</span>`
							);
						}, "width": "30%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).CONTRATO}" >${data.Record.find(x => x.ID == item).CONTRATO}</span>`
							);
						}, "width": "30%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "DESCRIPCION",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 50 ? item : item.substr(0, 50) + '...' : null)
							);
						}, "width": "50%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "PROVEEDOR",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 50 ? item : item.substr(0, 50) + '...' : null)
							);
						}, "width": "50%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "PRESUPUESTO_ANUAL_DE", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "ESTATUS_REGISTRO",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item == 1 ? 'ACTIVO' : 'INACTIVO')
							);
						},
						"width": "40%", className: "dt-custom-column-text text-center"
					},
					{ "data": "ID", "width": "5%", className: "dt-custom-column-text text-center" }
				],
				"width": "100%"
			});


		} else {
			$("#tblLiniaGastoObjeto").hide();
			$("#tblLiniaGastoObjeto").DataTable({
				destroy: true,
				searching: false,
				language: LangSpanish,
				data: null,
				"bLengthChange": false,
				"bPaginate": false
			});
		}
	}, "GET", true);
}




