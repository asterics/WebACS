ACS.addChannelAction = function(parentModel, // ACS.model
								c) { // ACS.channel
	// private variables
			
	// private methods
	
	// public stuff
	var returnObj = acsAction(parentModel);
	
	returnObj.execute = function() {
		parentModel.addChannel(c);
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		parentModel.removeChannel(c);
		parentModel.redoStack.push(returnObj);
	}
	
	// constructor code
	
	
	return returnObj;
}

