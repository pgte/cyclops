var Cyclops = {
	
	init:function() {
		this.eventStorage = {};
		pubsub.subscribe('/record/start', this, "startRecording");
		pubsub.subscribe('/record/stop', this, "stopRecording");
	},

	startRecording: function(e) {
		$(document).bind('mousemove', this.storeEvent);
	},

	stopRecording: function(e) {
		$(document).unbind('mousemove', this.storeEvent);
	},

	storeEvent: function(e) {
		this.eventStorage.push(e);
		this.sendEvent(e);
	},
	
	sendEvent: function(e) {
		ev = this['getEvent_'+e.type](e);
		
		$.post('/publish?id=demo2', ev.serialize(), function(data, textStatus) {
			if (textStatus != "success")
				console.info("failed posting! " + stextStatus);
		});
	},
	
	getEvent_mousemove: function(e) {
		event = new CyEvent("mousemove", { x:e.pageX, y:e.pageY });
		return event;
	},
	
	playEvent_mousemove: function(e) {
		$("#mouse").css('top', e.x).css('left', e.y);
	}
}