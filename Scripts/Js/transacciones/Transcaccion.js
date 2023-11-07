/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitPagina();
});
function onInitPagina() {
	
	$('#sopPresupAn').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear() - 1
	});
	CargarPartida();
	Changes();
	LimpiarTablas();
	cargarTransDatatable();
	Clickes();
	$('.cs-input-text').keypress(function (event) {
		TextCleanInputFormato(event)
	})
	//.on('paste', function (event) {
	//	event.preventDefault();
		
	//})
	.blur((e) => {
		$(e.currentTarget).val($(e.currentTarget).val().replaceAll('--', '-'));
	})
}

function Clickes() {
	
	$('#btnBack').click((e) => {
		e.preventDefault();
		LimpiarNuevaUnidad();
		$(".divOpciones").attr('style', 'display: none');
		$("#h5textHeader").text('MOVIMIENTOS UNIDAD FISCALIZADORA').removeClass("blink text-success text-warning").addClass("text-info");;
		$("#divRegresar").show();
		$("#divTransacciones.divOpciones").show();
		
	})
	$('#btnExit').click((e) => {
		e.preventDefault();
		$(".divOpciones").attr('style', 'display: none');
		$("#h5textHeader").text('MOVIMIENTOS UNIDAD FISCALIZADORA').removeClass("blink text-success text-warning").addClass("text-info");;
		$("#divRegresar").show();
		$("#divTransacciones.divOpciones").show();

	})
	$('#divRegresar').click(() => {
		cargarTransDatatable();
	})
	
}
function Changes() {
	$('#sopPresupAn').change((e) => {
		var curYear = new Date().getFullYear();
		if ($(e.currentTarget).val() < curYear) {
			$(e.currentTarget).val(curYear)
		}
		LimpiarTablas()
		cargarTransDatatable();

	})
	$("#sopPartida").change(() => {
		var partidaID = parseInt($('#sopPartida option:selected').val());
		if (partidaID > 0) {
			Eventos(partidaID);
		} else {
			Eventos(0);
			$('#ckTodo').prop("checked", true);
		}
	})
	$("#sopGrupo").change(() => {
		var grupoID = parseInt($('#sopGrupo option:selected').val());
		/*if (grupoID > 0) {*/
		CargarSubpartida(grupoID)
		LimpiarTablas();
		cargarTransDatatable();
		/*}*/
	})
	$("#sopSubPartida").change(() => {
		LimpiarTablas();
		cargarTransDatatable();
	})
	$('#ckTodo').change(() => {
		if ($('#ckTodo').prop("checked")) {
			$('#sopPartida').val("-1").change();
			setTimeout(() => {
				cargarTransDatatable();
			}, 300)
		}
	});
	$('#sopTipoMovimi').change(() => {

		if ($('#sopTipoMovimi option:selected').val() != -1) {
			$("#lbsopTipoMovimi").removeClass('cs-isrequired-label');
			$('#inpCuotaID').val($('#sopTipoMovimi option:selected').val());
			
		} else {
			$("#lbsopTipoMovimi").addClass('cs-isrequired-label');
			$('#inpCuotaID').val('');
		}
		
		if ($('#sopTipoMovimi option:selected').val() == -1) {
			$('#btnCrear').attr("disabled", true);
			$('#btnEdit').attr("disabled", true);

		} else {
			if ($('#inpCompromisoUni').val().length == 0) {
				$('#btnCrear').attr("disabled", true);
				$('#btnEdit').attr("disabled", true);
			} else {
				$('#btnCrear').attr("disabled", false);
				$('#btnEdit').attr("disabled", false);
			}

		}

	});

}
function Eventos(partidaID) {
	CargarGrupo(partidaID)
	$('#sopSubPartida').val("-1");
	LimpiarTablas()
	cargarTransDatatable();
	$('#ckTodo').prop("checked", false);
}
function VerItem(e) {
	var data = JSON.parse(atob($(e).attr('data-item')));
	fillDataEdit(data);
}
function fillDataEdit(data) {

	/*Span*/
	$('#spCodClasif').text(data.COD_DE_CLASIFICACION);
	$('#spFuente').text(data.FUENTE_FINANCIAMIENTO_FONDO);
	$('#spPeriodo').text(data.PRESUPUESTO_ANUAL_DE);
	$('#spMoneda').text(data.MONEDA.substr(0, 3)).attr('title', data.MONEDA);
	/*Input*/
	$('#inpPartida').val(data.NOMBRE_PARTIDA);
	$('#hfRegID').val(data.PRESUPUESTOS_CARGADOS_ID);
	$('#inpPresupuesto').val(commaSeparateNumber(data.MONTO_DE_LEY));
	$('#inpCuota').val(commaSeparateNumber(data.CUOTA_PRESUPUESTARIA_TOTAL));
	$('#inpCompromiso').val(commaSeparateNumber(data.COMPROMISO_TOTAL));
	$('#inpPresupuestoAct').val(commaSeparateNumber(data.MONTO_DE_LEY));
	$('#inpDisponibilidad').val(commaSeparateNumber(data.DISPONIBILIDAD));
	$('#inpGrupoDesc').val(`${data.TITULO_NOMBRE_GRUPO.length > 30 ? data.TITULO_NOMBRE_GRUPO.substr(0, 30) + '...' : data.TITULO_NOMBRE_GRUPO}`).attr('title', `${data.TITULO_NOMBRE_GRUPO}`);

	$('#inpSubpartidaDesc').val(`${data.CODIGO_SUBPARTIDA} - ${data.NOMBRE_SUBPARTIDA.length > 50 ? data.NOMBRE_SUBPARTIDA.substr(0, 50) + '...' : data.NOMBRE_SUBPARTIDA}`).attr('title', `${data.CODIGO_SUBPARTIDA} - ${data.NOMBRE_SUBPARTIDA}`).attr('data-item', data.SUBPARTIDA_ID);
	$('#inpUnidadFisc').val(data.UNIDAD_FISCALIZADORA);
	
	cargarTransUnidadesDatatable();


}

function CargarPartida() {

	CallAjax("/Transacciones/GetListaPartidas/", undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopPartida").html(s);


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}

function CargarGrupo(partidaID) {

	CallAjax("/Transacciones/GetListaGrupo?partidaID=" + partidaID, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopGrupo").html(s);

			CargarSubpartida(parseInt($('#sopGrupo option:selected').val()));


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function CargarSubpartida(grupoID) {

	CallAjax("/Transacciones/GetListaSubpartida?grupoID=" + grupoID, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopSubPartida").html(s);


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function CargarTipoMovimientoSelected(texto, valor, titulo) {
	
	var s = '<option value="-1">-Seleccione-</option>';
	s += '<option title="' + titulo +'" value="' + valor + '">' + texto + ' - Cuota #' + valor +' </option>';
	$("#sopTipoMovimi").html(s).attr('title', titulo);
	$("#sopTipoMovimi").val(valor).change().prop('disabled', true);
}
function CargarTipoMovimiento(presupuestoAnualDe, presupuestoCargadoID, subpartidaID, unidadFiscalizadora) {

	CallAjax("/Transacciones/GetListaTipoMovimientoPorFiltros?presupuestoAnualDe=" + presupuestoAnualDe + "&presupuestoCargadoID=" + presupuestoCargadoID + "&subpartidaID=" + subpartidaID + "&unidadFiscalizadora=" + unidadFiscalizadora, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option title="' + data.Record[i].Titulo  +'" value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopTipoMovimi").html(s).attr('title', '');
			$("#sopTipoMovimi").prop('disabled', false).change();

		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function LimpiarTablas() {
	$('#tblTransacciones').DataTable().clear().draw();
	$('#tblTransaccionesUnidades').DataTable().clear().draw();
	
}
function cargarTransDatatable() {

	var presupuestoAnualDe = parseInt($("#sopPresupAn").val());
	var partidaID = parseInt($('#sopPartida option:selected').val());
	var grupoID = parseInt($('#sopGrupo  option:selected').val());
	var subpartidaID = parseInt($('#sopSubPartida option:selected').val());

	partidaID = partidaID == NaN || partidaID == -1 ? null : partidaID;
	grupoID = grupoID == NaN || grupoID == -1 ? null : grupoID;
	subpartidaID = subpartidaID == NaN || subpartidaID == -1 ? null : subpartidaID;

	CallAjax(`/Transacciones/GetPresupCuotaUnidadFiscTotalFiltros?presupuestoAnualDe=${presupuestoAnualDe}&partidaID=${partidaID}&grupoID=${grupoID}&subpartidaID=${subpartidaID}`, undefined, "json", function (data) {

		if (data && data.Record) {
				
			$("#tblTransacciones").show();
			dataTable = $("#tblTransacciones").DataTable({
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
						"extend": 'colvis',
						className: "btn btn-info fa fa-sharp fa-regular text-white text-capitalize fa fa-solid fa-columns",
						'text': ' Mostrar/Ocultar',
						"columns": ':not(.noVis)',

					},
					{
						extend: 'excelHtml5',
						className: "btn btn-success fa fa-sharp fa-regular fa-file-excel text-white",
						text: ' Excel',
						title: 'Exportar_Presupuesto_' + presupuestoAnualDe,
					},

				],
				"columns": [
					{
						"data": "PRESUPUESTOS_CARGADOS_ID",
						"render": (item) => {
							/*console.log(data)*/
											/*debugger*/
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.PRESUPUESTOS_CARGADOS_ID == item)))}' title="Ver" href="#offcanvasCargas" class="btn btn-sm btn-info text-white font-size-09" data-bs-toggle="offcanvas" onclick='VerItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-solid fa-eye"></i>
                                </a>
                            </div>
                            `;
						}, "width": "10%"
					},
					{
						"data": "NOMBRE_PARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							 debugger 
							return (

								`<span title="${data.Record.find(x => x.NOMBRE_PARTIDA == item).NOMBRE_PARTIDA}" >${data.Record.find(x => x.NOMBRE_PARTIDA == item).NOMBRE_PARTIDA !== null ? data.Record.find(x => x.NOMBRE_PARTIDA == item).NOMBRE_PARTIDA.length < 22 ? data.Record.find(x => x.NOMBRE_PARTIDA == item).NOMBRE_PARTIDA : data.Record.find(x => x.NOMBRE_PARTIDA == item).NOMBRE_PARTIDA.substr(0, 22) + '...' : null}</span>`
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "TITULO_NOMBRE_GRUPO",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 35 ? item : item.substr(0, 35) + '...' : null)
							);
						}, "width": "30%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "PRESUPUESTOS_CARGADOS_ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (
								
								`<span title="${data.Record.find(x => x.PRESUPUESTOS_CARGADOS_ID == item).NOMBRE_SUBPARTIDA}" >${data.Record.find(x => x.PRESUPUESTOS_CARGADOS_ID == item).CODIGO_SUBPARTIDA}</span>`
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "NOMBRE_SUBPARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null? item.length < 40 ? item : item.substr(0, 40) + '...': null)
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify", visible: false
					},
					{ "data": "UNIDAD_FISCALIZADORA", "width": "12%", className: "dt-custom-column-text text-center" },
					{ "data": "MONEDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "MONTO_DE_LEY", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{
						"data": "CUOTA_PRESUPUESTARIA_TOTAL", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{
						"data": "COMPROMISO_TOTAL", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{
						"data": "DISPONIBILIDAD", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{ "data": "CENTRO_GESTOR", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "COD_DE_CLASIFICACION", "width": "10%", className: "dt-custom-column-text text-center" },
					{ "data": "FUENTE_FINANCIAMIENTO_FONDO", "width": "7%", className: "dt-custom-column-text text-center" },
					{ "data": "PRESUPUESTO_ANUAL_DE", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "PRESUPUESTOS_CARGADOS_ID", "width": "5%", className: "dt-custom-column-text text-center", visible: false },
				],
				"width": "100%"
			});
			

		} else {
			$("#tblTransacciones").hide();
			$("#tblTransacciones").DataTable({
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
function SaldoDisponible() {
	$('#lbinpSaldo').removeClass("badge bg-danger blink");
	var cuotaDisp = $('#inpCuotaTot').val().replaceAll(',', '');
	var actual = $('#inpCompromisoUni').attr('data-item') === undefined ? 0 : $('#inpCompromisoUni').attr('data-item'); //Remover monto cuando es para editar una Unidad Fisc.
	var compromisoDisp = $('#inpCompromisoTot').val().replaceAll(',', '');
	var Disponible = (parseFloat(cuotaDisp) - parseFloat(compromisoDisp - parseFloat(actual))).toFixed(2);
	var currrent = $('#inpCompromisoUni').val().replaceAll(',', '');
	var result = (Disponible - parseFloat(currrent == '' ? 0 : currrent).toFixed(2)).toFixed(2);
	$('#inpSaldo').val(commaSeparateNumber(result));
	
}
function FillDataToEdit(data) {
	
	$('#inpID').val(data.ID);
	$('#inpCuotaID').val(data.CUOTA_ID);
	
	CargarTipoMovimientoSelected(data.TIPO_MOVIMIENTO_NOMBRE, data.CUOTA_ID, data.DETALLES_CUOTA);
	$('#inpCuotaTot').val(commaSeparateNumber($('#inpCuota').val()));
	$('#inpCompromisoTot').val(commaSeparateNumber($('#inpCompromiso').val()));
	$('.cs-Compromiso').val(commaSeparateNumber(data.COMPROMISO)).attr('data-item', data.COMPROMISO).change();
	$('.cs-PresupuestoAct').val($('#inpPresupuesto').val()).change();
	$('#inpCodPedidosReserva').val(data.COD_PEDIDOS_RESERVAS);
	$('#inpFecha').val(ConvertDateJsonToInputDate(data.FECHA));
	$('#taDetalles').val(data.DETALLES);
	$('#inpRegCrePor').val(data.CREADO_POR);
	$('#inpRegCreacionFecha').val(ConvertDateJsonToDate(data.CREADO_EN));
	$('#inpRegModPor').val(data.MODIFICADO_POR);
	$('#inpRegModifFecha').val(ConvertDateJsonToDate(data.MODIFICADO_EN));
	$('#ckEstado').prop("checked", data.ESTATUS_REGISTRO === '1' ? true : false);
	if (data.ES_PEDIDO == true) {
		$('#inpRdoPedidos').prop("checked", true);
	} else {
		$('#inpRdoReservas').prop("checked", true);
	}
	$('#inpTipoMovimi').val(data.TIPO_MOVIMIENTO_NOMBRE);
	SaldoDisponible();
}

function EditarUnidad(e) {
	FillDataToEdit(JSON.parse(atob($(e).attr('data-item'))));
	$(".divOpciones").attr('style', 'display: none !important');
	$("#h5textHeader").text('EDITAR - MOVIMIENTO UNIDAD FISCALIZADORA').removeClass("blink text-success text-info").addClass("text-warning");
	$("#divUnidadFiscalizadora").show();
	$(".is-new-record").attr('style', 'display: block');
	$('#divUnidades .cs-montos').each((idx) => {
		$($('.cs-montos')[idx]).parent().removeClass("has-danger").addClass("has-success");
		$($('.cs-montos')[idx]).removeClass("is-invalid").addClass("is-valid");
	});
	$('#btnEdit').parent().attr('style', 'display: block !important');
	$('#btnCrear').parent().attr('style', 'display: none !important');
	$('#sopTipoMovimi').change();
}
function LimpiarNuevaUnidad() {

	var limpiar = '';
	$(".divOpciones").attr('style', 'display: none !important');
	$("#h5textHeader").text('NUEVO - MOVIMIENTO UNIDAD FISCALIZADORA').removeClass("text-info text-warning").addClass("blink text-success");
	$("#divUnidadFiscalizadora").show();
	$(".is-new-record").attr('style', 'display: none');
	$('#inpCuotaID').val(limpiar);
	$('#inpCuotaTot').val(commaSeparateNumber($('#inpCuota').val()));
	$('#inpCompromisoTot').val(commaSeparateNumber($('#inpCompromiso').val()));
	SaldoDisponible();
	$('#inpID').val('');
	$('.cs-Compromiso').val('').attr('data-item', '0').change();
	$('.cs-PresupuestoAct').val($('#inpPresupuesto').val()).change();
	$('#inpCodPedidosReserva').val(limpiar);
	$('#taDetalles').val(limpiar);
	$('#inpRegCrePor').val(limpiar);
	$('#inpRegCreacionFecha').val(limpiar);
	$('#inpRegModPor').val(limpiar);
	$('#inpRegModifFecha').val(limpiar);
	$('#ckEstado').prop("checked", true);
	$('#inpRdoPedidos').prop("checked", true);
	$('#inpTipoMovimi').val(limpiar);
	CargarTipoMovimiento($('#sopPresupAn').val(), $('#hfRegID').val(), $("#inpSubpartidaDesc").attr('data-item'), $('#inpUnidadFisc').val());
	setDefaultFecha();

	$('#divUnidades .cs-montos').each((idx) => {
		$($('.cs-montos')[idx]).parent().removeClass("has-success").addClass("has-danger");
		$($('.cs-montos')[idx]).removeClass("is-valid").addClass("is-invalid");
	})
	$('#btnCrear').attr("disabled", true).parent().attr('style', 'display: block !important');
	$('#btnEdit').parent().attr('style', 'display: none !important');
}
function cargarTransUnidadesDatatable() {

	var presupuestoAnualDe = parseInt($("#spPeriodo").text());
	var presupuestoID = parseInt($('#hfRegID').val());
	CallAjax(`/Transacciones/GetUnidadesFiscalizadoras?presupuestoAnualDe=${presupuestoAnualDe}&presupuestoID=${presupuestoID}`, undefined, "json", function (data) {

		if (data && data.Record) {
			
			$("#tblTransaccionesUnidades").show();
			dataTable = $("#tblTransaccionesUnidades").DataTable({
				scrollX: true,
				data: data.Record,
				destroy: true,
				searching: true,
				language: LangSpanish,
				colReorder: true,
				responsive: true,
				"paging": false,
				"zeroRecords": " ",
				lengthMenu: [6, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				dom: '<"top"B>, lfrtip',
				buttons: [
					{
						extend: 'collection',
						className: "btn btn-primary fas fa-plus text-white",
						text: ' Agregar Unidad',
						action:  () => {
							LimpiarNuevaUnidad();
							
						}


					},
					{
						"extend": 'colvis',
						className: "btn btn-info fa fa-sharp fa-regular text-white text-capitalize fa fa-solid fa-columns",
						'text': ' Mostrar/Ocultar',
						"columns": ':not(.noVis)',

					},
					{
						extend: 'excelHtml5',
						className: "btn btn-success fa fa-sharp fa-regular fa-file-excel text-white",
						text: ' Excel',
						title: 'Movimientos_Unidad_Fisc_' + presupuestoAnualDe,
					}
					/*{ extend: 'edit', editor },*/
				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar" href="#" class="btn btn-sm btn-warning text-white font-size-09" onclick='EditarUnidad(this);' role="button"  style="cursor:pointer; width:30px;">
                                <i class="far fa-edit"></i>
                                </a>
                            </div>
                            `;
						}, "width": "10%"
					},
					{
						"data": "COMPROMISO", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{
						"data": "ES_PEDIDO",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item == 1 ? 'PEDIDO' : 'RESERVA')
							);
						},
						"width": "40%", className: "dt-custom-column-text text-center"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS}" >${data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS !== null ? data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS.length < 30 ? data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS : data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS.substr(0, 30) + '...' : null}</span>`
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).LINEA}" >${data.Record.find(x => x.ID == item).LINEA !== null ? data.Record.find(x => x.ID == item).LINEA.length < 20 ? data.Record.find(x => x.ID == item).LINEA : data.Record.find(x => x.ID == item).LINEA.substr(0, 20) + '...' : null}</span>`
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).DETALLES}" >${data.Record.find(x => x.ID == item).DETALLES !== null ? data.Record.find(x => x.ID == item).DETALLES.length < 40 ? data.Record.find(x => x.ID == item).DETALLES : data.Record.find(x => x.ID == item).DETALLES.substr(0, 40) + '...' : null  }</span>`
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "FECHA", "render": (item) => {
							return (
								ConvertDateJsonToDateShort(item)
							);
						}, "width": "38%", className: "dt-custom-column-text text-center"
					},
					{ "data": "TIPO_MOVIMIENTO_NOMBRE", "width": "12%", className: "dt-custom-column-text text-justify" },
					{ "data": "CREADO_POR", "width": "8%", className: "dt-custom-column-text text-justify" },
					{
						"data": "CREADO_EN",
						"render": (item) => {
							return (
								ConvertDateJsonToDate(item)
							);
						}, "width": "38%", className: "dt-custom-column-text text-center"
					},
					{ "data": "MODIFICADO_POR", "width": "8%", className: "dt-custom-column-text text-justify" },
					{
						"data": "MODIFICADO_EN", "render": (item) => {
							return (
								ConvertDateJsonToDate(item)
							);
						}, "width": "38%", className: "dt-custom-column-text text-center"
					},
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
					{ "data": "ID", "width": "5%", className: "dt-custom-column-text text-center" },
				],
				"width": "100%"
			});

		} else {
			$("#tblTransaccionesUnidades").hide();
			$("#tblTransaccionesUnidades").DataTable({
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

