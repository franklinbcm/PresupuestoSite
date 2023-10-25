/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitPagina();
});

function onInitPagina() {

	$('#sopPresupAn').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear() - 1
	});
	CargarSubpartida();
	Changes();
	LimpiarCampos();
	LimpiarTablas();

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

	$("#sopSubPartida").change(() => {
		LimpiarCampos();
		LimpiarTablas();
		cargarSaldoPresupuestoDatatable();
	})

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
function LimpiarTablas() {
	$('#tblSaldoPresupuesto').DataTable().clear().draw();

}
function LimpiarCampos() {
	var clearData = '';
	$('#inpPartida').val(clearData);
	$('#inpGrupo').val(clearData);
	$('#inpPresupuestoAct').val(clearData);
	$('#inpSaldoDisponibl').val(clearData);
}

function cargarSaldoPresupuestoDatatable() {

	var presupuestoAnualDe = $('#sopPresupAn').val();
	var subpartidaID = parseInt($('#sopSubPartida option:selected').val());
	var fields = JSON.parse(atob($('#sopSubPartida option:selected').attr('data-item')));
	$('#inpPartida').val(fields.TITULO_PARTIDA);
	$('#inpGrupo').val(fields.TITULO_GRUPO);

	$("#divSaldoPresupuesto").show();
	CallAjax(`/Reportes/GetSubPartidasPresupuestosCargados?presupuestoAnualDe=${presupuestoAnualDe}&partidaID=0&grupoID=0&subpartidaID=${subpartidaID}`, undefined, "json", function (data) {

		if (data && data.Record) {
			
			$('#inpPresupuestoAct').val(data.Record[0] == undefined ? '' : commaSeparateNumber(data.Record[0].GENERAL.montoLey));
			$('#inpSaldoDisponibl').val(data.Record[0] == undefined ? '' : commaSeparateNumber(data.Record[0].GENERAL.saldoDisp));
			$("#tblSaldoPresupuesto").show();
//			var table = $('#tblSaldoPresupuesto').DataTable();

//			table.row
//				.add([{ "ID": 41, "COD_DE_CLASIFICACION": "99", "FUENTE_FINANCIAMIENTO_FONDO": "001-401", "CENTRO_GESTOR": "203-055-00", "PRESUPUESTO_ANUAL_DE": 2023, "PARTIDA_ID": 2, "NOMBRE_PARTIDA": "SERVICIOS", "GRUPO_ID": 1, "NOMBRE_GRUPO": "ALQUILERES", "SUBPARTIDA_ID": 2, "CODIGO_SUBPARTIDA": "E-10104", "NOMBRE_SUBPARTIDA": "ALQUILER DE EQUIPO Y DERECHOS PARA TELECOMUNICACIONES", "ABREV_NOMBRE": null, "TIPO_MONEDA_ID": 1, "CODIGO_MONEDA": "COL", "MONEDA": "COLONES", "APROPIACION": 0, "MONTO_DE_LEY": 33782000.06, "SALDO": 33781979.07, "COMPROMISO": 20.99, "FECHA": "/Date(1697169600000)/", "DETALLES": null, "COD_PEDIDOS_RESERVAS": null, "UNIDAD_FISCALIZADORA": "203-055-02", "GENERAL": { "montoLey": 33782000.06, "saldoDisp": 33781989.29 } }
//				]);	
//debugger
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
						title: 'Saldo_Presupuesto_' + presupuestoAnualDe,
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
						}, "width": "8%", className: "dt-custom-column-text text-justify" },
					{
						"data": "FECHA", "render": (item) => {
							return (
								ConvertDateJsonToDateShort(item)
							);
						}, "width": "10%", className: "dt-custom-column-text text-center"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (
								 
								item != undefined?	`<span title="${data.Record.find(x => x.ID == item).DETALLES}" >${data.Record.find(x => x.ID == item).DETALLES !== null ? data.Record.find(x => x.ID == item).DETALLES.length < 60 ? data.Record.find(x => x.ID == item).DETALLES : data.Record.find(x => x.ID == item).DETALLES.substr(0, 60) + '...' : null}</span>` : null
							);
						}, "width": "55%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS}" >${data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS !== null ? data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS.length < 40 ? data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS : data.Record.find(x => x.ID == item).COD_PEDIDOS_RESERVAS.substr(0, 40) + '...' : null}</span>` : null
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID", render: (item) => {

							return (

								item != undefined ? `<span title="${data.Record.find(x => x.ID == item).UNIDAD_FISCALIZADORA}" >${data.Record.find(x => x.ID == item).UNIDAD_FISCALIZADORA}</span>` : null
							);
						}, "width": "8%", className: "dt-custom-column-text text-center" },



				],
				"width": "100%"
			});


			 
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
