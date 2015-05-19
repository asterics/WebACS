ACS.addDataChannelAction = function(parentModel, // ACS.model
									dc) { // ACS.dataChannel

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
		parentModel.addDataChannel(dc);
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		parentModel.removeDataChannel(dc);
		parentModel.redoStack.push(returnObj);
	}
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	
	return returnObj;
}

