

$(document).ready(function() {
	window.pubsub = new PubSub('/record/start', '/record/stop', '/listen/start', '/listen/stop');
	CyNotify.subscribe('/record/start');
	CyNotify.subscribe('/record/stop');
	CyNotify.subscribe('/listen/start');	

	
	/*e = new CyEvent("mousemove", { x:10, y:20});
	s = e.serialize();
	e = JSON.parse(s);*/

	

});

$(window).load(function() {
	Cyclops.init_as('slave');

	$(document).bind('keydown', 'Ctrl+r', function(e) {
		pubsub.publish('/record/start', e, 'recording started');
	});
	
	$(document).bind('keydown', 'Ctrl+s', function(e) {
		pubsub.publish('/record/stop', e, 'recording stopped');
	});
	
	$(document).bind('keydown', 'Ctrl+l', function(e) {
		pubsub.publish('/listen/start', e, 'listen started');
	});
	
/*	$('img').click(function(e) {
		console.info(e);
		console.info("click on image");
	})
	
	$("#a").click(function() {
		simulateClick();
	});
	
	$(document).click(function() {
		console.info("click on document");
	});*/
	
});

/*
function simulateClick() {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
	var element = document.elementFromPoint(16, 109);
 	//document.getElementById('body').dispatchEvent(evt);
	element.dispatchEvent(evt);
}
*/