$(document).ready(function() {
    $('#show_message').click(function() { $('#message').slideDown(); });
    $('#hide_message').click(function() { $('#message').slideUp(); });

    // Canvas paint

    canvas = document.getElementById('painthere');
    canvas_ctx = canvas.getContext('2d');
    canvas_ctx.fillStyle = 'black';
    canvas_ctx.beginPath();

    var x;
    var y;

    /*
    canvas.onmousedown = function(e) {
      x = e.clientX;
      y = e.clientY;
      canvas_ctx.moveTo(x, y);
    }

    canvas.onmouseup = function(e) {
      x = null;
      y = null;
    }
*/
    canvas.onmousemove = function(e) {
	/*
      if (x == null || y == null) {
	return;
      }*/

      x = e.clientX;
      y = e.clientY;
      x += -canvas.offsetLeft + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
      y += -canvas.offsetTop + document.body.scrollTop
			+ document.documentElement.scrollTop;
      canvas_ctx.lineTo(x, y);
      canvas_ctx.stroke();
      canvas_ctx.moveTo(x, y);
    }


    window.pubsub = new PubSub('/record/start', '/record/stop', '/listen/start', '/listen/stop', '/listen/new', '/listen/stop');
    CyNotify.subscribe('/record/start');
    CyNotify.subscribe('/record/stop');
    CyNotify.subscribe('/listen/start');


    
});

$(window).load(function() {

    function set_master_mode() {
      $.jGrowl('Setting master mode');
      master = new Cyclops('master');	
      $(document).bind('keydown', 'r', function(e) {
	      pubsub.publish('/record/start', e, 'recording started');
      });

      $(document).bind('keydown', 't', function(e) {
	      pubsub.publish('/record/stop', e, 'recording stopped');
      });
    }

    $(document).bind('keydown', 'm', function(e) {
	set_master_mode();
    });

    if(jQuery.url.param('cyclops_master') == 'true') {
	set_master_mode();
	master.startRecording();

    }

    function set_slave_mode() {
        $.jGrowl('Setting slave mode');
	slave = new Cyclops('save');
	$(document).bind('keydown', 'k', function(e) {
		pubsub.publish('/listen/start', e, 'listen started');
	});
	
	$(document).bind('keydown', 'l', function(e) {
		pubsub.publish('/listen/stop', e, 'listen stopped');
	});
    }

    if(jQuery.url.param('cyclops_slave') == 'true') {
	set_slave_mode();
	slave.startListening();
    }

    $(document).bind('keydown', 's', function(e) {
	set_slave_mode();
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

