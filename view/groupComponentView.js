ACS.groupComponentView = function(	gc, // ACS.groupComponent
									modelView, // ACS.modelView
									modelLayer, // Kinetic.Layer
									guiLayer) { // Kinetic.Layer
	// private variables

	// private methods
	
	// public stuff
	var returnObj = ACS.componentView(gc, modelView, modelLayer, guiLayer);

	returnObj.destroy = function() {
		// TODO
	}
	
	// constructor code
	
	return returnObj;
}