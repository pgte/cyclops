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

    canvas.onmousedown = function(e) {
      x = e.clientX;
      y = e.clientY;
      canvas_ctx.moveTo(x, y);
    }

    canvas.onmouseup = function(e) {
      x = null;
      y = null;
    }

    canvas.onmousemove = function(e) {
      if (x == null || y == null) {
	return;
      }
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

    
});