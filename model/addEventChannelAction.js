ACS.addEventChannelAction = function(parentModel, // ACS.model
									 ec) { // ACS.dataChannel

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
			
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = ACS.action(parentModel);
	
	returnObj.execute = function() {
		parentModel.addEventChannel(ec);
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		parentModel.removeEventChannel(ec);
		parentModel.redoStack.push(returnObj);
	}
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	
	return returnObj;
}