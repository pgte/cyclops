// Our publication and subscription broker
function PubSub() {
	var signals = arguments;
	this.subscribers = {};
	for (var i=0; i < signals.length; i++) {
		this.subscribers[signals[i]] = [];
	}
}

PubSub.prototype.publish = function(signal) {
	var args = Array.prototype.slice.call(arguments, 1)
	for (var i=0; i < this.subscribers[signal].length; i++) {
		var handler = this.subscribers[signal][i];
		handler.apply(this, args);
	}
}

PubSub.prototype.subscribe = function(signal, scope, handlerName){
	var curryArray = Array.prototype.slice.call(arguments, 3);
	this.subscribers[signal].push(function(){
		var normalizedArgs = Array.prototype.slice.call(arguments, 0);
		scope[handlerName].apply((scope || window), curryArray.concat(normalizedArgs));
	});
}