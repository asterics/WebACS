ACS.eventManager = function() {
	// private variables
	var events = [];
	
	// private methods
	
	// constructor code
	
	// public stuff
	var returnObj = {};
	
	returnObj.registerHandler = function(eventName, handler) {
		if (events[eventName]) {
			if (events[eventName].indexOf(handler) === -1) events[eventName].push(handler);
		} else {
			events[eventName] = [handler];
		}
	}
	
	returnObj.removeHandler = function(eventName, handler) {
		if ((events[eventName]) && (events[eventName].indexOf(handler) > -1)) {
			events[eventName].splice(events[eventName].indexOf(handler), 1);
			return true;
		} else {
			return false;
		}
	}

	returnObj.fireEvent = function(eventName, args) {
		log.info('the event ' + eventName + ' has been fired and the handlers (if any) are now being called...');
		if (!events[eventName]) {
			return false;
		} else {
			for (var i = 0; i < events[eventName].length; i++) {
				events[eventName][i](args);
			}
		}
	}
	
	return returnObj;
}