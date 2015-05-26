ACS.channelView = function(model, // ACS.model
						   modelLayer) { // Kinetic.Layer
						   
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var visible = true;
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.line = {};
	
	returnObj.setStartPoint = function(x, y) {
		if (returnObj.line) {
			returnObj.line.points([x, y, returnObj.line.points()[2], returnObj.line.points()[3]]);
		}
	}
	
	returnObj.setEndPoint = function(x, y) {
		if (returnObj.line) {
			returnObj.line.points([returnObj.line.points()[0], returnObj.line.points()[1], x, y]);
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
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	returnObj.line = new Kinetic.Line({
		points: [0, 0, 0, 0],
		stroke: ACS.vConst.CHANNELVIEW_STROKECOLOR,
		strokeWidth: ACS.vConst.CHANNELVIEW_STROKEWIDTH,
		dash: [5, 5],
		dashEnabled: false,
		// set custom hitRegion to be shorter than actual channel to avoid KinteicJs antiAliasing-bug
		hitFunc: function(context) {
			context.beginPath();
			context.moveTo(returnObj.line.points()[0], returnObj.line.points()[1]);
			var channelEnd = [];
			if (returnObj.line.points()[2] > returnObj.line.points()[0])
				channelEnd[0] = returnObj.line.points()[2]-2;
			else
				channelEnd[0] = returnObj.line.points()[2]+2;
			if (returnObj.line.points()[3] > returnObj.line.points()[1])
				channelEnd[1] = returnObj.line.points()[3]-2;
			else
				channelEnd[1] = returnObj.line.points()[3]+2;			
			context.lineTo(channelEnd[0], channelEnd[1]);
			this.setStrokeWidth(ACS.vConst.CHANNELVIEW_HITREGIONWIDTH);
			context.fillStrokeShape(this);
			this.setStrokeWidth(ACS.vConst.CHANNELVIEW_STROKEWIDTH);
		}
	});
	
	returnObj.line.on('mousedown', function(e) {
		e.cancelBubble = true; // prevents modelView from starting a focusRect
	});
	
	modelLayer.add(returnObj.line);
	
	return returnObj;
}