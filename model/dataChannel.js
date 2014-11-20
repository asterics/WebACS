ACS.dataChannel = function(id) { // String
	// private variables
	inputPort = null;
	outputPort = null;
		
	// private methods
	
	// public stuff
	var returnObj = ACS.channel(id);
	
	returnObj.getInputPort = function() {
		return inputPort;
	}
	
	returnObj.setInputPort = function(newInPort) {
		inputPort = newInPort;
		returnObj.events.fireEvent('dataChannelCompletedEvent');
	}
	
	returnObj.getOutputPort = function() {
		return outputPort;
	}
	
	returnObj.setOutputPort = function(newOutPort) {
		outputPort = newOutPort;
	}

	// constructor code
	
	
	return returnObj;
}
