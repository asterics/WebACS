ACS.groupComponentView = function(	gc, // ACS.groupComponent
									modelLayer, // Kinetic.Layer
									guiLayer) { // Kinetic.Layer
	// private variables

	// private methods
	
	// public stuff
	var returnObj = ACS.componentView(gc, modelLayer, guiLayer);

	returnObj.destroy = function() {
		// TODO
	}
	
	// constructor code
	
	return returnObj;
}