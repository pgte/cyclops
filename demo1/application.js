$(document).ready(function() {
	
	$("#record").click(function() {
		if ($(this).hasClass('stopped'))
		{
			startRecording();
			$(this).removeClass('stopped');
		}
		else
		{
			// TODO: move this to a pubsub
			stopRecording();
			$(this).addClass('stopped');
		}
		
		
	});
	
	
	$(document).mousemove(function(e) {
		console.info(e);
	});
});

var eventStorage = [];


