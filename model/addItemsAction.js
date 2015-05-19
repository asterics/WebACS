ACS.addItemsAction = function(	parentModel, // ACS.model
								components, // Array<ACS.component>
								dataChannels, // Array<ACS.dataChannel>
								eventChannels) { // Array<ACS.eventChannel>
								

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
		for (var i = 0; i < components.length; i++) {
			parentModel.addComponent(components[i]);
		}
		for (var i = 0; i < dataChannels.length; i++) {
			parentModel.addDataChannel(dataChannels[i]);
		}
		for (var i = 0; i < eventChannels.length; i++) {
			parentModel.addEventChannel(eventChannels[i]);
		}
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		for (var i = 0; i < components.length; i++) {
			parentModel.removeComponent(components[i]);
		}
		for (var i = 0; i < dataChannels.length; i++) {
			parentModel.removeDataChannel(dataChannels[i]);
		}
		for (var i = 0; i < eventChannels.length; i++) {
			parentModel.removeEventChannel(eventChannels[i]);
		}	
		parentModel.redoStack.push(returnObj);
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	
	return returnObj;
}

