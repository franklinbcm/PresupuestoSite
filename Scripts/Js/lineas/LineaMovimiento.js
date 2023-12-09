/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitPaginaLineaMovimiento();

});

function onInitPaginaLineaMovimiento() {
	ClickeMovimiento();
	changeMovimiento();
	MovimientoNumerico();
}

function ClickeMovimiento() {
	$('#btnAddMovLinea').click((e) => {
		fillPresupuesto();
		CargarLineas();
		cargarTransMovLineaObjDatatable();
		LimpiarLinea();
		$("#offcanvasExampleLabelTitulo").attr('style', 'display: none !important');
		$("#offcanvasExampleLabelLinea").show();
		$("#h5textHeader").text('MOVIMIENTOS LÍNEA GASTO OBJETO').removeClass("blink text-success text-warning").addClass("text-info");
		$(".is-new-record").attr('style', 'display: none !important');
		$("#divPasoIni").hide();
		$("#divPasoUnoLinea").hide();
		$("#divPasoMovimiento").show();

	})


	$('#btnpasoDos').click((e) => {
		e.preventDefault();
		$(".divOpcionesLinea").attr('style', 'display: none !important');
		$("#divLinea").show();
		$("#divPasoMovimiento").show();
		$("#divPasoUnoLinea").hide();


	})
	$('#btnBackPasoDos').click((e) => {
		e.preventDefault();
		MovimientoAtras();

	})
	$('#btnCrearMov').click((e) => {
		e.preventDefault();
		GuardarOActualizarMovimiento(e);

	})
	$('#btnEditMov').click((e) => {
		e.preventDefault();
		GuardarOActualizarMovimiento(e, false);

	})

}
function changeMovimiento() {
	$("#sopLineasActivas").change((e) => {

		var value = validarFieldSelectBlinkLabel(e.currentTarget.id);
		ValidadorMovimiento(value);
		if (!value) {
			
			var data = JSON.parse(atob($('#' + e.currentTarget.id + ' option:selected').attr('data-item')));
			$('#inpIDPasoDos').val(data.ID);
			$('#' + e.currentTarget.id).attr('title', data.DESCRIPCION + ', CÓD. PRESUP.: ' + data.CODIGO_PRESUPUESTARIO + ', CONTRATO: ' + data.CONTRATO + ', PROVEEDOR: ' + data.PROVEEDOR);

		}
	});
	$("#sopPartidaLinea").change((e) => {
		ValidadorMovimiento(validarFieldSelectBlinkLabel(e.currentTarget.id));
	});
	$("#sopGrupoLinea").change((e) => {
		ValidadorMovimiento(validarFieldSelectBlinkLabel(e.currentTarget.id));
	});
	$("#sopSubPartidaLinea").change((e) => {
		ValidadorMovimiento(validarFieldSelectBlinkLabel(e.currentTarget.id));
		$("#sopUnidadFisLinea").change();
	});
	$("#sopUnidadFisLinea").change((e) => {
		ValidadorMovimiento(validarFieldSelectBlinkLabel(e.currentTarget.id));
		if ($("#sopUnidadFisLinea option:selected").val() != '-1') {
			if ($('#inpPresupInicialLinea').val() == '') {
				
				var presupAn = $('#sopPresupAnLinea').val();
				var presupuestoID = $("#sopUnidadFisLinea option:selected").attr('data-id');
				CallAjax(`/Transacciones/GetListaPresupuestoPorFiltros?presupuestoAnualDe=${presupAn}&presupuestoID=${presupuestoID}`, undefined, "json", function (data) {

					if (data && data.Record) {

						if (data.Record[0].IsSuccessStatusCode) {
							
							$('#inpPresupInicialLinea').val(commaSeparateNumber(data.Record[0].MONTO_DE_LEY));

						} else {
							$('#inpPresupInicialLinea').val('');
							console.log(data.Record[0].StatusInfo);
						}

					}
					else {
						toastr.error(data.message);
					}


				}, "GET", true);
			}
		} else {
			$('#inpPresupInicialLinea').val(''); 
		}

	});
	$("#inpContenidoEcoLinea").change((e) => {
		ValidadorMovimiento(validarFieldTexto(e));
	});
	$("#inpPedidoLinea").change((e) => {
		ValidadorMovimiento(validarFieldTexto(e));
	});
	$("#inpReservaLinea").change((e) => {
		ValidadorMovimiento(validarFieldTexto(e));
	});
	$("#inpSolicitudPedidoLinea").change((e) => {
		ValidadorMovimiento(validarFieldTexto(e));
	});
	$("#inpFacturaLinea").change((e) => {
		ValidadorMovimiento(validarFieldTexto(e));
	});
	$("#inpFechaLinea").change((e) => {
		ValidadorMovimiento(validarFieldTexto(e));
	});

 
}
function ValidadorMovimiento(esValido) {
	 
	if ($('#divMovimiento .is-invalid').length > 0) {
		$('.cs-btn-general').attr("disabled", true);
	} else {
		$('.cs-btn-general').attr("disabled", false);
	}
 
	
}
function MovimientoAtras() {
	$(".divOpcionesLinea").attr('style', 'display: none !important');
	$("#divLinea").hide();
	$("#divPasoIni").hide();
	$("#divPasoUnoLinea").hide();
	$("#divPasoMovimiento").show();
	$("#divLinea").show()
	$("#h5textHeader").text('MOVIMIENTOS LÍNEA GASTO OBJETO').removeClass("blink text-success text-info text-warning").addClass("text-info text-primary");

}
function CompletarMovimiento(data) {
	
	$('#inpMovimientoID').val(data.ID);
	$("#sopLineasActivas").val(data.LINE_ID).change();
	$("#sopPartidaLinea").val(data.PARTIDA_ID).change().attr('disabled', true);
	setTimeout(() => {
		$("#sopGrupoLinea").val(data.GRUPO_ID).change().attr('disabled', true);
		setTimeout(() => {
			$("#sopSubPartidaLinea").val(data.SUBPARTIDA_ID).change().attr('disabled', true);
			setTimeout(() => {
				$("#sopUnidadFisLinea").val(data.SUBPARTIDA_ID).change().attr('disabled', true);
			}, 650)
		}, 450)
	}, 350)

	setTimeout(() => {
		$("#inpPresupInicialLinea").val(commaSeparateNumber(data.MONTO_DE_LEY));

		$("#inpCuotaUnoTrimestreLinea").val(commaSeparateNumber(data.CUOTA_TRIMESTRE_UNO));
		$("#inpCuotaDosTrimestreLinea").val(commaSeparateNumber(data.CUOTA_TRIMESTRE_DOS));
		$("#inpCuotaTresTrimestreLinea").val(commaSeparateNumber(data.CUOTA_TRIMESTRE_TRES));
		$("#inpCuotaCuartaTrimestreLinea").val(commaSeparateNumber(data.CUOTA_TRIMESTRE_CUATRO));
		$("#inpCuotaTotalLinea").val(commaSeparateNumber(data.CUOTA_TOTAL));

		$("#inpArrastreCompLinea").val(commaSeparateNumber(data.ARRASTRE_COMPROMISO));
		$("#inpContenidoEcoLinea").val(commaSeparateNumber(data.CONTENIDO_ECONOMICO)).change();
		$("#inpContenidoEcoNumeroLinea").val(data.CONTENIDO_ECONOMICO_DESC);
		$("#inpPedidoLinea").val(commaSeparateNumber(data.PEDIDO)).change();
		$("#inpPedidoNumeroLinea").val(data.PEDIDO_DESC);
		$("#inpReservaLinea").val(commaSeparateNumber(data.RESERVA)).change();
		$("#inpReservaNumeroLinea").val(data.RESERVA_DESC);
		$("#inpSolicitudPedidoLinea").val(commaSeparateNumber(data.SOLICITUD_PEDIDO)).change();
		$("#inpSolicitudPedidoNumeroLinea").val(data.SOLICITUD_PEDIDO_DESC);
		$("#inpFacturaLinea").val(commaSeparateNumber(data.FACTURA)).change();
		$("#inpFacturaNumeroLinea").val(data.FACTURA_DESC);
		$("#inpDisponibleCtaLinea").val(commaSeparateNumber(data.DISPONIBLE_CUOTA_TOTAL));
		$("#inpDisponiblePresupLinea").val(commaSeparateNumber(data.DISPONIBLE_PRESUPUESTO_TOTAL));

		$('#inpFechaLinea').val(ConvertDateJsonToInputDate(data.FECHA)).change();
		$("#taDetalles").val(data.DESCRIPCION);

		$('#inpRegCrePorMov').val(data.CREADO_POR);
		$('#inpRegCreacionFechaMov').val(ConvertDateJsonToDate(data.CREADO_EN));
		$('#inpRegModPorMov').val(data.MODIFICADO_POR);
		$('#inpRegModifFechaMov').val(ConvertDateJsonToDate(data.MODIFICADO_EN));
		$('#ckEstadoMovimiento').prop("checked", data.ESTATUS_REGISTRO === '1' ? true : false);
	}, 200);

	$(".is-new-record").attr('style', 'display: block !important');
	$("#btnEdit").attr('style', 'display: none !important');
	$("#btnCrear").attr('style', 'display: none !important');
	$("#btnEdit").attr('style', 'display: block !important');
	$("#btnCrearMov").parent().attr('style', 'display: none !important');
	$("#btnEditMov").parent().attr('style', 'display: block !important');

}

function EditLineaMovimiento(linea) {
	var data = JSON.parse(atob($(linea).attr('data-item')));
	GenerarNuevoMovimiento();
	setTimeout(() => {
		CompletarMovimiento(data);
	}, 300)
	$("#h5textHeader").text('EDITAR MOVIMIENTOS LÍNEA GASTO OBJETO').removeClass("blink text-success").addClass("text-info text-warning");
}
function GenerarNuevoMovimiento() {
	LimpiarPasos();
	CargarPartidaLinea();
	fillPresupuesto();
	$(".is-new-record").attr('style', 'display: none !important');
	$('#inpPresupAnLinea').val($('#sopPresupAnLinea').val());
	$("#divPasoIni").hide();
	$("#divPasoUnoLinea").hide();
	$("#divPasoMovimiento").hide();
	$("#divPasoDosLinea").show();
	$("#sopLineasActivas").val('-1').change();
	$("#sopPartidaLinea").val('-1').change().attr('disabled', false);
	$("#sopGrupoLinea").val('-1').change().attr('disabled', false);
	$("#sopSubPartidaLinea").val('-1').change().attr('disabled', false);
	$("#sopUnidadFisLinea").val('-1').change().attr('disabled', false);

	$("#inpContenidoEcoLinea").change();
	$("#inpPedidoLinea").change();
	$("#inpReservaLinea").change();
	$("#inpSolicitudPedidoLinea").change();
	$("#inpFacturaLinea").change();
	$('#inpFechaLinea').change();
	$("#btnEdit").attr('style', 'display: none !important');
	$("#btnCrear").attr('style', 'display: none !important');
	$("#btnEdit").attr('style', 'display: none !important');
	$("#btnCrearMov").attr('disabled', true);
	$("#btnCrearMov").parent().attr('style', 'display: block !important');
	$("#btnEditMov").parent().attr('style', 'display: none !important');
	$('#inpMovimientoID').val(0);
	$("#h5textHeader").text('NUEVO MOVIMIENTOS LÍNEA GASTO OBJETO').removeClass("text-info text-warning").addClass("blink text-success");
	
}

function GuardarOActualizarMovimiento(e, esCrear = true) {
	
	var unidadFisc = $('#sopUnidadFisLinea option:selected').text();
	var params = {
		"ID": esCrear ? 0 : parseInt($('#inpMovimientoID').val()), 
		"LINE_ID": $('#sopLineasActivas option:selected').val(),
		"PRESUPUESTO_ID": parseInt($('#sopUnidadFisLinea option:selected').attr('data-id')),
		"ARRASTRE_COMPROMISO": $('#inpArrastreCompLinea').val().replaceAll(',', ''),
		"CONTENIDO_ECONOMICO": $('#inpContenidoEcoLinea').val().replaceAll(',', ''),
		"CONTENIDO_ECONOMICO_DESC": $("#inpContenidoEcoNumeroLinea").val(),
		"PEDIDO": $('#inpPedidoLinea').val().replaceAll(',', ''),
		"PEDIDO_DESC": $("#inpPedidoNumeroLinea").val(),
		"RESERVA": $("#inpReservaLinea").val().replaceAll(',', ''),
		"RESERVA_DESC": $("#inpReservaNumeroLinea").val(),
		"SOLICITUD_PEDIDO": $('#inpSolicitudPedidoLinea').val().replaceAll(',', ''),
		"SOLICITUD_PEDIDO_DESC": $("#inpSolicitudPedidoNumeroLinea").val(),
		"FACTURA": $("#inpFacturaLinea").val().replaceAll(',', ''),
		"FACTURA_DESC": $("#inpFacturaNumeroLinea").val(),
		"FECHA": $('#inpFechaLinea').val(),
		"DESCRIPCION": $('#taDetalles').val(),
		"CREADO_POR": $('#inpUsr').val(),
		"ESTATUS_REGISTRO": $('#ckEstadoMovimiento').is(":checked") == true ? "1" : "0",
	};
 
	var titulo = esCrear ? 'creará' : 'actualizará';
	var uriPatch = esCrear ? 'AgregarLineaGastoObMovimiento' : 'EditarLineaGastoObMovimiento';
	swal({
		title: "¿Esta seguro de Continuar?",
		html: true,
		customClass: 'swal-wide',
		text: `Se ${titulo} el Movimiento Línea Gasto Objeto <span class= "fw-bold text-success" > ${unidadFisc}</span>.`,
		type: "info",
		showCancelButton: true,
		confirmButtonColor: "#3459e6",
		confirmButtonText: "Si, continuar!",
		closeOnconfirm: true
	}, function () {
		CallAjax(`/Transacciones/${uriPatch}`, JSON.stringify(params), "json", function (data) {
			
			if (data && data.Record) {

				if (data.Record[0].IsSuccessStatusCode) {

					notifyToastr(esCrear ? 'Registro Creado' : 'Registro Actualizado', 'success');
					cargarTransMovLineaObjDatatable();
					$('#btnBackPasoDos').click();

				} else {
					notifyToastr(JSON.parse(data.Record[0].StatusInfo).ReasonPhrase, 'error');
					console.log(data.Record[0].StatusInfo);
				}

			}
			else {
				toastr.error(data.message);
			}


		}, "POST", true);


	});
}
function cargarTransMovLineaObjDatatable() {

	var presupuestoAnualDe = parseInt($("#inpPresupAnLineaPasoDos").val());

	CallAjax(`/Transacciones/GetListadoMovimientoLineaGastoObjeto?presupuestoAnualDe=${presupuestoAnualDe}`, undefined, "json", function (data) {

		if (data && data.Record) {

			$("#tblMovimientoLiniaGastoObjeto").show();
			dataTable = $("#tblMovimientoLiniaGastoObjeto").DataTable({
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
						className: "btn btn-success fa fa-solid fa-plus text-white",
						text: ' Agregar Movimiento',
						action: () => {
							GenerarNuevoMovimiento();

						}
					}, {
						"extend": 'colvis',
						className: "btn btn-info fa fa-sharp fa-regular text-white text-capitalize fa fa-solid fa-columns",
						'text': ' Mostrar/Ocultar',
						"columns": ':not(.noVis)',

					},
					{
						extend: 'excelHtml5',
						className: "btn btn-success fa fa-sharp fa-regular fa-file-excel text-white",
						text: ' Excel',
						title: 'Exportar_Moviento_Linea_' + presupuestoAnualDe,
					},

				],
				"columns": [
					{
						"data": "ID",
						"render": (item) => {

							return `<div class="text-center">
								<a  data-item='${btoa(JSON.stringify(data.Record.find(x => x.ID == item)))}' title="Editar Línea"  class="btn btn-sm btn-warning text-white font-size-09"  onclick='EditLineaMovimiento(this);'  style="cursor:pointer; width:30px;">
									<i class="fa fa-regular fa-pen"></i>
                                </a>
                            </div>
                            `;
						}, "width": "5%"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).DESCRIPCION_LINEA_GASTO_OBJETO}" >${data.Record.find(x => x.ID == item).DESCRIPCION_LINEA_GASTO_OBJETO}</span>`
							);
						}, "width": "30%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).NOMBRE_PARTIDA}" >${data.Record.find(x => x.ID == item).NOMBRE_PARTIDA}</span>`
							);
						}, "width": "30%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "ID",
						"render": (item) => {
							/*console.log(item)*/
							/*debugger*/
							return (

								`<span title="${data.Record.find(x => x.ID == item).NOMBRE_GRUPO}" >${data.Record.find(x => x.ID == item).NOMBRE_GRUPO}</span>`
							);
						}, "width": "30%", className: "dt-custom-column-text text-justify"
					},
					{
						"data": "NOMBRE_SUBPARTIDA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 50 ? item : item.substr(0, 50) + '...' : null)
							);
						}, "width": "50%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "UNIDAD_FISCALIZADORA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "ARRASTRE_COMPROMISO", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "PEDIDO", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "PEDIDO_DESC", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "RESERVA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "RESERVA_DESC", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "SOLICITUD_PEDIDO", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "SOLICITUD_PEDIDO_DESC", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "FACTURA", "width": "8%", className: "dt-custom-column-text text-center" },
					{ "data": "FACTURA_DESC", "width": "8%", className: "dt-custom-column-text text-center" },
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
						"data": "FECHA", "render": (item) => {
							return (
								ConvertDateJsonToDateShort(item)
							);
						}, "width": "38%", className: "dt-custom-column-text text-center"
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
					{
						"data": "NOMBRE_UNIDAD_FISCALIZADORA",
						"render": (item) => {
							/*console.log(item)*/
							return (
								(item !== null ? item.length < 50 ? item : item.substr(0, 50) + '...' : null)
							);
						}, "width": "50%", className: "dt-custom-column-text text-justify"
					},
					{ "data": "ID", "width": "5%", className: "dt-custom-column-text text-center" }
				],
				"width": "100%"
			});


		} else {

			$("#tblMovimientoLiniaGastoObjeto").DataTable({
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

function MovimientoNumerico() {

	/*Numeric Format with two decimals*/
	$('.cs-movimiento-num').keypress(function (event) {
		TransaccionesFormato(event, this)
	}).on('paste', function (event) {
		event.preventDefault();

	}).blur((e) => {
		if ($(e.currentTarget).val().substr(1).includes('-')) {
			$(e.currentTarget).val($(e.currentTarget).val().replace('-', ''));
		}

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

		

	});
}
