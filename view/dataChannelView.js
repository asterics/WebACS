ACS.dataChannelView = function(	dc, // ACS.dataChannel
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
	var returnObj = ACS.channelView(modelLayer);
	
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
		
	return returnObj;
}