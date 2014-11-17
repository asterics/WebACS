ACS.channel = function(id) { // String; TODO: decide if ID is really needed
	// private variables
	var isSelected = false;

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.description = "";
	
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