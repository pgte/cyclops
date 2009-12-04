var Cyclops = {
	
	init_as: function(type) {
		this.eventStorage = {};
		
		if (type == "master")
		{
			pubsub.subscribe('/record/start', this, "startRecording");
			pubsub.subscribe('/record/stop', this, "stopRecording");
		}
		else
		{
			pubsub.subscribe('/listen/start', this, 'startListening');
		}
	},
	
	startListening: function() {
	  $.get("/activity?id=final", {}, function(ev) {
			ev = JSON.parse(ev);
			this['playEvent_'+ev.type](ev.data);
			this.startListening();
	  });
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
		
		$.post('/publish?id=final', ev.serialize(), function(data, textStatus) {
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