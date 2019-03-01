import * as annyang from 'annyang';
import Modals from './Modals.js';
import Templates from './Templates.js';
function Voice(){
	if (annyang){
	//add all commands from buttons that have [data-cmd] (not all functions will be valid)
		var commands = {};
		$('button[data-cmd]').each(function(ind,el){
			var cmd = $(el).data('cmd');
			commands[cmd] = function(){ V[cmd]({ caller: 'voice' }); };

			var alt = $(el).data('voice-alt');
			if (alt){
				alt = alt.split(',');
				alt.forEach(function(el){
					commands[el] = function(){ V[cmd]({ caller: 'voice' }); };
				});
			}
		});

		annyang.addCommands(commands);

		annyang.addCommands({
			'select item :num': {
				callback: function(num){
					$(`#modal li:eq(${num - 1}) [data-cmd]`).click();
				},
				regexp: /^select item ([0-9])$/
			}
		});

		annyang.addCallback('resultMatch',function(userSaid){
			var config = {
				message: userSaid,
				title: 'command recognized',
				class: 'speech',
				mainClass: 'top'
			};
			var over = $(Templates.get('overlay')(config));
			$('body').append(over);
			setTimeout(function(){
				over.remove();
			},2000);
		});
		annyang.addCallback('error',function(err){
			if (err.error != 'no-speech'){
				Modals.error('The speech engine has crashed - do you have another Veload tab open?');
			}
		});

		annyang.start({ autoRestart: true });
	}
};

var voice = new Voice();
export { voice };
