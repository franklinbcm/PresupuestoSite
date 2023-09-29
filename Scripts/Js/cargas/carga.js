/// <reference path="../common/utils.js" />
$(document).ready(function () {
	//getData();
	$("#postedFiles").change(() => {
		if ($('#postedFiles')[0].files.length > 0) {
			$("#btnUpload").attr("disabled", false);
		} else {
			$("#btnUpload").attr("disabled", true);
		}

	});

	$("#intSelectOpt").change(() => {
		if ($("#intSelectOpt option:selected").val() === 'PRESUPUESTO') {
			$('#inpApiUri').val('https://localhost:44364/api/v1/presupuesto/agregar');
		} else {
			$('#inpApiUri').val('https://localhost:44364/api/v1/presupuestoCuota/agregar');
		}

	});
	$("input[name='btnradioCarga']").each(function () {
		$(this).change((e) => {
			btnRdoCuota(e);
		})
		 
	});
});

function resetData() {
	$("#btnUpload").attr("disabled", true);
};


function getData() {
	var dataUpload = $('#postedFiles')[0];
	var currentUser = $('#inpUsr').val();
	var currentYearBudget = $('#inpPresupAn').val();
	var UriApi = $('#inpApiUri').val();

	var formData = new FormData();
	formData.append('postedFiles', dataUpload.files[0]);
	formData.append('user', currentUser);
	formData.append('yearBudget', currentYearBudget);

	CallAjax(UriApi, formData, "json", function (data) {

		if (data) {

			if (data.mensajeResultado === "Ok") {
				/*$('#taResult').val(JSON.stringify(data.data));*/
				debugger

				Swal.fire('Resultado!',
					JSON.stringify({
						Enviados: data.recondEnviados, Almacenados: data.recordAlmacenados, Resultado: data.recondEnviados > data.recordAlmacenados || data.recordAlmacenados == 0 ?
							"Puede que ya existan algunos de estos registros cargados previamente" : "Todos los registros fueron almacenados"
					}),
					'success'
				)
			} else {

				//if (data.mensajeResultado.includes("Dentro de esta carga,")) {
				//	$('#taResult').val(JSON.stringify(data.presupuestosCargadossFaltantes));
				//} else {
				//	$('#taResult').val(JSON.stringify(data.subpartidasFaltantes));
				//}


				Swal.fire(data.mensajeResultado,
					JSON.stringify(data.subpartidasFaltantes),
					'info'
				)

			}



		}


	}, "POST", true);





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

function cargarPresupuestoDatatable() {
	var presupuestoAnualDe = parseInt($("#inpPresupAn").val()); 
	CallAjax("/Cargas/GetPresupuestos/" + presupuestoAnualDe, undefined, "json", function (data) {
		debugger
		if (data && data.Record) {
			dataTable = $("#tblPresupuestoCargas").DataTable({
			   scrollX: true,
				data: data.Record,
				destroy: true,
				searching: true,
				language: LangSpanish,
				"lengthMenu": [9, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				"columns": [
					{
						"data": "id",
						"render": (data) => {
							/*console.log(data)*/
							return `<div class="text-center">
                                <a href="/Admin/Categories/Edit/${data}" title="Editar" class="btn btn-sm btn-info text-white font-size-09" style="cursor:pointer; width:30px;">
                                <i class="far fa-edit"></i>
                                </a>
                                &nbsp;
                                <a onclick=Delete("/Admin/Categories/Delete/${data}") title="Eliminar" class="btn btn-sm btn-danger text-white font-size-09" style="cursor:pointer; width:30px;">
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
					{ "data": "CREADO_EN", 
						"render": (item) => {
							/*console.log(item)*/
							debugger
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
					{ "data": "ESTATUS_REGISTRO",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item == 1? 'ACTIVO' : 'INACTIVO')
							);
						},
						"width": "40%", className: "dt-custom-column-text text-center"
					},
					{ "data": "ID", "width": "5%", className: "dt-custom-column-text text-center" },
				],
				"width": "100%"
			});
		}
	}, "GET", true);
}

function cargarCuotaDatatable() {
	var presupuestoAnualDe = parseInt($("#inpPresupAn").val());
	CallAjax("/Cargas/GetCuotas/" + presupuestoAnualDe, undefined, "json", function (data) {
		debugger
		if (data && data.Record) {
			dataTable = $("#tblCuotaCargas").DataTable({
				scrollX: true,
				data: data.Record,
				destroy: true,
				searching: true,
				language: LangSpanish,
				"lengthMenu": [9, 10, 20, 40, 60, 80, 90, 100, 200, 500, 1000, 2000, 3000, 5000],
				"columns": [
					{
						"data": "id",
						"render": (data) => {
							/*console.log(data)*/
							return `<div class="text-center">
                            <a href="/Admin/Categories/Edit/${data}" title="Editar" class="btn btn-sm btn-info text-white font-size-09" style="cursor:pointer; width:30px;">
                            <i class="far fa-edit"></i>
                            </a>
                            &nbsp;
                            <a onclick=Delete("/Admin/Categories/Delete/${data}") title="Eliminar" class="btn btn-sm btn-danger text-white font-size-09" style="cursor:pointer; width:30px;">
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
	}, "GET", true);
}