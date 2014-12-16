ACS.property = function(key, // String
						type, // ACS.dataType
						value) { // int, String, bool, double, Array<String>
	// private variables

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.description = '';
	returnObj.value = value;
	returnObj.combobox = '';
	returnObj.getStringList = false; // used for dynamic properties: values are suggested when ARE is in synced state
	
	returnObj.getKey = function() {
		return key;
	}
	
	returnObj.getType = function() {
		return type;
	}

	// constructor code
	
	
	return returnObj;
}
