/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitPagina();
});

function onInitPagina() {
	$('#inpApiUri').val($('#inpApiBase').val() + '/presupuesto/agregar');
	$('#aPresuFormato').attr("href", $('#inpApiBase').val().split('/api/')[0] + '/PresupuestoFormato/FormatoCargaPresupuestoDGME.xlsx');
	$('#aCuotaFormato').attr("href", $('#inpApiBase').val().split('/api/')[0] + '/PresupuestoFormato/FormatoCuotaCargaPresupuestoDGME.xlsx');
	CargasInit();
	PresupuestoInit();

	$("input[name='btnradioCarga']").each(function () {
		$(this).change((e) => {
			btnRdoCuota(e);
		})


	});
	$("input[name='docTypeRadio']").each(function () {
		$(this).change((e) => {
			if (e.currentTarget.id.includes('Presupuesto')) {
				$('#inpApiUri').val($('#inpApiBase').val() + '/presupuesto/agregar');

			} else {
				$('#inpApiUri').val($('#inpApiBase').val() + '/presupuestoCuota/agregar');

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
		if ($('#postedFiles')[0].files.length > 0) {
			$("#btnUpload").attr("disabled", false);
		} else {
			$("#btnUpload").attr("disabled", true);
		}

	});
}
function PresupuestoInit() {
	$('#inpPresupAn').val(new Date().getFullYear()).attr({
		"min": new Date().getFullYear()
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

	/*Numeric Format with two decimals*/
	$('#inpPresupuesto').keypress(function (event) {
		if (((event.which != 46 && event.which !== 45 ||(event.which == 46 && $(this).val() == '')) ||
			($(this).val().indexOf('.') != -1) || ($(this).val().indexOf('-') != -1)) && (event.which < 48 || event.which > 57 || event.which == 188)) {
 
			event.preventDefault();
		}
	}).on('paste', function (event) {
		event.preventDefault();

	});
	$('#inpPresupuesto').blur((e) => {
		var currentValue = $(e.currentTarget).val().replace(',', '').trim() ==''? 0 : parseFloat($(e.currentTarget).val());
		$(e.currentTarget).val(commaSeparateNumber($(e.currentTarget).val()))
		if ( currentValue === 0) {
			$('#divinpPresupuesto').removeClass("has-success").addClass("has-danger");
			$('#inpPresupuesto').removeClass("is-valid").addClass("is-invalid");
			$('#btnEditPresupuesto').attr("disabled", true);

		} else {
			$('#divinpPresupuesto').removeClass("has-danger").addClass("has-success");
			$('#inpPresupuesto').removeClass("is-invalid").addClass("is-valid");
			$('#btnEditPresupuesto').attr("disabled", false);
		}
		
	})
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

	//debugger
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
		ESTATUS_REGISTRO: $('#ckEstado').is(":checked") == true? "1" : "2"
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
				if (data.Record[0].ESTATUS_REQUEST == 200) {
					toastr.options = {
						positionClass: 'toast-top-center'
					};
					notifyToastr('Registro Actualizado', 'success');
					$('#offcanvasCargas .btn-danger').click();
					if (esPresupuesto) {
						cargarPresupuestoDatatable();
					} else {
						cargarCuotaDatatable();
					}
						
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

	$('#inpPresupuestoAn').val(data.PRESUPUESTO_ANUAL_DE);
	$('#inpRegCrePor').val(data.CREADO_POR);
	$('#inpRegCreacionFecha').val(ConvertDateJsonToDate(data.CREADO_EN));
	$('#inpRegModPor').val(data.MODIFICADO_POR);
	$('#inpRegModifFecha').val(ConvertDateJsonToDate(data.MODIFICADO_EN));
	$('#ckEstado').prop("checked", data.ESTATUS_REGISTRO === '1'? true : false);
	
	
}

function RemoverItem(e) {
	var data = JSON.parse(atob($(e).attr('data-item')));

	var esPresupuesto = $('#btnRdoPresupuesto').is(":checked");
	debugger
	var presupuestoCarga = {
		ID: parseInt(data.ID),
		PRESUPUESTO_ANUAL_DE: parseInt(data.PRESUPUESTO_ANUAL_DE),
		CREADO_POR: $('#inpUsr').val()
	}

	swal({
		title: "¿Esta seguro de borrar?",
		html: true,
		customClass: 'swal-wide',
		text: `<div class="container d-flex justify-content-start text-center">
				<div class="row">
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Clasificación: </span>${data.COD_DE_CLASIFICACION}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Fuente: </span>${data.FUENTE_FINANCIAMIENTO_FONDO}
					</div>
				    <div class="col-md-12 mt-2">
						<span class="fw-bold">Partida: </span>${data.NOMBRE_PARTIDA}
					</div>
				    <div class="col-md-12 mt-2">
						<span class="fw-bold">Grupo: </span>${data.CODIGO_GRUPO + ' - ' + data.NOMBRE_GRUPO}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Subpartida: </span><span class="text-info">${data.CODIGO_SUBPARTIDA}</span>, ${data.NOMBRE_SUBPARTIDA}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Unidad Fiscalizadora: </span>${data.UNIDAD_FISCALIZADORA}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">${esPresupuesto? "Presupuesto": "Cuota"}: </span>${esPresupuesto ? commaSeparateNumber(data.MONTO_DE_LEY) : commaSeparateNumber(data.CUOTA_PRESUPUESTARIA) + ' (' + data.MONEDA + ')'}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Detalle: </span>${esPresupuesto ? data.DETALLES : data.DETALLES_CUOTA}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Fecha: </span>${ConvertDateJsonToDate(data.CREADO_EN)}
					</div>
					<div class="col-md-12 mt-2">
						<span class="fw-bold">Registro #: </span><span class="text-success">${data.ID}</span>
					</div>
					<div class="col-md-12 mt-5">
					
					</div>
				</div>

				<br />
				<br />

			   </div>`,
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#da292e",
		confirmButtonText: "Si, borrar!",
		closeOnconfirm: true
	}, function () {
		CallAjax(esPresupuesto ? "/Cargas/RemovePresupuestoPorId" : "/Cargas/RemovePresupuestoCuotaPorId", JSON.stringify(presupuestoCarga), "json", function (data) {

			if (data && data.Record) {
				if (data.Record == true) {
					toastr.options = {
						positionClass: 'toast-top-center'
					};
					notifyToastr('Registro Eliminado!');
					$('#offcanvasCargas .btn-danger').click();
					if (esPresupuesto) {
						cargarPresupuestoDatatable();
					} else {
						cargarCuotaDatatable();
					}
					
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
//function ShowReg(data) {
//	if (data.length > 0) {
//		$("#isRecord").fadeOut();
//		$("#divTbl").fadeIn("slow");
//	} else {
//		$("#divTbl").fadeOut();
//		$("#isRecord").fadeIn();
//	}

//}
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
				"zeroRecords": " ",
				lengthMenu: [8, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				/*dom: 'Bfrtip',*/
				dom: '<"top"B>, lfrtip',
				buttons: [
					{
						extend: 'excelHtml5',
						className: "btn btn-success fa fa-sharp fa-regular fa-file-excel text-white",
						text: ' Excel',
						title: 'Exportar_Presupuesto_' + presupuestoAnualDe,
					},
					{
						extend: 'csv',
						className: "btn btn-info fa fa-sharp fa-regular fa-file-csv text-white",
						text: ' CSV',
						title: 'csvExportar_Presupuesto_' + presupuestoAnualDe,
					},
				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(data)*/
							/*				debugger*/
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar" href="#offcanvasCargas" class="btn btn-sm btn-info text-white font-size-09" data-bs-toggle="offcanvas" onclick='EditarItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-edit"></i>
                                </a>
                                &nbsp;
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}'title="Eliminar" class="btn btn-sm btn-danger text-white font-size-09" data-bs-toggle="offcanvas" onclick='RemoverItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-trash-alt"></i>
                                </a>
                            </div>
                            `;
						}, "width": "20%"
					},
					{ "data": "NOMBRE_PARTIDA", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "CODIGO_GRUPO", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "NOMBRE_GRUPO", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "CODIGO_SUBPARTIDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "NOMBRE_SUBPARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item.length < 50 ? item : item.substr(0, 50) + '...')
							);
						}, "width": "40%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "UNIDAD_FISCALIZADORA", "width": "12%", className: "dt-custom-column-text text-center" },
					{
						"data": "MONTO_DE_LEY", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{ "data": "MONEDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "CENTRO_GESTOR", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "DETALLES",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item.length < 70 ? item : item.substr(0, 70) + '...')
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
				language: LangSpanish,
				"lengthMenu": [8, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(data)*/
							return `<div class="text-center">
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar" href="#offcanvasCargas" class="btn btn-sm btn-info text-white font-size-09" data-bs-toggle="offcanvas" onclick='EditarItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-edit"></i>
                                </a>
                                &nbsp;
                                <a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}'title="Eliminar" class="btn btn-sm btn-danger text-white font-size-09" data-bs-toggle="offcanvas" onclick='RemoverItem(this);' role="button" aria-controls="offcanvasExample" style="cursor:pointer; width:30px;">
                                <i class="far fa-trash-alt"></i>
                                </a>
                            </div>
                        `;
						}, "width": "20%"
					},
					{ "data": "NOMBRE_PARTIDA", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "CODIGO_GRUPO", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "NOMBRE_GRUPO", "width": "15%", className: "dt-custom-column-text text-center" },
					{ "data": "CODIGO_SUBPARTIDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "NOMBRE_SUBPARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item.length < 50 ? item : item.substr(0, 50) + '...')
							);
						}, "width": "38%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "UNIDAD_FISCALIZADORA", "width": "12%", className: "dt-custom-column-text text-center" },
					{
						"data": "CUOTA_PRESUPUESTARIA", render: $.fn.dataTable.render.number(',', '.', 2, '')
						, "width": "10%"
						, className: "dt-custom-column-text"
					},
					{ "data": "MONEDA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "CENTRO_GESTOR", "width": "8%", className: "dt-custom-column-text text-center" },
					{
						"data": "DETALLES_CUOTA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item.length < 70 ? item : item.substr(0, 70) + '...')
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