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
		$('#btnCrear').attr("disabled", true);
		$('#btnEdit').attr("disabled", true);
	} else {
		$('#spDisponibilidad').text('');
		$('#lbinpSaldo').removeClass("badge bg-danger blink");
	}
	 
}
function clickBotones() {
	$('#btnCrear').click((e) => {
		e.preventDefault();
		var currentId = $('#inpID').val();

		var unidadFiscalizadora = {
			ID: currentId == '' ? 0 : parseInt(currentId),
			PRESUPUESTO_ID: parseInt($('#inpPresupuestoID').val()),
			PRESUPUESTO_ANUAL_DE: parseInt($('#spPeriodo').text()),
			COMPROMISO: $('.cs-Compromiso').val().replaceAll(',', ''),
			APROPIACION: $('.cs-Apropiacion').val().replaceAll(',', ''),
			FECHA: $('#inpFecha').val(),
			DETALLES: $('#taDetalles').val(),
			COD_PEDIDOS_RESERVAS: $('#inpCodPedidosReserva').val(),
			CREADO_POR: $('#inpUsr').val(),
			ESTATUS_REGISTRO: $('#ckEstado').is(":checked") == true ? "1" : "0"

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


			CallAjax("/Transacciones/AddUnidadFiscalizadora", JSON.stringify(unidadFiscalizadora), "json", function (data) {

				if (data && data.Record) {

					if (data.Result == 'Ok') {

						notifyToastr('Registro Creado', 'success');
						$('#btnBack').click();
						cargarTransUnidadesDatatable();

					} else {
						toastr.error(data.Record[0].MENSAJE_REQUEST);
					}

				}
				else {
					toastr.error(data.message);
				}


			}, "POST", true);


		});
	 
	})
	$('#btnEdit').click((e) => {
		e.preventDefault();
		var currentId = $('#inpID').val();

		var unidadFiscalizadora = {
			ID: currentId == '' ? 0 : parseInt(currentId),
			PRESUPUESTO_ID: parseInt($('#inpPresupuestoID').val()),
			PRESUPUESTO_ANUAL_DE: parseInt($('#spPeriodo').text()),
			COMPROMISO: $('.cs-Compromiso').val().replaceAll(',', ''),
			APROPIACION: $('.cs-Apropiacion').val().replaceAll(',', ''),
			FECHA: $('#inpFecha').val(),
			DETALLES: $('#taDetalles').val(),
			COD_PEDIDOS_RESERVAS: $('#inpCodPedidosReserva').val(),
			CREADO_POR: $('#inpUsr').val(),
			ESTATUS_REGISTRO: $('#ckEstado').is(":checked") == true ? "1" : "0"

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

					if (data.Result == 'Ok') {

						notifyToastr('Registro Actualizado', 'info');
						$('#btnBack').click();
						cargarTransUnidadesDatatable();


					} else {
						notifyToastr(JSON.stringify(data), 'error');
					}

				}
				else {
					notifyToastr(data.message, 'error');
				}


			}, "POST", true);


		});
	})
}
function changesFields() {
	$('#inpFecha').change((e) => {
		if ($(e.currentTarget).val() === '') {
			setDefaultFecha();
		}
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
			$('#btnCrear').attr("disabled", false);
			$('#btnEdit').attr("disabled", false);

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
			$('#btnCrear').attr("disabled", false);
			$('#btnEdit').attr("disabled", false);
		} else {
			$('#btnCrear').attr("disabled", true);
			$('#btnEdit').attr("disabled", true);
		}
		if (!$(e.currentTarget).hasClass("cs-cero")) {
			UnidadDisponible();
		}
			
	});
}