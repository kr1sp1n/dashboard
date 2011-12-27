function after_update_task(task) {
	render_task(task);
}

function after_new_task(task) {
	render_task(task);
}

function after_connected() {
	$('#status').text('online');
}

function after_disconnected() {
	$('#status').text('offline');
}

$(document).ready(function() {
	
	$('#taskboard_id').text(Dashboard.id);
	
	// "dbee5cd1-de7a-4ddb-8444-ad4056489dc5"
	// "my_new_dashboard"
	
	var key, items = Dashboard.items;
	for(key in items) {
	  render_task(items[key]);
	}
	
	var reg = /([\w|\W]*)\//gi;
	var match = location.href.match(reg);
	var url = (match.length==1)? match[0] + 'remote.html#'+ Dashboard.id : false;
	
	$('#qr_code').append('<img class="qrcode" src="http://qrcode.kaywa.com/img.php?s=3&d='+encodeURIComponent(url)+'" />');

});

function render_task(task) {
	$('<li class="task"><p>'+task.text+'</p></li>').css('display', 'none').prependTo('#tasks').fadeIn('slow');
}