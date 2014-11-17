ACS.portType = {
	INPUT: 1,
	OUTPUT: 2
};

ACS.portDataType = {
	BOOLEAN: 1,
	BYTE: 2,
	CHAR: 3,
	INTEGER: 4,
	DOUBLE: 5,
	STRING: 6
};

ACS.port = function(id, // String; can be changed, but must be unique
					parentComponent, // ACS.component
					type, // ACS.portType
					dataType, // ACS.portDataType
					position, // int
					mustBeConnected) { // bool
	// private variables

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.propertyList = [];
	
	returnObj.getId = function() {
		return id;
	}
	
	returnObj.getParentComponent = function() {
		return parentComponent;
	}

	returnObj.getType = function() {
		return type;
	}
	
	returnObj.getDataType = function() {
		return dataType;
	}
	
	returnObj.getPosition = function() {
		return position;
	}
	
	returnObj.getMustBeConnected = function() {
		return mustBeConnected;
	}	
	
	// constructor code
	
	
	return returnObj;
}
