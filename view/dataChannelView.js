ACS.dataChannelView = function(	dc, // ACS.dataChannel
								model, // ACS.model
								modelLayer) { // Kinetic.Layer
	// private variables
	var outputPort = dc.getOutputPort();
	var inputPort = dc.getInputPort();
	
	// private methods
	var setHandlerForInputPort = function() {
		inputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', function() {
			returnObj.line.points([	returnObj.line.points()[0], 
									returnObj.line.points()[1], 
									inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
									inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * inputPort.getPosition()]);
		});
	}
	
	// public stuff
	var returnObj = ACS.channelView(model, modelLayer);
	
	returnObj.getChannel = function() {
		return dc;
	}
	
	// constructor code
	if (inputPort) {
		returnObj.line.points([	outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition(),
								inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
								inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * inputPort.getPosition()]);
		setHandlerForInputPort();
	} else {
		// draw a line with length == 0 - target coordinates will be set on mouse move
		returnObj.line.points([	outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition(), 
								outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition()]);
	}
	
	outputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', function() {
		returnObj.line.points([	outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition(), 
								returnObj.line.points()[2], 
								returnObj.line.points()[3]]);
	});
	
	dc.events.registerHandler('dataChannelCompletedEvent', function() {
		// set endpoint and and handler for inputPort and redraw
		inputPort = dc.getInputPort();
		returnObj.line.points([	returnObj.line.points()[0], 
								returnObj.line.points()[1], 
								inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
								inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * inputPort.getPosition()]);
		setHandlerForInputPort();
		modelLayer.draw();
	});
	
	// highlight channel when mouse is over hitGraph
	returnObj.line.on('mouseover', function(e) {
		returnObj.line.strokeWidth(ACS.vConst.CHANNELVIEW_STROKEWIDTH+2);
		modelLayer.draw();
	});
	returnObj.line.on('mouseout', function(e) {
		returnObj.line.strokeWidth(ACS.vConst.CHANNELVIEW_STROKEWIDTH);
		modelLayer.draw();
	});
	// do the selecting
	returnObj.line.on('click', function(e) {
		if (e.evt.ctrlKey) { 
			// invert selection status
			var newStatus = !dc.getIsSelected();
			if (newStatus) {
				model.addItemToSelection(dc);
			} else {
				model.removeItemFromSelection(dc);
			}
		} else {
			// select only this channel
			model.deSelectAll();
			model.addItemToSelection(dc);
		}
		e.cancelBubble = true;
	});
	// register event handlers for selecting
	dc.events.registerHandler('selectedEvent', function() {
		returnObj.line.stroke(ACS.vConst.DATACHANNELVIEW_SELECTEDSTROKECOLOR);
		returnObj.line.dashEnabled(true);
		modelLayer.draw();
	});
	dc.events.registerHandler('deSelectedEvent', function() {
		returnObj.line.stroke(ACS.vConst.DATACHANNELVIEW_STROKECOLOR);
		returnObj.line.dashEnabled(false);
		modelLayer.draw();
	});		
	
	return returnObj;
}