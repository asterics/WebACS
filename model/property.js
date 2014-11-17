ACS.property = function(key, // String
						value) { // int, String, bool, double, Array<String>
	// private variables

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.value = value;
	
	returnObj.getKey = function() {
		return key;
	}

	// constructor code
	
	
	return returnObj;
}
