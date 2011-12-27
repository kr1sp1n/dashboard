// Enable pusher logging - don't include this in production
Pusher.log = function(message) {
  if (window.console && window.console.log) window.console.log(message);
};

// Flash fallback logging - don't include this in production
WEB_SOCKET_DEBUG = true;
var pusher = new Pusher('66921715ac8ef4dec222');
var channel = pusher.subscribe('test_channel');

pusher.connection.bind('connected', function() {
	fetch_tasks();
	after_connected();
});

pusher.connection.bind('unavailable', function() {
	after_disconnected();
});

function getHash() {
  var hash = window.location.hash;
  return hash.substring(1); // remove #
}

var hash = getHash();
var dashboard_id = uuid();

if(hash=="") {
	document.location.href = document.location.href + "#" + dashboard_id;
} else {
	dashboard_id = hash;
}

Dashboard.start(dashboard_id).inspect();

function fetch_tasks() {
	channel.trigger("client-fetch-tasks", {dashboard:{id:Dashboard.id, tasks: Dashboard.items}});
}

channel.bind('client-fetch-tasks', function(data) {
	if(data.dashboard.id===Dashboard.id) {
		var local_key, local_items = Dashboard.items, foreign_items = data.dashboard.items, foreign_key;
		
		for(foreign_key in foreign_items) {
			Dashboard.set(foreign_key, foreign_items[foreign_key]).inspect();
		}
		
		for(local_key in local_items) {
			channel.trigger("client-update-task", {dashboard:{id: Dashboard.id, task: local_items[local_key]}});
		}
	}
});

channel.bind('client-new-task', function(data) {
	if(data.dashboard.id===Dashboard.id) {
		var task = data.dashboard.task;
		Dashboard.set(task.id, task).inspect();
		after_new_task(task);
	}
});

channel.bind('client-update-task', function(data) {
	if(data.dashboard.id===Dashboard.id) {
		var task = data.dashboard.task;
		
		Dashboard.get(task.id, function(err, t) {
			//console.log(t);
			if(t!==null) {
			} else {
				Dashboard.set(task.id, task).inspect();
				after_update_task(task);
			}
		});
	}
});