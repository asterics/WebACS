ACS.gui = function(x, // int
				   y, // int
				   width, // int
				   height, // int
				   isExternal) { // bool
	// private variables

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.x = x;
	returnObj.y = y;
	returnObj.width = width;
	returnObj.height = height;
	
	returnObj.getIsExternal = function() {
		return isExternal;
	}

	// constructor code
	
	
	return returnObj;
}