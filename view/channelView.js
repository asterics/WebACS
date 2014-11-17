ACS.channelView = function(modelLayer) { // Kinetic.Layer
	// private variables
	var visible = true;
	
	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.line = new Kinetic.Line({
		points: [0, 0, 0, 0],
		stroke: 'black',
		strokeWidth: 2
	});

	returnObj.setStartPoint = function(x, y) {
		if (returnObj.line) {
			returnObj.line.points([x, y, returnObj.line.points()[2], returnObj.line.points()[3]]);
		}
	}
	
	returnObj.setEndPoint = function(x, y) {
		if (returnObj.line) {
			returnObj.line.points([returnObj.line.points()[2], returnObj.line.points()[3], x, y]);
		}
	}
	
	returnObj.setVisible = function(vis) {
		visible = vis;
		if (returnObj.line) {
			if (vis === true) {
				returnObj.line.unhide();
			} else {
				returnObj.line.hide();
			}
			visible = vis;
		}
	}
	
	returnObj.getVisible = function() {
		return visible;
	}
	
	returnObj.destroy = function() {
		if (returnObj.line) returnObj.line.destroy();
	}
	
	// constructor code
	modelLayer.add(returnObj.line);
	
	return returnObj;
}