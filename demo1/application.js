$(document).ready(function() {
	
	$("#record").click(function() {
		if ($(this).hasClass('stopped'))
		{
			startRecording();
			$(this).removeClass('stopped');
			$(this).text('stop recording');			
		}
		else
		{
			// TODO: move this to a pubsub
			stopRecording();
			$(this).addClass('stopped');
			$(this).text('start recording');
		}
	});
	
	$("#play").click(function() {
		playRecording();
	});
});

var eventStorage = [];
var events = [];


function storeEvent(e) {
	eventStorage.push(e);
}


function startRecording() {
	$(document).bind('mousemove', storeEvent);
}

function stopRecording() {
	$(document).unbind('mousemove', storeEvent);
}

function playRecording() {
	events = eventStorage.reverse();

	
	intervalID = setInterval(function() {
		el = events.pop();
		if (!el) {
			clearInterval(intervalID);
			console.info("stopped");
		}
		else
			window["run_"+el.type](el);
	}, 30);
}


function run_mousemove(e) {
	$("#mouse").css('top', e.pageY).css('left', e.pageX);
	//console.info("tick");
}

