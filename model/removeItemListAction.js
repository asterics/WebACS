ACS.removeItemListAction = function(parentModel) { // ACS.model

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var itemList = parentModel.selectedItemsList.slice(); // copy the original array to be independent from changes in the original array
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var updateItemList = function() {
		// for every component in the list: add to the list all channels that lead to or from the component
		for (var i = 0; i < itemList.length; i++) {
			if (typeof itemList[i].matchesComponentCollection !== 'undefined') { // only components have a parameter "matchesComponentCollection" and it is defined in every component-object
				for (var j = 0; j < parentModel.dataChannelList.length; j++) {
					if ((parentModel.dataChannelList[j].getInputPort().getParentComponent() === itemList[i]) || (parentModel.dataChannelList[j].getOutputPort().getParentComponent() === itemList[i])) {
						if (itemList.indexOf(parentModel.dataChannelList[j]) === -1) itemList.push(parentModel.dataChannelList[j]);
					}
				}
				for (var j = 0; j < parentModel.eventChannelList.length; j++) {
					if ((parentModel.eventChannelList[j].listener.getParentComponent() === itemList[i]) || (parentModel.eventChannelList[j].trigger.getParentComponent() === itemList[i])) {
						if (itemList.indexOf(parentModel.eventChannelList[j]) === -1) itemList.push(parentModel.eventChannelList[j]);
					}
				}
			}
		}
	}

// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = ACS.action(parentModel);
	
	returnObj.execute = function() {
		for (var i = 0; i < itemList.length; i++) {
			if (typeof itemList[i].matchesComponentCollection !== 'undefined') { // only components have a parameter "matchesComponentCollection" and it is defined in every component-object
				parentModel.removeComponent(itemList[i]);
			} else {
				if (typeof itemList[i].listener !== 'undefined') { // only eventChannels have a parameter "listener" and it is defined in every eventChannel-object
					parentModel.removeEventChannel(itemList[i]);
				} else {
					parentModel.removeDataChannel(itemList[i]);
				}
			}
		}
		parentModel.events.fireEvent('eventChannelViewMightNeedRemovingEvent');
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		for (var i = 0; i < itemList.length; i++) {
			if (typeof itemList[i].matchesComponentCollection !== 'undefined') { // only components have a parameter "matchesComponentCollection" and it is defined in every component-object
				parentModel.addComponent(itemList[i]);
			} else {
				if (typeof itemList[i].listener !== 'undefined') { // only eventChannels have a parameter "listener" and it is defined in every eventChannel-object
					parentModel.addEventChannel(itemList[i]);
				} else {
					parentModel.addDataChannel(itemList[i]);
				}
			}
		}
		parentModel.redoStack.push(returnObj);
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	updateItemList();
	
	return returnObj;
}