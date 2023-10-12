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
	Ckickes();
	
}

function Ckickes() {
	
	$('#btnBack').click((e) => {
		e.preventDefault();
		$(".divOpciones").attr('style', 'display: none');
		$("#divRegresar").show();
		$("#divTransacciones.divOpciones").show();;
		
	})
	$('#btnExit').click((e) => {
		e.preventDefault();
		$(".divOpciones").attr('style', 'display: none');
		$("#divRegresar").show();
		$("#divTransacciones.divOpciones").show();

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
			},300)
		}
	})

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
	$('#inpApropiacion').val(commaSeparateNumber(data.APROPIACION_TOTAL));
	$('#inpDisponibilidad').val(commaSeparateNumber(data.DISPONIBILIDAD));
	$('#inpGrupoDesc').val(`${data.TITULO_NOMBRE_GRUPO.length > 30 ? data.TITULO_NOMBRE_GRUPO.substr(0, 30) + '...' : data.TITULO_NOMBRE_GRUPO}`).attr('title', `${data.TITULO_NOMBRE_GRUPO}`);
	$('#inpSubpartidaDesc').val(`${data.CODIGO_SUBPARTIDA} - ${data.NOMBRE_SUBPARTIDA.length > 40 ? data.NOMBRE_SUBPARTIDA.substr(0, 40) + '...' : data.NOMBRE_SUBPARTIDA}`).attr('title', `${data.CODIGO_SUBPARTIDA} - ${data.NOMBRE_SUBPARTIDA}`);
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
				/*"paging": false,*/
				"zeroRecords": " ",
				lengthMenu: [10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				dom: '<"top"B>, lfrtip',
				buttons: [
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
					{ "data": "NOMBRE_PARTIDA", "width": "15%", className: "dt-custom-column-text text-center" },
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
						"data": "APROPIACION_TOTAL", render: $.fn.dataTable.render.number(',', '.', 2, '')
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
				"zeroRecords": " ",
				lengthMenu: [6, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				dom: '<"top"B>, lfrtip',
				buttons: [
					{
						extend: 'collection',
						className: "btn btn-primary fas fa-plus text-white",
						text: ' Agregar Unidad',
						action:  () => {
							$(".divOpciones").attr('style', 'display: none !important');
							$("#divUnidadFiscalizadora").show();
							$(".is-new-record").attr('style', 'display: none');
							
						}


					},
					{
						extend: 'excelHtml5',
						className: "btn btn-success fa fa-sharp fa-regular fa-file-excel text-white",
						text: ' Excel',
						title: 'Exportar_Presupuesto_' + presupuestoAnualDe,
					},
					/*{ extend: 'edit', editor },*/
				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.PRESUPUESTOS_CARGADOS_ID == item)))}' title="Editar" href="#offcanvasCargas" class="btn btn-sm btn-warning text-white font-size-09" data-bs-toggle="offcanvas" onclick='VerItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
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
						"data": "APROPIACION", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{ "data": "COD_PEDIDOS_RESERVAS", "width": "30%", className: "dt-custom-column-text text-justify" },
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

