ACS.port = function(id, // String; can be changed, but must be unique
					parentComponent, // ACS.component
					type, // ACS.portType
					dataType, // ACS.dataType
					position, // int
					mustBeConnected) { // bool
	// private variables

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.propertyList = [];
	returnObj.sync = false;
	
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
