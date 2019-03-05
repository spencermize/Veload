import EventEmitter from 'eventemitter3';
const EE = new EventEmitter();

EE.on('uncaughtException', function (err) {
    console.error(err);
});

export { EE }