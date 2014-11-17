ACS.VisualAreaMarker = function(x, // int
								y) { // int
	// private variables

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.x = x;
	returnObj.y = y;
	returnObj.width = 0;
	returnObj.height = 0;
	returnObj.bgColor = ACS.mConst.VISUALAREAMARKER_BGCOLOR;
	returnObj.borderColor = ACS.mConst.VISUALAREAMARKER_BORDERCOLOR;

	// constructor code
	
	
	return returnObj;
}