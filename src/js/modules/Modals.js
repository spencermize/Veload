import {setColors} from './ColorControls.js';
Veload.prototype.unpop = function () {
	$('body').removeClass('loading');
	$('#modal').modal('hide');
	$('.modal-backdrop').not('.loader').remove();
}
Veload.prototype.pop = function (cnf = {}, evt = {}) {
	var self = this;
	const config = Object.assign({
		title: 'Alert',
		body: '',
		accept: true,
		close: true,
		acceptText: 'Okay',
		acceptClass: 'btn-primary',
		modalClass: '',
		backdrop: 'static'
	}, cnf);
	const events = Object.assign({
		cancelClick: function (e) {
			V.unpop();
		 },
		acceptClick: function () { }
	}, evt);
	console.log("loading modal");
	$('#modal-container').html(self.cTemps.modal(config));
	$('#modal .btn-cancel').on('click', events.cancelClick);
	$('#modal .btn-accept').on('click', events.acceptClick);
    $('#modal').modal('show');
	$('[data-tooltip=tooltip]').tooltip()
	setColors();

}

$('#modal-container').on('hidden.bs.modal','#modal',function(){
	console.log("destroying modal");
	$('#modal').modal('dispose').removeClass().addClass('modal fade');
	$('body').removeClass('modal-open');
});	