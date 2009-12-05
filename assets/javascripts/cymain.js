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
	
cyclops_get_lastModified = null;
Cyclops.prototype.startListening = function() {

    $.getJSON("/activity?id="+$.cookie('cyclops_queue_id'), function(ev) {
	//console.info(ev.when+': Playing event '+ev.type);
        slave['playEvent_'+ev.type](ev);
        slave.startListening();
    });
    
    /*
    var temp_cyclops_get_lastModified = null;
    $.ajax({
    beforeSend: function(XMLHttpRequest) {
      if(cyclops_get_lastModified != null) {
	XMLHttpRequest.setRequestHeader("If-Modified-Since", cyclops_get_lastModified);
      }
    },
    type: "GET",	
      url: "/activity?id="+$.cookie('cyclops_queue_id'),
    dataType: "json",
    async: true,
    success: function(ev){
      //console.info('data = '+data);
      //ev = JSON.parse(data);
      //try {
	console.info(ev.when+': Playing event '+ev.type);
	slave['playEvent_'+ev.type](ev);
      //} catch(exception) {
	 //if (self['console'])
	  //console.error(exception);
      //}
    },
    complete: function(XMLHttpRequest) {
      console.info('LAST MODIFIED IS:'+XMLHttpRequest.getResponseHeader('Last-Modified'));
      if(temp_cyclops_get_lastModified = XMLHttpRequest.getResponseHeader('Last-Modified')) {
        cyclops_get_lastModified = temp_cyclops_get_lastModified;
      }
      console.info('Last-Modified = '+temp_cyclops_get_lastModified);
      slave.startListening();
	
    }
  })
  console.info('Last-Modified = '+temp_cyclops_get_lastModified);
*/
	 
}

	
Cyclops.prototype.startListeningFromStorage = function() {
	events = master.eventStorage.reverse();
	el = events.pop();

	if (el)
	{
		//console.info(el.type);
		slave["playEvent_"+el.type](el);
	}
}

Cyclops.prototype.startRecording = function() {
	$(document).bind('mousemove', this.sendEvent);
	$(document).bind('click', this.sendEvent);
	$(document).bind('mouseover', this.sendEvent);
    /*
	$(document).bind('mouseout', this.sendEvent);
	$(document).bind('mouseenter', this.sendEvent);
	$(document).bind('mouseleave', this.sendEvent);
	$(document).bind('mouseup', this.sendEvent);
	$(document).bind('mousedown', this.sendEvent);
*/
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
  //console.info(ev.when+': sending '+e.type);
	
  $.post('/publish?id='+$.cookie('cyclops_queue_id'), ev.serialize(), function(data, textStatus) {
  });	
}

Cyclops.prototype.getEvent_mousemove = function(e) {
  event = new CyEvent("mousemove", { x:e.pageX, y:e.pageY });
  return event;	
}

Cyclops.prototype.getEvent_mouseover = function(e) {
    //console.info('getting mouseover:'+e.type);
    if(e.type == 'mouseover') {
	event = new CyEvent("mouseover", { x:e.pageX, y:e.pageY });
	return event;
    }
}

Cyclops.prototype.getEvent_mouseout = function(e) {
    //console.info('getting mouseout:'+e.type);
    if(e.type == 'mouseout') {
	event = new CyEvent("mouseout", { x:e.pageX, y:e.pageY });
	return event;
    }
}

Cyclops.prototype.getEvent_mouseenter = function(e) {
	event = new CyEvent("mouseenter", { x:e.pageX, y:e.pageY });
	return event;	
}

Cyclops.prototype.getEvent_mouseleave = function(e) {
	event = new CyEvent("mouseleave", { x:e.pageX, y:e.pageY });
	return event;	
}

Cyclops.prototype.getEvent_mouseup = function(e) {
  event = new CyEvent("mouseup", { x:e.pageX, y:e.pageY, clicks:e.detail });
  return event;	
}

Cyclops.prototype.getEvent_mousedown = function(e) {
  event = new CyEvent("mousedown", { x:e.pageX, y:e.pageY, clicks:e.detail });
  return event;	
}


Cyclops.prototype.getEvent_click = function(e) {
  event = new CyEvent("click", { x:e.pageX, y:e.pageY });
  return event;	
}


Cyclops.prototype.__find_object_in_location = function(x, y) {
  $('#mouse').hide();
  var el = document.elementFromPoint(x, y);
  $('#mouse').show();
    //console.info('got el from location:'+el);
  return el;
}

Cyclops.prototype.__create_event = function(type, pageX, pageY) {
    ev = jQuery.Event(type);
    ev.pageX=parseInt(pageX);
    ev.clientX=ev.pageX - (document.body.scrollLeft
				     + document.documentElement.scrollLeft)	;
    ev.pageY=parseInt(pageY);
    ev.clientY=ev.pageY - (document.body.scrollTop
				     + document.documentElement.scrollTop);
    return ev;
}


Cyclops.prototype.playEvent_mousemove = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    //el.dispatchEvent(evt);
      jsEvent = this.__create_event('mousemove', e.data.x, e.data.y);
      $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseover = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  var evt = document.createEvent("MouseEvents");
  el = slave.__find_object_in_location(e.data.x, e.data.y)
  if(el) {
    jsEvent = this.__create_event('mouseover', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseout = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);

  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    jsEvent = this.__create_event('mouseout', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}


Cyclops.prototype.playEvent_mouseenter = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);

  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    jsEvent = this.__create_event('mouseenter', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseleave = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);

  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    jsEvent = this.__create_event('mouseleave', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseup = function(e) {
  // TODO: move to dispatch event
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    jsEvent = this.__create_event('mouseup', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mousedown = function(e) {
  // TODO: move to dispatch event
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    jsEvent = this.__create_event('mousedown', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_click = function(e) {
  // TODO: move to dispatch event
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    jsEvent = this.__create_event('click', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }

}
