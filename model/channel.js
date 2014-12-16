ACS.channel = function(id) { // String
	// private variables
	var isSelected = false;

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.description = '';
	returnObj.events = ACS.eventManager();
	
	returnObj.getId = function() {
		return id;
	}
	
	returnObj.getIsSelected = function() {
		return isSelected;
	}
	
	returnObj.setIsSelected = function(newIsSelected) {
		isSelected = newIsSelected;
	}	

	// constructor code
	
	
	return returnObj;
}