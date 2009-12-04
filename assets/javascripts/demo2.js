

$(document).ready(function() {
	window.pubsub = new PubSub('/record/start', '/record/stop');
	CyNotify.subscribe('/record/start');
	CyNotify.subscribe('/record/stop');

	
	/*e = new CyEvent("mousemove", { x:10, y:20});
	s = e.serialize();
	e = JSON.parse(s);*/

	

});

$(window).load(function() {
	Cyclops.init();

	$(document).bind('keydown', 'Ctrl+r', function(e) {
		pubsub.publish('/record/start', e, 'recording started');
	});
	
	$(document).bind('keydown', 'Ctrl+s', function(e) {
		pubsub.publish('/record/stop', e, 'recording stopped');
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