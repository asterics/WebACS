ACS.RemoveComponentAction = function(parentModel, // ACS.model
									 c) { // ACS.component
	// private variables
			
	// private methods
	
	// public stuff
	var returnObj = acsAction(parentModel);
	
	returnObj.execute = function() {
		parentModel.removeComponent(c);
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		parentModel.addComponent(c);
		parentModel.redoStack.push(returnObj);
	}

	// constructor code
	
	
	return returnObj;
}