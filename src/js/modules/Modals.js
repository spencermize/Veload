import { setColors } from './ColorControls.js';
function Modals(){
	Veload.prototype.unpop = function(){
		$('body').removeClass('loading');
		$('#modal').modal('hide');
		$('.modal-backdrop').not('.loader').remove();
	};
	Veload.prototype.pop = function(cnf = {},evt = {}){
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
		},cnf);
		const events = Object.assign({
			cancelClick: function(){
				V.unpop();
			},
			acceptClick: function(){ }
		},evt);
		$('#modal-container').html(self.cTemps.modal(config));
		$('#modal .btn-cancel').on('click',events.cancelClick);
		$('#modal .btn-accept').on('click',events.acceptClick);
		if (config.width){
			$('.modal-dialog').css('max-width',config.width);
		}
		$('#modal').modal('show');
		$('[data-tooltip=tooltip]').tooltip();
		setColors();
	};

	$('#modal-container').on('hidden.bs.modal','#modal',function(){
		$('#modal').modal('dispose').removeClass().addClass('modal fade');
		$('body').removeClass('modal-open');
	});
}

export { Modals };
