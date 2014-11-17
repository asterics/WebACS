ACS.dataChannel = function(id) { // String
	// private variables

	// private methods
	
	// public stuff
	var returnObj = ACS.channel(id);
	
	returnObj.inputPort = {};
	returnObj.outputPort = {};

	// constructor code
	
	
	return returnObj;
}
