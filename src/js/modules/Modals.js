import setColors from './ColorControls.js';
import Templates from './Templates.js';

const Modals = {
	handleEvents: function(){
		$('#modal-container').on('hidden.bs.modal','#modal',function(){
			$('#modal').modal('dispose').removeClass().addClass('modal fade');
			$('body').removeClass('modal-open');
		});
	},
	unpop: function(){
		$('body').removeClass('loading');
		$('#modal').modal('hide');
		$('.modal-backdrop').not('.loader').remove();
	},
	pop: function(cnf = {},evt = {}){
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
				self.unpop();
			},
			acceptClick: function(){ }
		},evt);
		$('#modal-container').html(Templates.get('modal')(config));
		$('#modal .btn-cancel').on('click',events.cancelClick);
		$('#modal .btn-accept').on('click',events.acceptClick);
		if (config.width){
			$('.modal-dialog').css('max-width',config.width);
		}
		$('#modal').modal('show');
		$('[data-tooltip=tooltip]').tooltip();
		setColors();
	},
	error: function(err){
		var config = {
			title: 'Error',
			body: `${err}`,
			accept: false,
			close: true
		};
		this.unpop();
		this.pop(config);
	}
};

Modals.handleEvents();
Object.freeze(Modals);

export default Modals;
