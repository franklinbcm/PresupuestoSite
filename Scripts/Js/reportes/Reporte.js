/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitPagina();
});

function onInitPagina() {

	$('#sopPresupAn').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear() - 1
	});

	CargarSubpartida();
	CargarUnidadFiscalizadora();
	Changes();
	LimpiarCampos();
	LimpiarTablas();
	$("#sopSubPartida").prop('disabled', true);
	$("#sopUnidadFiscRep").prop('disabled', true);
	$(".divSubpartidaCriterio").hide();
	$(".divCentroGestorCriterio").hide();
	$("#btnBuscarCriterio").click(() => {
		EjecucionBusqueda();
	});
	
}

function Changes() {
	$('#sopPresupAn').change((e) => {
		var curYear = new Date().getFullYear();
		if ($(e.currentTarget).val() < curYear) {
			$(e.currentTarget).val(curYear)
		}
		LimpiarTablas()
		cargarSaldoPresupuestoDatatable();

	})
	
	$("#sopReporte").change(() => {
		var reporte = parseInt($('#sopReporte option:selected').val());
		if (reporte != -1) {
			switch (reporte) {
				case 1:
					$("#sopSubPartida").prop('disabled', false);
					$("#sopUnidadFiscRep").prop('disabled', false);
					$("#divInformeEjecucion").hide();
					$("#divEjecucionPresupuestariaCentroTotal").hide();
					$(".divSubpartidaCriterio").hide();
					$(".divCentroGestorCriterio").hide();
					$("#sopSubPartida").show();
					/*$("#sopUnidadFiscRep").show();*/
					$(".divsopSubPartida").show();
					/*$(".divsopUnidadFiscRep").show();*/
					
					break;
				case 2:
					$("#sopSubPartida").prop('disabled', true);
					$("#sopUnidadFiscRep").prop('disabled', false);
					$('#sopSubPartida').val("-1").change();
					$("#sopUnidadFiscRep").val("-1").change();
					$("#sopSubPartida").hide();
					/*$("#sopUnidadFiscRep").hide();*/
					$("#divSaldoPresupuesto").hide();
					$("#divInformeEjecucion").show();
					$("#divEjecucionPresupuestariaCentroTotal").hide();
					$(".divSubpartidaCriterio").show();
					$(".divCentroGestorCriterio").show();
					$(".divsopSubPartida").hide();
					/*$(".divsopUnidadFiscRep").hide();*/
					cargarInformeDatatable();
					break;
				case 3:
					$("#sopSubPartida").prop('disabled', true);
					$("#sopUnidadFiscRep").prop('disabled', false);
					$('#sopSubPartida').val("-1").change();
					$("#sopUnidadFiscRep").val("-1").change();
					$("#sopSubPartida").hide();
					/*$("#sopUnidadFiscRep").hide();*/
					$("#divSaldoPresupuesto").hide();
					$("#divInformeEjecucion").hide();
					$("#divEjecucionPresupuestariaCentroTotal").show();
					$(".divSubpartidaCriterio").show();
					$(".divCentroGestorCriterio").show();
					$(".divsopSubPartida").hide();
					/*$(".divsopUnidadFiscRep").hide();*/
					cargarEjecucionPresupCentroDatatable();
					break;
				default:
					$("#sopSubPartida").prop('disabled', true);
					$("#sopUnidadFiscRep").prop('disabled', true);
					$("#sopSubPartida").show();
					$(".divSubpartidaCriterio").hide();
					$(".divCentroGestorCriterio").hide();
					$(".divsopSubPartida").show();
					/*$(".divsopUnidadFiscRep").show();*/
					break;
            }
			 
			
		} else {
			$("#divSaldoPresupuesto").hide();
			$("#divInformeEjecucion").hide();
			$("#sopSubPartida").prop('disabled', true);
			$('#sopSubPartida').val("-1").change();
			$("#sopUnidadFiscRep").prop('disabled', true);
			$('#sopUnidadFiscRep').val("-1").change();
		}
	})
	$("#sopSubPartida").change(() => {
		LimpiarCampos();
		LimpiarTablas();
		cargarSaldoPresupuestoDatatable();
	})
	$("#sopUnidadFiscRep").change(() => {

		LimpiarCampos();
		LimpiarTablas();
		EjecucionBusqueda();

		
	})

}
function EjecucionBusqueda() {
	var reporte = parseInt($('#sopReporte option:selected').val());
	if (reporte != -1) {
		switch (reporte) {
			case 1:
				cargarSaldoPresupuestoDatatable();
				break;
			case 2:
				cargarInformeDatatable();
				break;
			case 3:
				cargarEjecucionPresupCentroDatatable();
				break;
			default:
				break;
		}
	}
}
function CargarSubpartida() {
	var presupuestoAn = $('#sopPresupAn').val();
	CallAjax(`/Reportes/GetSubPartidas?presupuestoAnualDe=${presupuestoAn}`, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option data-item="' + btoa(JSON.stringify(data.Record[i]))  +'" value="' + data.Record[i].SUBPARTIDA_ID + '">' + data.Record[i].TITULO_SUBPARTIDA + '</option>';
			}
			$("#sopSubPartida").html(s);


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function CargarUnidadFiscalizadora() {

	CallAjax(`/Reportes/UnidadFiscalizadoraListado`, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Todas las Unidades-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option data-item="' + data.Record[i].Opcional +'" value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopUnidadFiscRep").html(s);


		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}
function LimpiarTablas() {
	$('#tblSaldoPresupuesto').DataTable().clear().draw();
	$('#tblInformeEjecucion').DataTable().clear().draw();
	$('#tblEjecucionPresupuestariaCentroTotal').DataTable().clear().draw();

}
function LimpiarCampos() {
	var clearData = '';
	$('#inpPartida').val(clearData);
	$('#inpGrupo').val(clearData);
	$('#inpPresupuestoAct').val(clearData);
	$('#inpSaldoDisponibl').val(clearData);
	$('#inpCentroGestorCriterio').val(clearData)
}

function cargarSaldoPresupuestoDatatable() {

	var presupuestoAnualDe = $('#sopPresupAn').val();
	var subpartidaID = parseInt($('#sopSubPartida option:selected').val());
	var unidadFisc = $('#sopUnidadFiscRep option:selected').attr('data-item') == null ? '' : $('#sopUnidadFiscRep option:selected').attr('data-item');
	var fields = subpartidaID != -1 ? JSON.parse(atob($('#sopSubPartida option:selected').attr('data-item'))) : null;
	$('#inpPartida').val(subpartidaID != -1 ? fields.TITULO_PARTIDA : '');
	$('#inpGrupo').val(subpartidaID != -1 ? fields.TITULO_GRUPO : '');
	$("#divSaldoPresupuesto").show();
	
	CallAjax(`/Reportes/GetSubPartidasPresupuestosCargados?presupuestoAnualDe=${presupuestoAnualDe}&partidaID=0&grupoID=0&subpartidaID=${subpartidaID}&unidadFisc=${unidadFisc}`, undefined, "json", function (data) {

		if (data && data.Record) {
			
			$('#inpPresupuestoAct').val(data.Record[0] == undefined ? '' : commaSeparateNumber(data.Record[0].GENERAL == null ? 0 : data.Record[0].GENERAL.montoLey));
			$('#inpSaldoDisponibl').val(data.Record[0] == undefined ? '' : commaSeparateNumber(data.Record[0].GENERAL == null ? 0 : data.Record[0].GENERAL.saldoDisp));
			$('#hf_fuente').val(data.Record[0] == undefined ? '' : data.Record[0].FUENTE_FINANCIAMIENTO_FONDO);

			fillTitulos(data.Record[0] == undefined ? '' : data.Record[0].GENERAL.montoLey, true, data.Record);
			/*fillTitulos(data.Record[1] == undefined ? '' : data.Record[1].GENERAL.saldoDisp, false, data.Record);*/
			
			if (subpartidaID != -1) {
				$("#divSaldoPresupuesto").show();
				$(".divSaldos").show();
			} else {
				$("#divSaldoPresupuesto").hide();
				$(".divSaldos").hide();
			}

			dataTable = $("#tblSaldoPresupuesto").DataTable({
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
						"extend": 'colvis',
						className: "btn btn-info fa fa-sharp fa-regular text-white text-capitalize fa fa-solid fa-columns",
						'text': ' Mostrar/Ocultar',
						"columns": ':not(.noVis)',

					},
					{
						extend: 'excelHtml5',
						className: "btn btn-success fa fa-sharp fa-regular fa-file-excel text-white",
						text: ' Excel',
						title: 'SALDO PRESUPUESTO ' + presupuestoAnualDe + ', Fuente: ' + $('#hf_fuente').val(),
						messageTop: $('#sopSubPartida option:selected').text(),
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
							$('row b[r^="B"]', sheet).attr('s', '2');
							$('row b[r^="C"]', sheet).attr('s', '2');
							$('row b[r^="D"]', sheet).attr('s', '2');
							$('row:nth-child(1) c', sheet).attr('s', '36');
							$('row:nth-child(2) c', sheet).attr('s', '56');
							$('sheets sheet', xlsx.xl['workbook.xml']).attr('name', subpartidaID != -1 ? fields.CODIGO_SUBPARTIDA : 'Saldo_Presupuesto');
						},
						
					}
					/*{ extend: 'edit', editor },*/
				],
				"columns": [
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).APROPIACION}" >${NumberCommaSeparatedTwoDecimals(data.Record.find(x => x.ID == item).APROPIACION) }</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"
						
					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).COMPROMISO}" >${NumberCommaSeparatedTwoDecimals(data.Record.find(x => x.ID == item).COMPROMISO) }</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"
						
					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).SALDO}" >${NumberCommaSeparatedTwoDecimals(data.Record.find(x => x.ID == item).SALDO) }</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"
						
					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).MONEDA}" >${data.Record.find(x => x.ID == item).MONEDA}</span>` : null
							);
						}, "width": "8%", className: "dt-custom-column-text text-justify", 
					},

					{
						"data": "FECHA", "render": (item) => {
							return (
								ConvertDateJsonToDateShort(item)
							);
						}, "width": "10%", className: "dt-custom-column-text text-center", 
					},
					{
						"data": "ID",
						"render": (item) => {

							return (
								 
								item != undefined?	`<span title="${data.Record.find(x => x.ID == item).DETALLES}" >${data.Record.find(x => x.ID == item).DETALLES !== null ? data.Record.find(x => x.ID == item).DETALLES.length < 60 ? data.Record.find(x => x.ID == item).DETALLES : data.Record.find(x => x.ID == item).DETALLES.substr(0, 60) + '...' : null}</span>` : null
							);
						}, "width": "55%", className: "dt-custom-column-text text-justify",
					},
					{
						"data": "ID",
						"render": (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS}" >${data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS !== null ? data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS.length < 40 ? data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS : data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS.substr(0, 40) + '...' : null}</span>` : null
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify", 
					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).UNIDAD_FISCALIZADORA}" >${data.Record.find(x => x.ID == item).UNIDAD_FISCALIZADORA}</span>` : null
							);
						}, "width": "8%", className: "dt-custom-column-text text-center", 
					},
					{
						"data": "ID",
						"render": (item) => {
							
							return (
								
								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).NOMBRE_UNIDAD_FISCALIZADORA}" >${data.Record.find(x => x.ID == item).NOMBRE_UNIDAD_FISCALIZADORA !== null && data.Record.find(x => x.ID == item).NOMBRE_UNIDAD_FISCALIZADORA != undefined ? data.Record.find(x => x.ID == item).NOMBRE_UNIDAD_FISCALIZADORA.length < 40 ? data.Record.find(x => x.ID == item).NOMBRE_UNIDAD_FISCALIZADORA : data.Record.find(x => x.ID == item).NOMBRE_UNIDAD_FISCALIZADORA.substr(0, 40) + '...' : ''}</span>` : null
							);
						}, "width": "55%", className: "dt-custom-column-text text-justify",
					},



				],
				"width": "100%", ordering: false,
			});

			$($('#tblSaldoPresupuesto tbody tr:first td')[2]).addClass('fw-bold');
			$($('#tblSaldoPresupuesto tbody tr:last td')[2]).addClass('fw-bold');
			 
		} else {
			
			$("#tblSaldoPresupuesto").hide();
			$("#tblSaldoPresupuesto").DataTable({
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

function cargarInformeDatatable() {

	var presupuestoAnualDe = $('#sopPresupAn').val();
	var unidadFisc = $('#sopUnidadFiscRep option:selected').attr('data-item') == null ? '' : $('#sopUnidadFiscRep option:selected').attr('data-item');
	$("#tblInformeEjecucion").show();
	var subpartidaCodigo = $('#inpSubpartidaCriterio').val().trim();
	var centroGestor = $('#inpCentroGestorCriterio').val().trim();
	CallAjax(`/Reportes/GetInformeEjecucion?presupuestoAnualDe=${presupuestoAnualDe}&subpartidaCodigo=${subpartidaCodigo}&unidadFisc=${unidadFisc}&centroGestor=${centroGestor}`, undefined, "json", function (data) {
		
		if (data && data.Record) {
			
			var recordInforme = GetReportInforme(data);
			dataTable = $("#tblInformeEjecucion").DataTable({
				scrollX: true,
				data: recordInforme,
				destroy: true,
				searching: false,
				language: LangSpanish,
				colReorder: true,
				responsive: true,
				"paging": false,
				"zeroRecords": " ",
				"lengthChange": false,
				"bInfo": false,
				lengthMenu: [6, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
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
						title: 'JUNTA ADMINISTRATIVA DE LA DIRECCIÓN GENERAL DE MIGRACIÓN Y EXTRANJERÍA',
						messageTop: `INFORME DE EJECUCIÓN ${fnFechaReporteUltimoDiaMes()}`,
						exportOptions: { orthogonal: 'export' },
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
							/*Titulo Linea 1*/
							$('row:nth-child(1) c', sheet).attr('s', '51');
							/*Titulo Linea 2*/
							$('row:nth-child(2) c', sheet).attr('s', '51');
							$('row:nth-child(3) c', sheet).attr('s', '22');
							/*Primer row de la tabla*/
							$('row b[r^="B"]', sheet).attr('s', '2');
							$('row b[r^="C"]', sheet).attr('s', '2');
							$('row b[r^="D"]', sheet).attr('s', '2');
							/*Ultimo row de la tabla*/
							/*$('row c[r*="10"]', sheet).attr('s', '42');*/
							$('row:last c', sheet).attr('s', '2');
							$('row:last c[r^="D"]', sheet).attr('s', '64');
							$('row:last c[r^="E"]', sheet).attr('s', '64');
							$('row:last c[r^="F"]', sheet).attr('s', '64');
							$('row:last c[r^="G"]', sheet).attr('s', '64');
							$('row:last c[r^="H"]', sheet).attr('s', '64');
							$('row:last c[r^="I"]', sheet).attr('s', '64');
							$('row:last c[r^="J"]', sheet).attr('s', '64');
							$('row:last c[r^="K"]', sheet).attr('s', '64');
							$('row:last c[r^="L"]', sheet).attr('s', '64');
							$('sheets sheet', xlsx.xl['workbook.xml']).attr('name', 'INFORME_EJECUCION');
						},

					}
					/*{ extend: 'edit', editor },*/
				],
				"columns": [
					{
						"data": "ID", render: (item) => {
							
							return (
								
								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).CENTRO_GESTOR}" >${recordInforme.find(x => x.ID == item).CENTRO_GESTOR}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text text-center"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PARTIDA_SUBPARTIDA}" >${recordInforme.find(x => x.ID == item).PARTIDA_SUBPARTIDA}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text text-justify"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).FUENTE_FINANCIAMIENTO_FONDO}" >${recordInforme.find(x => x.ID == item).FUENTE_FINANCIAMIENTO_FONDO}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text text-center"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PRESUPUESTO_INICIAL}" >${recordInforme.find(x => x.ID == item).PRESUPUESTO_INICIAL == null? '' : NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).PRESUPUESTO_INICIAL)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).MODIFICACIONES}" >${recordInforme.find(x => x.ID == item).MODIFICACIONES == null && item == 999999998 ? 'GASTO OPERATIVO' : NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).MODIFICACIONES)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PRESUPUESTO_TOTAL}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).PRESUPUESTO_TOTAL)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).SOLICITADO}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).SOLICITADO)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).COMPROMISO}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).COMPROMISO)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).REC_MCIA}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).REC_MCIA)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).COMPROMISO_TOTAL}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).COMPROMISO_TOTAL)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).DEVENGADO}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).DEVENGADO)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PORCENT_EJECUCION}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).PORCENT_EJECUCION)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},



				],
				"width": "100%", ordering: false,
			});

			$($("#tblInformeEjecucion .bg-orange").parent()).addClass('bg-orange fw-bold');
			$($("#tblInformeEjecucion .bg-yellow").parent()).addClass('bg-yellow fw-bold');
			$($("#tblInformeEjecucion .bg-primary-title").parent()).addClass('bg-primary-title fw-bold text-white');
			$($("#tblInformeEjecucion .bg-secondary").parent()).addClass('bg-secondary fw-bold text-end');
			 

		} else {

			$("#tblInformeEjecucion").hide();
			$("#tblInformeEjecucion").DataTable({
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
function cargarEjecucionPresupCentroDatatable() {

	var presupuestoAnualDe = $('#sopPresupAn').val();
	var unidadFisc = $('#sopUnidadFiscRep option:selected').attr('data-item') == null ? '' : $('#sopUnidadFiscRep option:selected').attr('data-item');
	$("#tblEjecucionPresupuestariaCentroTotal").show();
	var subpartidaCodigo = $('#inpSubpartidaCriterio').val().trim();
	var centroGestor = $('#inpCentroGestorCriterio').val().trim();

	CallAjax(`/Reportes/GetInformeEjecucion?presupuestoAnualDe=${presupuestoAnualDe}&subpartidaCodigo=${subpartidaCodigo}&unidadFisc=${unidadFisc}&centroGestor=${centroGestor}`, undefined, "json", function (data) {

		if (data && data.Record) {

			var recordInforme = GetReportInforme(data, false);
			dataTable = $("#tblEjecucionPresupuestariaCentroTotal").DataTable({
				scrollX: true,
				data: recordInforme,
				destroy: true,
				searching: false,
				language: LangSpanish,
				colReorder: true,
				responsive: true,
				"paging": false,
				"zeroRecords": " ",
				"lengthChange": false,
				"bInfo": false,
				lengthMenu: [6, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
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
						title: 'JUNTA ADMINISTRATIVA DE LA DIRECCIÓN GENERAL DE MIGRACIÓN Y EXTRANJERÍA',
						messageTop: `INFORME DE EJECUCIÓN ${fnFechaReporteUltimoDiaMes()}`,
						exportOptions: { orthogonal: 'export' },
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
							/*Titulo Linea 1*/
							$('row:nth-child(1) c', sheet).attr('s', '51');
							/*Titulo Linea 2*/
							$('row:nth-child(2) c', sheet).attr('s', '51');
							$('row:nth-child(3) c', sheet).attr('s', '22');
							/*Primer row de la tabla*/
							$('row b[r^="B"]', sheet).attr('s', '2');
							$('row b[r^="C"]', sheet).attr('s', '2');
							$('row b[r^="D"]', sheet).attr('s', '2');
							/*Ultimo row de la tabla*/
							/*$('row c[r*="10"]', sheet).attr('s', '42');*/
							$('row:last c', sheet).attr('s', '2');
							$('row:last c[r^="D"]', sheet).attr('s', '64');
							$('row:last c[r^="E"]', sheet).attr('s', '64');
							$('row:last c[r^="F"]', sheet).attr('s', '64');
							$('row:last c[r^="G"]', sheet).attr('s', '64');
							$('row:last c[r^="H"]', sheet).attr('s', '64');
							$('row:last c[r^="I"]', sheet).attr('s', '64');
							$('row:last c[r^="J"]', sheet).attr('s', '64');
							$('row:last c[r^="K"]', sheet).attr('s', '64');
							$('row:last c[r^="L"]', sheet).attr('s', '64');
							$('sheets sheet', xlsx.xl['workbook.xml']).attr('name', 'INFORME_EJECUCION');
						},

					}
					/*{ extend: 'edit', editor },*/
				],
				"columns": [
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).CENTRO_GESTOR}" >${recordInforme.find(x => x.ID == item).CENTRO_GESTOR}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text text-center"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PARTIDA_SUBPARTIDA}" >${recordInforme.find(x => x.ID == item).PARTIDA_SUBPARTIDA}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text text-justify"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PRESUPUESTO_INICIAL}" >${recordInforme.find(x => x.ID == item).PRESUPUESTO_INICIAL == null ? '' : NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).PRESUPUESTO_INICIAL)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).MODIFICACIONES}" >${recordInforme.find(x => x.ID == item).MODIFICACIONES == null && item == 999999998 ? 'GASTO OPERATIVO' : NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).MODIFICACIONES)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PRESUPUESTO_TOTAL}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).PRESUPUESTO_TOTAL)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).SOLICITADO}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).SOLICITADO)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).COMPROMISO}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).COMPROMISO)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).REC_MCIA}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).REC_MCIA)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).COMPROMISO_TOTAL}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).COMPROMISO_TOTAL)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).DEVENGADO}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).DEVENGADO)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span class="${recordInforme.find(x => x.ID == item).BGCOLOR}" title="${recordInforme.find(x => x.ID == item).PORCENT_EJECUCION}" >${NumberCommaSeparatedTwoDecimals(recordInforme.find(x => x.ID == item).PORCENT_EJECUCION)}</span>` : null
							);
						}
						, "width": "10%"
						, className: "dt-custom-column-text"

					},



				],
				"width": "100%", ordering: false,
			});

			$($("#tblEjecucionPresupuestariaCentroTotal .bg-orange").parent()).addClass('bg-orange fw-bold');
			$($("#tblEjecucionPresupuestariaCentroTotal .bg-yellow").parent()).addClass('bg-yellow fw-bold');
			$($("#tblEjecucionPresupuestariaCentroTotal .bg-primary-title").parent()).addClass('bg-primary-title fw-bold text-white');
			$($("#tblEjecucionPresupuestariaCentroTotal .bg-secondary").parent()).addClass('bg-secondary fw-bold text-end');

			/*Colocar Color Verde en el pie de pagina para Presupuestos*/
			var vPiePagina = $($("#tblEjecucionPresupuestariaCentroTotal span[title='TOTAL']").parent().parent()).find('.primer-grupo');
			$($(vPiePagina).parent()).removeClass('bg-primary-title').addClass('cs-ejecucion-pie-pagina');
			$(vPiePagina).removeClass('bg-primary-title primer-grupo').addClass('cs-ejecucion-pie-pagina');
			$(vPiePagina).each((idx, item) => {
				if (idx >= 2 && idx <= 4) {
					$(item).removeClass('bg-primary-title').addClass('primer-grupo');
					$($(item).parent()).removeClass('bg-primary-title').addClass('primer-grupo');

				}
				if (idx >= 5 && idx <= 7) {
					$(item).removeClass('bg-primary-title').addClass('secundario-grupo');
					$($(item).parent()).removeClass('bg-primary-title').addClass('secundario-grupo');

				}
			});
			

		} else {

			$("#tblEjecucionPresupuestariaCentroTotal").hide();
			$("#tblEjecucionPresupuestariaCentroTotal").DataTable({
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
function fillTitulos(saldo, isHead = true, Record) {
	if (saldo != '') {
		var Params =
		{
			"ID": isHead ? 0 : 999999999999999999,
			"COD_DE_CLASIFICACION": "",
			"FUENTE_FINANCIAMIENTO_FONDO": "",
			"CENTRO_GESTOR": "",
			"PRESUPUESTO_ANUAL_DE": null,
			"PARTIDA_ID": null,
			"NOMBRE_PARTIDA": "",
			"GRUPO_ID": 1,
			"NOMBRE_GRUPO": "",
			"SUBPARTIDA_ID": 2,
			"CODIGO_SUBPARTIDA": "",
			"NOMBRE_SUBPARTIDA": "",
			"ABREV_NOMBRE": null,
			"TIPO_MONEDA_ID": null,
			"CODIGO_MONEDA": "",
			"MONEDA": "",
			"APROPIACION": 0,
			"MONTO_DE_LEY": 0,
			"SALDO": saldo,
			"COMPROMISO": 0,
			"FECHA": null,
			"DETALLES": "",
			"COD_PEDIDOS_RESERVAS": "",
			"UNIDAD_FISCALIZADORA": "",
			"GENERAL": {
				"montoLey": null,
				"saldoDisp": null
			}
		}

		if (isHead) {
			Record.unshift(Params);
		} else {
			Record.push(Params);
		}
	}
	


}
