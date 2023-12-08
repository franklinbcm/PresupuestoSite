/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitUnidadesPagina();
});
function onInitUnidadesPagina() {

	inpMontos();
	setDefaultFecha();
	changesFields();
	clickBotones();

}

function UnidadDisponible() {
	var cuotaDisp = $('#inpCuotaTot').val().replaceAll(',', '');
	var actual = parseFloat($('#inpCompromisoUni').attr('data-item')); //Remover monto cuando es para editar una Unidad Fisc.
	var compromisoDisp = $('#inpCompromisoTot').val().replaceAll(',', '');
	var Disponible = (parseFloat(cuotaDisp) - parseFloat(compromisoDisp - actual)).toFixed(2);
	
	var result = (Disponible - parseFloat($('#inpCompromisoUni').val().replaceAll(',', '')).toFixed(2)).toFixed(2);
	if (result < 0) {
		
		$('#lbinpSaldo').addClass("badge bg-danger blink");
		$('#btnCrearUnidadF').attr("disabled", true);
		$('#btnEditUnidadF').attr("disabled", true);
	} else {
		$('#spDisponibilidad').text('');
		$('#lbinpSaldo').removeClass("badge bg-danger blink");
	}
	 
}
function clickBotones() {
	$('#btnCrearUnidadF').click((e) => {
		e.preventDefault();
		var currentId = $('#inpID').val();

		var unidadFiscalizadora = {
			ID: currentId == '' ? 0 : parseInt(currentId),
			CUOTA_ID: parseInt($('#inpCuotaID').val()),
			PRESUPUESTO_ANUAL_DE: parseInt($('#spPeriodo').text()),
			COMPROMISO: $('.cs-Compromiso').val().replaceAll(',', ''),
			FECHA: $('#inpFecha').val(),
			DETALLES: $('#taDetalles').val(),
			COD_PEDIDOS_RESERVAS: $('#inpCodPedidosReserva').val(),
			CREADO_POR: $('#inpUsr').val(),
			ESTATUS_REGISTRO: $('#ckEstado').is(":checked") == true ? "1" : "0",
			ES_PEDIDO: $('#inpRdoPedidos').is(":checked"),
			LINEA_MOV_ID: $("#sopLineaUnidad  option:selected").val()

		}
		
		 
		swal({
			title: "¿Esta seguro de Continuar?",
			html: true,
			customClass: 'swal-wide',
			text: `Se registrará un nuevo compromiso para esta unidad fiscalizadora!`,
			type: "info",
			showCancelButton: true,
			confirmButtonColor: "#3459e6",
			confirmButtonText: "Si, continuar!",
			closeOnconfirm: true
		}, function () {


			CallAjax("/Transacciones/AgregarUnidadFiscalizadora", JSON.stringify(unidadFiscalizadora), "json", function (data) {

				if (data && data.Record) {

					if (data.Record[0].IsSuccessStatusCode) {

						notifyToastr('Registro Creado', 'success');
						ActualizarDatosMovimientos();
						$('#btnBack').click();
						cargarTransUnidadesDatatable();

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
	 
	})
	$('#btnEditUnidadF').click((e) => {
		e.preventDefault();
		var currentId = $('#inpID').val();

		var unidadFiscalizadora = {
			ID: currentId == '' ? 0 : parseInt(currentId),
			CUOTA_ID: parseInt($('#inpCuotaID').val()),
			PRESUPUESTO_ANUAL_DE: parseInt($('#spPeriodo').text()),
			COMPROMISO: $('.cs-Compromiso').val().replaceAll(',', ''),
			FECHA: $('#inpFecha').val(),
			DETALLES: $('#taDetalles').val(),
			COD_PEDIDOS_RESERVAS: $('#inpCodPedidosReserva').val(),
			CREADO_POR: $('#inpUsr').val(),
			ESTATUS_REGISTRO: $('#ckEstado').is(":checked") == true ? "1" : "0",
			ES_PEDIDO: $('#inpRdoPedidos').is(":checked"),
			LINEA_MOV_ID: $("#sopLineaUnidad  option:selected").val()
			
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
			CallAjax("/Transacciones/EditUnidadFiscalizadora", JSON.stringify(unidadFiscalizadora), "json", function (data) {

				if (data && data.Record) {
					
					if (data.Record[0].IsSuccessStatusCode) {
						
						
						notifyToastr('Registro Actualizado', 'info');
						ActualizarDatosMovimientos();
						$('#btnBack').click();
						cargarTransUnidadesDatatable();


					} else {
						notifyToastr(JSON.parse(data.Record[0].StatusInfo).ReasonPhrase, 'error');
						console.log(data.Record[0].StatusInfo);
					}

				}
				else {
					notifyToastr(data.message, 'error');
				}


			}, "POST", true);


		});
	})
}
function ActualizarDatosMovimientos() {
	var subpartidaID = parseInt($('#inpSubpartidaDesc').attr('data-item'));
	var presupuestoAnualDe = parseInt($('#spPeriodo').text())
	CallAjax("/Transacciones/GetPresupCuotaUnidadFiscIndividual?presupuestoAnualDe=" + presupuestoAnualDe + "&subpartidaID=" + subpartidaID, undefined, "json", function (data) {

		if (data && data.Record) {

			if (data.Record[0].IsSuccessStatusCode) {
				if (data.Record.length > 0) {
					
					$('#inpCompromiso').val(commaSeparateNumber(data.Record[0].COMPROMISO_TOTAL));
					$('#inpDisponibilidad').val(commaSeparateNumber(data.Record[0].DISPONIBILIDAD));
				}
				

			} else {
				notifyToastr(JSON.parse(data.Record[0].StatusInfo).ReasonPhrase, 'error');
				console.log(data.Record[0].StatusInfo);
			}

		}
		else {
			notifyToastr(data.message, 'error');
		}


	}, "GET", true);


 
}
function changesFields() {
	$('#inpFecha').change((e) => {
		if ($(e.currentTarget).val() === '') {
			setDefaultFecha();
		}
	});
	$("#sopLineaUnidad").change((e) => {

		var value = validarFieldSelectBlinkLabel(e.currentTarget.id);
		var resultValidar = false;
		ValidadorMovimiento(value);
		if (!value) {

			var data = JSON.parse(atob($('#' + e.currentTarget.id + ' option:selected').attr('data-item')));
			var item = JSON.parse(data.Opcional);
			$('#' + e.currentTarget.id).attr('title', item.DESCRIPCION_LINEA_GASTO_OBJETO + ', UNIDAD FISC.: ' + item.UNIDAD_FISCALIZADORA + ', DEVENGADO: ' + commaSeparateNumber(item.PEDIDO));

		}
		if (parseInt($('#' + e.currentTarget.id + ' option:selected').val()) == -1) {
			resultValidar = true;
		}
		if (parseInt($("#sopTipoMovimi option:selected").val()) == -1) {
			resultValidar = true;
		}
		if ($("#inpCompromisoUni").length == 0) {
			resultValidar = true;
		}
		if (resultValidar) {
			$('#btnCrearUnidadF').attr("disabled", true);
			$('#btnEditUnidadF').attr("disabled", true);
		} else {
			$('#btnCrearUnidadF').attr("disabled", false);
			$('#btnEditUnidadF').attr("disabled", false);
		}

	/*	$("#sopTipoMovimi option:selected").val();	*/
	});
}
function setDefaultFecha() {
	const dt = new Date();
	dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
	$('#inpFecha').val(dt.toISOString().slice(0, 10));
}
function inpMontos() {

	/*Numeric Format with two decimals*/
	$('.cs-montos').keypress(function (event) {
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

		if (currentValue === 0 && !$(e.currentTarget).hasClass("cs-cero")) {
			$(e.currentTarget).parent().removeClass("has-success").addClass("has-danger");
			$(e.currentTarget).removeClass("is-valid").addClass("is-invalid");
			$('#btnCrearUnidadF').attr("disabled", false);
			$('#btnEditUnidadF').attr("disabled", false);

		} else {
			if ($(e.currentTarget).val() == '') {
				$(e.currentTarget).val(0)
			}
			$(e.currentTarget).parent().removeClass("has-danger").addClass("has-success");
			$(e.currentTarget).removeClass("is-invalid").addClass("is-valid");
		}
		var contarValidos = 0, permitirPaso = true;
		$('.cs-montos').each((idx) => {
			
			if ($($('.cs-montos')[idx]).val() == '') {
				contarValidos++;
			}
			if (!$($('.cs-montos')[idx]).hasClass("cs-cero")) {
				if ($($('.cs-montos')[idx]).val() == 0)
					permitirPaso = false;
			}
		})
		
		if (contarValidos === 0 && permitirPaso) {
			$('#btnCrearUnidadF').attr("disabled", false);
			$('#btnEditUnidadF').attr("disabled", false);
		} else {
			$('#btnCrearUnidadF').attr("disabled", true);
			$('#btnEditUnidadF').attr("disabled", true);
		}
		if (!$(e.currentTarget).hasClass("cs-cero")) {
			UnidadDisponible();
		}
		
		if (parseInt($('#sopTipoMovimi option:selected').val()) == -1 && currentValue != 0 &&  !$(e.currentTarget).hasClass("cs-cero")) {
			$('#btnCrearUnidadF').attr("disabled", true);
			$('#btnEditUnidadF').attr("disabled", true);
		}

	});
}

function CargarLineasPorUnidad() {
	var presupuestoAnualDe = parseInt($("#sopPresupAn").val());
	var presupuestoID = $('#hfRegID').val();
	CallAjax(`/Transacciones/GetListadoMovimientoPorPresupuestoID?presupuestoAnualDe=${presupuestoAnualDe}&presupuestoID=${presupuestoID}`, undefined, "json", function (data) {

		if (data && data.Record) {
			var s = '<option value="-1">-Seleccione-</option>';
			for (var i = 0; i < data.Record.length; i++) {
				s += '<option data-item="' + btoa(JSON.stringify(data.Record[i])) + '" title="' + data.Record[i].Titulo + '"   value="' + data.Record[i].Value + '">' + data.Record[i].Text + '</option>';
			}
			$("#sopLineaUnidad").html(s);


		}
		else {
			toastr.error(data.message);
		}

	}, "GET", true);

}
