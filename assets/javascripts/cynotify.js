var CyNotify = {
	subscribe: function(eventname) {
		pubsub.subscribe(eventname, this, "notify");
	},
	
	unsubscribe: function(eventname) {
		
	},
	
	notify: function(e,msg) {
		$.jGrowl(msg);
	}
}
