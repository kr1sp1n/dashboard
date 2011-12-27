var Dashboard = (function (dashboard) {
	//store.clear();
	//store.remove("my_new_dashboard");
	
	dashboard.start = function(id) {
		dashboard.items = {};
		return dashboard.load(id);
	};
	
	dashboard.load = function(id) {
		dashboard.id = (id===undefined) ? uuid() : id;
		
		var d = store.get(dashboard.id);
		if(d===undefined) {
			dashboard.save();
		} else {
			dashboard.merge(d);
		}
		return dashboard;
	};
	
	dashboard.save = function() {
		store.set(dashboard.id, dashboard);
		return dashboard;
	}
	
	dashboard.merge = function(d) {
		var key;
		for(key in d) {
			dashboard[key] = d[key];
		}
		dashboard.save();
		return dashboard;
	};
	
	dashboard.set = function(id, item) {
		dashboard.items[id] = item;
		dashboard.save();
		return dashboard;
	};
	
	dashboard.get = function(id, callback) {
		var item = dashboard.items[id];
		
		if(item===undefined) {
			callback("no item found", null);
		} else {
			callback(null, item);
		}
		return dashboard;
	};
	
	dashboard.inspect = function() {
		console.log(dashboard);
	};
	
	return dashboard;
}(Dashboard || {}));

/* Utils */
function uuid(a){return a?(0|Math.random()*16).toString(16):(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,uuid)}