function after_connected() {
	$('#status').text('online');
}

function after_disconnected() {
	$('#status').text('offline');
}

function after_update_task(task) {
	render_task(task);
	$('#task_list').listview('refresh');
}

function after_new_task(task) {
	render_task(task);
	$('#task_list').listview('refresh');
}

$(document).bind("mobileinit", function(){
  //apply overrides here
});

$(document).bind( "pagebeforechange", function( e, data ) {
	/* grab Dashboard id from hash */
	if ( typeof data.toPage === "string" ) {
		var u = $.mobile.path.parseUrl( data.toPage );
		if(u.hash!="#tasks") $.mobile.changePage("#tasks", data.options );
		//e.preventDefault();
	}
});

$( document ).bind( "pagebeforeload", function( event, data ){

	// Let the framework know we're going to handle the load.

	alert(data.absUrl);

	//event.preventDefault();

	// ... load the document then insert it into the DOM ...
	// at some point, either in this callback, or through
	// some other async means, call resolve, passing in
	// the following args, plus a jQuery collection object
	// containing the DOM element for the page.

	//data.deferred.resolve( data.absUrl, data.options, page );

});

$( document ).bind( "pageloadfailed", function( event, data ){

	// Let the framework know we're going to handle things.

	//event.preventDefault();

    alert('failed');

	// ... attempt to load some other page ...
	// at some point, either in this callback, or through
	// some other async means, call resolve, passing in
	// the following args, plus a jQuery collection object
	// containing the DOM element for the page.

	//data.deferred.resolve( data.absUrl, data.options, page );

});

$( document ).delegate("#tasks", "pagecreate", function() {
	var key, items = Dashboard.items;
	for(key in items) {
	  render_task(items[key]);
	}
	
	$(".button.create_new_task").live("click", function(){
		 createTask($('#task_description').val());
	});
});

function render_task(task) {
	$('<li><a href="#">'+task.text+'</a></li>').css('display', 'none').prependTo('#task_list').fadeIn('slow');
}

function createTask(text) {
	var id = uuid(),
	task = {};
	task.id = id;
	task.text = text;

	Dashboard.set(id, task);
	render_task(task);
	channel.trigger("client-new-task", {dashboard:{id:Dashboard.id, task: task}});
	$('#task_list').listview('refresh');
}