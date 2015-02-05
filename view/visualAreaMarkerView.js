ACS.visualAreaMarkerView = function(vaMarker, // ACS.visualAreaMarker
									modelLayer) { // Kinetic.Layer
	// private variables
	var visible = true;

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.setVisible = function(vis) {
		visible = vis;
		// TODO: actually make the thing invisible or visible
	}
	
	returnObj.getVisible = function() {
		return visible;
	}	

	returnObj.destroy = function() {
		// TODO
	}	
	
	// constructor code
	
	return returnObj;
}