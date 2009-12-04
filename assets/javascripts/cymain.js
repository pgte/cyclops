var Cyclops = function(type) {
	this.eventStorage = [];
	
	if (type == "master")
	{
		pubsub.subscribe('/record/start', this, "startRecording");
		pubsub.subscribe('/record/stop', this, "stopRecording");
	}
	else
	{
		pubsub.subscribe('/listen/start', this, 'startListening');
		//pubsub.subscribe('/listen/new', this, 'startListeningFromStorage');
		//pubsub.subscribe('/listen/stop', this, 'stopListening');
	}
}
	
Cyclops.prototype.startListening = function() {
  $.get("/activity?id=final", {}, function(ev) {
		ev = JSON.parse(ev);
		slave['playEvent_'+ev.type](ev);
		slave.startListening();
  });	
}

	
Cyclops.prototype.startListeningFromStorage = function() {
	events = master.eventStorage.reverse();
	el = events.pop();

	if (el)
	{
			console.info(el.type);
		slave["playEvent_"+el.type](el);
	}
}

Cyclops.prototype.startRecording = function() {
	$(document).bind('mousemove', this.sendEvent);
	$(document).bind('click', this.sendEvent);
	// TODO: add more events
}
	
Cyclops.prototype.stopRecording = function() {
	$(document).unbind('mousemove', this.storeEvent);
}

Cyclops.prototype.storeEvent = function(e) {
	master.eventStorage.push(e);
	pubsub.publish('/listen/new', e, 'new event');
}

Cyclops.prototype.sendEvent = function(e) {
        
	ev = master['getEvent_'+e.type](e);
	
	$.post('/publish?id=final', ev.serialize(), function(data, textStatus) {
		if (textStatus != "success")
			console.info("failed posting! " + stextStatus);
	});	
}


Cyclops.prototype.getEvent_mousemove = function(e) {
	event = new CyEvent("mousemove", { x:e.pageX, y:e.pageY });
	return event;	
}

Cyclops.prototype.getEvent_click = function(e) {
	event = new CyEvent("click", { x:e.pageX, y:e.pageY });
	return event;	
}


Cyclops.prototype.playEvent_mousemove = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("mousemove", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);

    if(el = document.elementFromPoint(e.data.x, e.data.y)) {   
      el.dispatchEvent(evt);
    }
}

Cyclops.prototype.playEvent_click = function(e) {
  // TODO: move to dispatch event
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window,
    1, 0, 0, 0, 0, false, false, false, false, 0, null);
    $('#mouse').hide();
    if(el = document.elementFromPoint(e.data.x, e.data.y)) {
	console.info(el);
	el.dispatchEvent(evt);
    } else  {
	console.error('No element in '+e.data.x + ', '+e.data.y);
    }
    $('#mouse').show();

}
