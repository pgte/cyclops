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
	$.each(eventStorage, function(index, el) {
		
		//console.info("X,Y: " + el.pageX + "," + el.pageY);
		window["run_"+el.type](el);
	});
}


function run_mousemove(e) {

	$("#mouse").css('top', e.pageY).css('left', e.pageX);
	console.info("tick");
	sleep(2);
}



function sleep(naptime)
{
	naptime = naptime * 1000;
  var sleeping = true;
  var now = new Date();
  var alarm;
	var startingMSeconds = now.getTime();
	//alert("starting nap at timestamp: " + startingMSeconds + "\nWill sleep for: " + naptime + " ms");
	while(sleeping){
		alarm = new Date();
		alarmMSeconds = alarm.getTime();
		if(alarmMSeconds - startingMSeconds > naptime){ sleeping = false; }
	}        
	//alert("Wakeup!");
}

