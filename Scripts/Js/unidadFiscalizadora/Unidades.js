/// <reference path="../common/utils.js" />
$(document).ready(function () {
	onInitUnidadesPagina();
	debugger
});
function onInitUnidadesPagina() {

	inpMontos();
}

function inpMontos() {

	/*Numeric Format with two decimals*/
	$('#inpCompromiso').keypress(function (event) {
		debugger
		TransaccionesFormato(event, this)
	}).on('paste', function (event) {
		event.preventDefault();

	}).blur((e) => {
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
			$('#divinpCompromiso').removeClass("has-success").addClass("has-danger");
			$('#inpCompromiso').removeClass("is-valid").addClass("is-invalid");
			$('#btnCrearOEdit').attr("disabled", true);

		} else {
			$('#divinpCompromiso').removeClass("has-danger").addClass("has-success");
			$('#inpCompromiso').removeClass("is-invalid").addClass("is-valid");
			$('#btnCrearOEdit').attr("disabled", false);
		}
	});
}