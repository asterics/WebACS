ACS.RemoveChannelAction = function(parentModel, // ACS.model
								   c) { // ACS.channel
	// private variables
			
	// private methods
	
	// public stuff
	var returnObj = acsAction(parentModel);
	
	returnObj.execute = function() {
		parentModel.removeChannel(c);
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		parentModel.addChannel(c);
		parentModel.redoStack.push(returnObj);
	}

	// constructor code
	
	
	return returnObj;
}