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
        $(window).bind('resize', this.sendEvent);
        $(window).bind('scroll', this.sendEvent);

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

        
  var ev = master['getEvent_'+e.type](e);
  //console.info(ev.when+': sending '+e.type);

  $.post('/publish?id='+$.cookie('cyclops_queue_id'), ev.serialize(), function(data, textStatus) {});

  if(e.type == 'click') {
      var href = $(e.target).attr('href');
      if(href) {
	  $(e.target).attr('href', href+'?cyclops_master=true');
      }
      //console.info(e.nodeName);
  };
}

Cyclops.prototype.getEvent_mousemove = function(e) {
  return new CyEvent("mousemove", { x:e.pageX, y:e.pageY });
}

Cyclops.prototype.getEvent_mouseover = function(e) {
    //console.info('getting mouseover:'+e.type);
  return new CyEvent("mouseover", { x:e.pageX, y:e.pageY });
}

Cyclops.prototype.getEvent_mouseout = function(e) {
    //console.info('getting mouseout:'+e.type);
  return  new CyEvent("mouseout", { x:e.pageX, y:e.pageY });
}

Cyclops.prototype.getEvent_mouseenter = function(e) {
  return new CyEvent("mouseenter", { x:e.pageX, y:e.pageY });
}

Cyclops.prototype.getEvent_mouseleave = function(e) {
  return new CyEvent("mouseleave", { x:e.pageX, y:e.pageY });
}

Cyclops.prototype.getEvent_mouseup = function(e) {
  return new CyEvent("mouseup", { x:e.pageX, y:e.pageY, clicks:e.detail });
}

Cyclops.prototype.getEvent_mousedown = function(e) {
  return new CyEvent("mousedown", { x:e.pageX, y:e.pageY, clicks:e.detail });
}


Cyclops.prototype.getEvent_click = function(e) {
  return new CyEvent("click", { x:e.pageX, y:e.pageY });
}

Cyclops.prototype.getEvent_resize = function(e) {
//    console.info('resize');
    return new CyEvent("resize", { height:$(window).height(), width:$(window).width() });
}

Cyclops.prototype.getEvent_scroll = function(e) {
    return new CyEvent("scroll", { left:document.body.scrollLeft+ document.documentElement.scrollLeft, top: document.body.scrollTop + document.documentElement.scrollTop });
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
  var el;
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    //el.dispatchEvent(evt);
      var jsEvent = this.__create_event('mousemove', e.data.x, e.data.y);
      $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseover = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  var evt = document.createEvent("MouseEvents");
  var el = slave.__find_object_in_location(e.data.x, e.data.y)
  if(el) {
    var jsEvent = this.__create_event('mouseover', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseout = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  var el;
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    var jsEvent = this.__create_event('mouseout', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}


Cyclops.prototype.playEvent_mouseenter = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  var el;
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    var jsEvent = this.__create_event('mouseenter', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseleave = function(e) {
  // TODO: move to dispatch event
  $("#mouse").css('top', e.data.y).css('left', e.data.x);
  var el;
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    var jsEvent = this.__create_event('mouseleave', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mouseup = function(e) {
  // TODO: move to dispatch event
  var el;
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    var jsEvent = this.__create_event('mouseup', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_mousedown = function(e) {
  // TODO: move to dispatch event
  var el;
  if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {   
    var jsEvent = this.__create_event('mousedown', e.data.x, e.data.y);
    $(el).trigger(jsEvent);
  }
}

Cyclops.prototype.playEvent_click = function(e) {
  // TODO: move to dispatch event
   //console.info('CLICK!');
   var el, href;
   if(el = slave.__find_object_in_location(e.data.x, e.data.y)) {
       //console.info(el);
       if(href = $(el).attr('href')) {
	 document.location = href+'?cyclops_slave=true';
     } else {
       $(el).click();
     }
   } else {
       //console.info('object not found for click');
   }

}

Cyclops.prototype.playEvent_resize = function(e) {
    window.resizeTo(e.data.width, e.data.height+170);
}

Cyclops.prototype.playEvent_scroll = function(e) {
    //console.info('scrolling to '+e.data.left+','+e.data.top);
    window.scrollTo(e.data.left, e.data.top);
}

$(window).load(function() {
    
});

