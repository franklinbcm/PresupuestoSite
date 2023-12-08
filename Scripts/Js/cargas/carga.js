/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitPagina();
});

function onInitPagina() {
	$('#inpApiUri').val($('#inpApiBase').val() + '/presupuesto/agregar');
	$('#aPresuFormato').attr("href", $('#inpApiBase').val().split('/api/')[0] + '/PresupuestoFormato/FormatoCargaPresupuestoDGME.xlsx');
	$('#aCuotaFormato').attr("href", $('#inpApiBase').val().split('/api/')[0] + '/PresupuestoFormato/FormatoCuotaCargaPresupuestoDGME.xlsx');
	CargasInit();
	TipoMovimiento();
	PresupuestoInit();
	Trimestre();

	$("input[name='btnradioCarga']").each(function () {
		$(this).change((e) => {
			btnRdoCuota(e);
		})


	});
	$("input[name='docTypeRadio']").each(function () {
		$(this).change((e) => {
			if (e.currentTarget.id.includes('Presupuesto')) {
				$('#inpApiUri').val($('#inpApiBase').val() + '/presupuesto/agregar');
				TipoMovimiento();

			} else {
				$('#inpApiUri').val($('#inpApiBase').val() + '/presupuestoCuota/agregar');
				TipoMovimiento();

			}
		})

	});
	$("input[name='btnradioCarga']").each(function () {
		$(this).change((e) => {
			if (e.currentTarget.id.includes('Presupuesto')) {
				$('#inpApiUri').val($('#inpApiBase').val() + '/presupuesto/agregar');

			} else if (e.currentTarget.id.includes('Cuota')) {
				$('#inpApiUri').val($('#inpApiBase').val() + '/presupuestoCuota/agregar');

			} else {
				if ($('#ckPresupuesto').prop("checked")) {
					$('#inpApiUri').val($('#inpApiBase').val() + '/presupuesto/agregar');
				} else {
					$('#inpApiUri').val($('#inpApiBase').val() + '/presupuestoCuota/agregar');
				}
			}
		})

	});
	$('#btnEditPresupuesto').click(() => {
		UpdateEditar();
	});

	$("#btnUpload").on("click", function (event) {
		event.preventDefault();
		CargarDocumento();
	});


}
function CargasInit() {
	$('#spLoadFile').click(() => {
		$("#postedFiles").click();
	})
	$("#postedFiles").change(() => {
		if ($('#postedFiles')[0].files.length > 0 && $('#sopTipoMovimiento option:selected').val() != -1 && $('#sopTrimestre option:selected').val() != -1 ) {
			$("#btnUpload").attr("disabled", false);
			
		} else {
			$("#btnUpload").attr("disabled", true);
		}

	});
	$('#sopTipoMovimiento').change(() => {
		
		if ($('#postedFiles')[0].files.length > 0 && $('#sopTipoMovimiento option:selected').val() != -1) {
			$("#btnUpload").attr("disabled", false);
			
		} else {
				$("#btnUpload").attr("disabled", true);
			
		}
		if ($('#sopTipoMovimiento option:selected').val() != -1) {
			$("#lbsopTipoPresupuesto").removeClass('cs-isrequired-label');
		} else {
			$("#lbsopTipoPresupuesto").addClass('cs-isrequired-label');
		}
		$('#sopTipoMovimiento').attr('title', $("#sopTipoMovimiento  option:selected").text() + ' - ' + $("#sopTipoMovimiento  option:selected").attr('title'));

	});
	$('#sopTrimestre').change(() => {

		if ($('#postedFiles')[0].files.length > 0 && $('#sopTipoMovimiento option:selected').val() != -1 && $('#sopTrimestre option:selected').val() != -1) {
			$("#btnUpload").attr("disabled", false);

		} else {
			$("#btnUpload").attr("disabled", true);

		}
		if ($('#sopTrimestre option:selected').val() != -1) {
			$("#lbsopTrimestre").removeClass('cs-isrequired-label');
		} else {
			$("#lbsopTrimestre").addClass('cs-isrequired-label');
		}
		$('#sopTrimestre').attr('title', $("#sopTrimestre  option:selected").text());

	});
}
function PresupuestoInit() {
	$('#inpPresupAn').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear() - 1
	});

	$('#inpPresupAn').change((e) => {
		var curYear = new Date().getFullYear();
		if ($(e.currentTarget).val() < curYear) {
			$(e.currentTarget).val(curYear)
		}
		/*Presupuesto*/
		if ($($("input[name='btnradioCarga']")[1]).prop("checked"))
			cargarPresupuestoDatatable();

		/*Cuota*/
		if ($($("input[name='btnradioCarga']")[2]).prop("checked"))
			cargarCuotaDatatable();

	})
	function FormatNumber(event) {
		var dec = $(this).data('decimal');
		var aux = "([+-]?[0-9])([0-9]{" + dec + "})$";
		var expReg = new RegExp(aux);
		$(event.target).val(function (index, value) {
			return value.replace(/\D/g, "").replace(expReg, '$1.$2').replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
		});
	}

	/*Numeric Format with two decimals*/
	$('#inpPresupuesto').keypress(function (event) {
		TransaccionesFormato(event, this)	 
	}).on('paste', function (event) {
		event.preventDefault();

	}).blur((e) => {
		if ($(e.currentTarget).val().substr(1).includes('-')) {
			$(e.currentTarget).val($(e.currentTarget).val().replace('-', ''));
		}
		var currentValue = $(e.currentTarget).val().replace(',', '').trim() == '' ? 0 : parseFloat($(e.currentTarget).val());
		var currentValue = $(e.currentTarget).val().replace(',', '').trim() == '' ? 0 : parseFloat($(e.currentTarget).val());
		if ($(e.currentTarget).val().includes('.')) {
			if ($(e.currentTarget).val().split('.')[1].length > 2) {
				$(e.currentTarget).val(commaSeparateNumber($(e.currentTarget).val().split('.')[0] + '.' + $(e.currentTarget).val().split('.')[1].substring(0, 2)))
			} else {
				$(e.currentTarget).val(commaSeparateNumber($(e.currentTarget).val()))
			}
		} else {
			$(e.currentTarget).val(commaSeparateNumber($(e.currentTarget).val()))
		}
		$(e.currentTarget).val(commaSeparateNumber($(e.currentTarget).val()))
		if (currentValue === 0) {
			$('#divinpPresupuesto').removeClass("has-success").addClass("has-danger");
			$('#inpPresupuesto').removeClass("is-valid").addClass("is-invalid");
			$('#btnEditPresupuesto').attr("disabled", true);

		} else {
			$('#divinpPresupuesto').removeClass("has-danger").addClass("has-success");
			$('#inpPresupuesto').removeClass("is-invalid").addClass("is-valid");
			$('#btnEditPresupuesto').attr("disabled", false);
		}
	});


}

function TipoMovimiento() {

	CallAjax("/cargas/GetListaTipoMovimiento?esCarga=" + $('#ckPresupuesto').prop("checked"), undefined, "json", function (data) {
		
		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option title="' + data.Record[i].DETALLES + '" value="' + data.Record[i].ID + '">' + data.Record[i].MOVIMIENTO_NOMBRE + '</option>';
			}
			$("#sopTipoMovimiento").html(s);

		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}

function Trimestre() {

	CallAjax("/cargas/GetListaTrimestre", undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option title="' + data.Record[i].Titulo + '" value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopTrimestre").html(s);

		}
		else {
			toastr.error(data.message);
		}


	}, "GET", true);
}

function resetData() {
	$("#btnUpload").attr("disabled", true);
	$('#postedFiles').val('');

	 
};


function CargarDocumento() {
	var dataUpload = $('#postedFiles')[0];
	var currentUser = $('#inpUsr').val();
	var currentYearBudget = $('#inpPresupAn').val();
	var UriApi = $('#inpApiUri').val();
	
	var formData = new FormData();
	formData.append('postedFiles', dataUpload.files[0]);
	formData.append('user', currentUser);
	formData.append('yearBudget', currentYearBudget);
	formData.append('tipo_movimiento_id', $('#sopTipoMovimiento option:selected').val());
	formData.append('trimestre_cuota', $('#sopTrimestre option:selected').val());

	CallAjaxFiles(UriApi, formData, "json", function (data) {

		if (data) {

			if (data.mensajeResultado === "Ok") {
				/*$('#taResult').val(JSON.stringify(data.data));*/
				
				swal({
					html: true,
					title: 'Resultado!',
					text: `<div class="container d-flex justify-content-start text-center">
							<div class="row">
								<div class="col-md-12 mt-2">
									<span class="fw-bold">Enviados: </span>${data.recondEnviados}
								</div>
								<div class="col-md-12 mt-2">
									<span class="fw-bold">Almacenados: </span>${data.recordAlmacenados}
								</div>
								<div class="col-md-12 mt-4">
									${data.recondEnviados > data.recordAlmacenados || data.recordAlmacenados == 0 ?
										"Puede que algunos de estos registros ya esten cargados previamente!" : "Todos los registros fueron almacenados!"}
								</div>
								<div class="col-md-12 mt-5">
					
								</div>
							</div>

							<br />
							<br />

						   </div>`,

					type: "success"
				});

			} else {

				swal({
					html: true,
					title: data.mensajeResultado,
					text: JSON.stringify(data.subpartidasFaltantes),
					type: "info"
				});

			}

			resetData();

		}

	}, "POST", false);





}
function LimpiarTablas() {
	$('#tblPresupuestoCargas').DataTable().clear().draw();
	$('#tblCuotaCargas').DataTable().clear().draw();
}
function btnRdoCuota(e) {
	$(".divOpciones").attr('style', 'display: none');
	LimpiarTablas();
	var CurrentTarget = e.currentTarget.id;
	if (CurrentTarget.includes('Carga')) {
		$("#divCargas").fadeIn("slow");
		
	} else {
		
		if (CurrentTarget.includes('Presupuesto')) {
			$("#divPresupuestos").fadeIn("slow");
			cargarPresupuestoDatatable();
		} else {
			$("#divCuotas").fadeIn("slow");
			cargarCuotaDatatable();
		}
		 
	}

}

function EditarItem(e) {
	var data = JSON.parse(atob($(e).attr('data-item')));
	fillDataEdit(data);
}
function UpdateEditar() {
	var currentId = $('#spRegID').text();
	var esPresupuesto = $('#btnRdoPresupuesto').is(":checked");
	var presupuestoCarga = {
		ID: parseInt(currentId),
		MONTO_DE_LEY: $('#inpPresupuesto').val().replaceAll(',', ''),
		DETALLES: $('#taDetalles').val().trim(),
		PRESUPUESTO_ANUAL_DE: parseInt($('#inpPresupuestoAn').val()),
		CREADO_POR: $('#inpUsr').val(),
		ESTATUS_REGISTRO: $('#ckEstado').is(":checked") == true ? "1" : "0",
		TIPO_MOVIMIENTO_ID: parseInt($('#inpTipoMovimient').attr('data-item'))
	}
	if (!esPresupuesto) {
		delete presupuestoCarga.MONTO_DE_LEY;
		delete presupuestoCarga.DETALLES;
		presupuestoCarga.CUOTA_PRESUPUESTARIA = $('#inpPresupuesto').val().replaceAll(',', '');
		presupuestoCarga.DETALLES_CUOTA = $('#taDetalles').val().trim();
	}

	swal({
		title: "¿Esta seguro de Continuar?",
		html: true,
		customClass: 'swal-wide',
		text: `Se modificará el registro <span class= "fw-bold text-success" > #${currentId}</span>`,
		type: "info",
		showCancelButton: true,
		confirmButtonColor: "#3459e6",
		confirmButtonText: "Si, continuar!",
		closeOnconfirm: true
	}, function () {

		
		CallAjax(esPresupuesto ? "/Cargas/EditPresupuestoPorId" : "/Cargas/EditPresupuestoCuotaPorId", JSON.stringify(presupuestoCarga), "json", function (data) {

			if (data && data.Record) {
				if (data.Result == 'Ok') {

					notifyToastr('Registro Actualizado', 'success');
					$('#offcanvasCargas .btn-danger').click();
					if (esPresupuesto) {
						cargarPresupuestoDatatable();
					} else {
						cargarCuotaDatatable();
					}
						
				} else {
					notifyToastr(data.Record[0].MENSAJE_REQUEST, 'error');
					console.log(data.Record[0].StatusInfo);
				}

			}
			else {
				notifyToastr(data.message, 'error');
			}

			 
		}, "POST", true);
		

	});
}
function fillDataEdit(data) {
	var esPresupuesto = $('#btnRdoPresupuesto').is(":checked");

	if (esPresupuesto) {
		$('#spCargaTitulo').text('PRESUPUESTO');
		$('#iCargaTitle').attr('class', 'fa fa-regular fa-coins');
		$('#inpPresupuesto').val(commaSeparateNumber(data.MONTO_DE_LEY));
		$('#taDetalles').val(data.DETALLES);
		$('#lbinpPresupuesto').text('Presupuesto');

	} else {
		$('#spCargaTitulo').text('CUOTA');
		$('#iCargaTitle').attr('class', 'fa fa-regular fa-file-invoice-dollar');
		$('#inpPresupuesto').val(commaSeparateNumber(data.CUOTA_PRESUPUESTARIA));
		$('#taDetalles').val(data.DETALLES_CUOTA);
		$('#lbinpPresupuesto').text('Cuota');
		
	}
	var currentValue = $('#inpPresupuesto').val().replace(',', '').trim() == '' ? 0 : parseFloat($('#inpPresupuesto').val());

	if (currentValue === 0) {
		$('#divinpPresupuesto').removeClass("has-success").addClass("has-danger");
		$('#inpPresupuesto').removeClass("is-valid").addClass("is-invalid");
		$('#btnEditPresupuesto').attr("disabled", true);

	} else {
		$('#divinpPresupuesto').removeClass("has-danger").addClass("has-success");
		$('#inpPresupuesto').removeClass("is-invalid").addClass("is-valid");
		$('#btnEditPresupuesto').attr("disabled", false);
	}
	
	$('#spRegID').text(data.ID);
	$('#inpClasif').val(data.COD_DE_CLASIFICACION);
	$('#inpFuente').val(data.FUENTE_FINANCIAMIENTO_FONDO);
	$('#inpPartida').val(data.NOMBRE_PARTIDA);
	$('#inpGrupo').val(data.CODIGO_GRUPO);
	$('#inpGrupoDesc').val(data.NOMBRE_GRUPO);
	$('#inpSubpartida').val(data.CODIGO_SUBPARTIDA);
	$('#inpSubpartidaDesc').val(data.NOMBRE_SUBPARTIDA);
	$('#inpUnidadFisc').val(data.UNIDAD_FISCALIZADORA);
	$('#inpMoneda').val(data.MONEDA);
	$('#inpTipoMovimient').val(data.TIPO_MOVIMIENTO_NOMBRE).attr('data-item', data.TIPO_MOVIMIENTO_ID);
	
	$('#inpPresupuestoAn').val(data.PRESUPUESTO_ANUAL_DE);
	$('#inpUnidadFiscDepartamento').val(data.NOMBRE_UNIDAD_FISCALIZADORA);
	$('#inpTrimestrePrevio').val(data.NOMBRE_TRIMESTRE);
	$('#inpRegCrePor').val(data.CREADO_POR);
	$('#inpRegCreacionFecha').val(ConvertDateJsonToDate(data.CREADO_EN));
	$('#inpRegModPor').val(data.MODIFICADO_POR);
	$('#inpRegModifFecha').val(ConvertDateJsonToDate(data.MODIFICADO_EN));
	$('#ckEstado').prop("checked", data.ESTATUS_REGISTRO === '1'? true : false);
	
	
}

function cargarPresupuestoDatatable() {
	var presupuestoAnualDe = parseInt($("#inpPresupAn").val()); 
	CallAjax("/Cargas/GetPresupuestos?presupuestoAnualDe=" + presupuestoAnualDe, undefined, "json", function (data) {

		if (data && data.Record) {
		
			$("#tblPresupuestoCargas").show();
			dataTable = $("#tblPresupuestoCargas").DataTable({
				scrollX: true,
				data: data.Record,
				destroy: true,
				searching: true,
				language: LangSpanish,
				colReorder: true,
				responsive: true,
				"zeroRecords": " ",
				lengthMenu: [8, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				/*dom: 'Bfrtip',*/
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
					//{
					//	extend: 'csv',
					//	className: "btn btn-info fa fa-sharp fa-regular fa-file-csv text-white",
					//	text: ' CSV',
					//	title: 'csvExportar_Presupuesto_' + presupuestoAnualDe,
					//},
				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(data)*/
							/*				debugger*/
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar" href="#offcanvasCargas" class="btn btn-sm btn-warning text-white font-size-09" data-bs-toggle="offcanvas" onclick='EditarItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-edit"></i>
                                </a>
                            </div>
                            `;
						}, "width": "10%"
					},
					{ "data": "NOMBRE_PARTIDA", "width": "15%", className: "dt-custom-column-text text-justify" },
					{ "data": "CODIGO_GRUPO", "width": "15%", className: "dt-custom-column-text text-justify" },
					{ "data": "NOMBRE_GRUPO", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "CODIGO_SUBPARTIDA", "width": "8%", className: "dt-custom-column-text text-justify" },
					{
						"data": "NOMBRE_SUBPARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 50 ? item : item.substr(0, 50) + '...' : null)
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "UNIDAD_FISCALIZADORA", "width": "12%", className: "dt-custom-column-text text-center" },
					{
						"data": "MONTO_DE_LEY", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{ "data": "TIPO_MOVIMIENTO_NOMBRE", "width": "15%", className: "dt-custom-column-text text-justify" },
					{ "data": "MONEDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "CENTRO_GESTOR", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "DETALLES",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 70 ? item : item.substr(0, 70) + '...': null)
							);
						},
						"width": "40%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "COD_DE_CLASIFICACION", "width": "10%", className: "dt-custom-column-text text-center" },
					{ "data": "FUENTE_FINANCIAMIENTO_FONDO", "width": "7%", className: "dt-custom-column-text text-center" },
					{ "data": "PRESUPUESTO_ANUAL_DE", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "CREADO_POR", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "CREADO_EN",
						"render": (item) => {
							return (
								ConvertDateJsonToDate(item)
							);
						}, "width": "38%", className: "dt-custom-column-text text-center"
					},
					{ "data": "MODIFICADO_POR", "width": "8%", className: "dt-custom-column-text text-center" },
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
					{
						"data": "NOMBRE_UNIDAD_FISCALIZADORA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 40 ? item : item.substr(0, 40) + '...' : null)
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "NOMBRE_TRIMESTRE", "width": "20%", className: "dt-custom-column-text text-justify" },
					{ "data": "ID", "width": "5%", className: "dt-custom-column-text text-center" },
				],
				"width": "100%"
			});

		} else {
			$("#tblPresupuestoCargas").hide();
			$("#tblPresupuestoCargas").DataTable({
				destroy: true,
				searching: false,
				language: LangSpanish,
				data:null,
				"bLengthChange": false,
				"bPaginate": false
			});
		}
	}, "GET", true);
}

function cargarCuotaDatatable() {
	var presupuestoAnualDe = parseInt($("#inpPresupAn").val());
	CallAjax("/Cargas/GetCuotas?presupuestoAnualDe=" + presupuestoAnualDe, undefined, "json", function (data) {
	
		if (data && data.Record) {
			$("#tblCuotaCargas").show();
			dataTable = $("#tblCuotaCargas").DataTable({
				scrollX: true,
				data: data.Record,
				destroy: true,
				searching: true,
				colReorder: true,
				responsive: true,
				language: LangSpanish,
				"lengthMenu": [8, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
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
						title: 'Exportar_Cuotas_' + presupuestoAnualDe,
					},
					//{
					//	extend: 'csv',
					//	className: "btn btn-info fa fa-sharp fa-regular fa-file-csv text-white",
					//	text: ' CSV',
					//	title: 'csvExportar_Cuotas_' + presupuestoAnualDe,
					//},
				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(data)*/
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar" href="#offcanvasCargas" class="btn btn-sm btn-warning text-white font-size-09" data-bs-toggle="offcanvas" onclick='EditarItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-edit"></i>
                                </a>
                            </div>
                        `;
						}, "width": "20%"
					},
					{ "data": "NOMBRE_PARTIDA", "width": "15%", className: "dt-custom-column-text text-justify" },
					{ "data": "CODIGO_GRUPO", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "NOMBRE_GRUPO", "width": "15%", className: "dt-custom-column-text text-justify" },
					{ "data": "CODIGO_SUBPARTIDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "NOMBRE_SUBPARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 50 ? item : item.substr(0, 50) + '...' : null)
							);
						}, "width": "38%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "UNIDAD_FISCALIZADORA", "width": "12%", className: "dt-custom-column-text text-center" },
					{
						"data": "CUOTA_PRESUPUESTARIA", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{ "data": "TIPO_MOVIMIENTO_NOMBRE", "width": "15%", className: "dt-custom-column-text text-justify" },
					{ "data": "MONEDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "CENTRO_GESTOR", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "DETALLES_CUOTA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 70 ? item : item.substr(0, 70) + '...' : null)
							);
						},
						"width": "40%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "COD_DE_CLASIFICACION", "width": "10%", className: "dt-custom-column-text text-center" },
					{ "data": "FUENTE_FINANCIAMIENTO_FONDO", "width": "7%", className: "dt-custom-column-text text-center" },
					{ "data": "PRESUPUESTO_ANUAL_DE", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "CREADO_POR", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "CREADO_EN",
						"render": (item) => {
							return (
								ConvertDateJsonToDate(item)
							);
						}, "width": "38%", className: "dt-custom-column-text text-center"
					},
					{ "data": "MODIFICADO_POR", "width": "8%", className: "dt-custom-column-text text-center" },
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
					{
						"data": "NOMBRE_UNIDAD_FISCALIZADORA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 40 ? item : item.substr(0, 40) + '...' : null)
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "NOMBRE_TRIMESTRE", "width": "20%", className: "dt-custom-column-text text-justify" },
					{ "data": "ID", "width": "5%", className: "dt-custom-column-text text-center" },
				],
				"width": "100%"
			});
		}
		else {
			$("#tblCuotaCargas").hide();
			$("#tblCuotaCargas").DataTable({
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