ACS.component = function(id, // String; can be changed, but must be unique
						 componentTypeId, // String
						 description, // String
						 singleton, // bool
						 x, // int
						 y, // int
						 type, // ACS.componentType
						 isSelected, // bool
						 foundInComponentCollection) { // bool (if false, the component will be a skeleton only and removed by the view)

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.inputPortList = [];
	returnObj.outputPortList = [];
	returnObj.listenEventList = [];
	returnObj.triggerEventList = [];
	returnObj.propertyList = [];
	returnObj.gui = null;
	returnObj.events = ACS.eventManager();
	returnObj.matchesComponentCollection = true;
	returnObj.foundInComponentCollection = foundInComponentCollection;
	
	returnObj.getId = function() {
		return id;
	}
	
	returnObj.setId = function(newId) {
		id = newId;
	}

	returnObj.getComponentTypeId = function() {
		return componentTypeId;
	}	
	
	returnObj.getDescription = function() {
		return description;
	}
	
	returnObj.setDescription = function(newDescription) {
		description = newDescription;
	}

	returnObj.getSingleton = function() {
		return singleton;
	}	

	returnObj.getX = function() {
		return x;
	}
	
	returnObj.getY = function() {
		return y;
	}	
	
	returnObj.setNewPosition = function(newX, newY) {
		x = newX;
		y = newY;
		returnObj.events.fireEvent('componentPositionChangedEvent');
	}

	returnObj.getType = function() {
		return type;
	}	
	
	returnObj.getIsSelected = function() {
		return isSelected;
	}	
	
	returnObj.setIsSelected = function(newIsSelected) {
		isSelected = newIsSelected;
		if (isSelected) {
			returnObj.events.fireEvent('selectedEvent');
		} else {
			returnObj.events.fireEvent('deSelectedEvent');
		}
	}			

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
		
	return returnObj;
}

