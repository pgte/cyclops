function CyEvent(type, data) {
	this.type = type;
	this.data = data;
}

CyEvent.prototype.serialize = function() {
	
	return JSON.stringify(this);
}