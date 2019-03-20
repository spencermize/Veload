import EventEmitter from 'eventemitter3';
const EE = new EventEmitter();

EventEmitter.prototype.builder = function(arr,ctx){
	arr.forEach(function(eventName){
		EE.on(eventName,function(el){
			ctx[eventName.split('.').pop()](el);
		});
	});
};
export { EE };
