function CyEvent(type, data) {
  this.type = type;
  this.data = data;
  this.when = Math.round(new Date().getTime() / 1000);
}

CyEvent.prototype.serialize = function() {
	return JSON.stringify(this);
}