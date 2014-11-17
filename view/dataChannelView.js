ACS.dataChannelView = function(	dc, // ACS.dataChannel
								modelLayer) { // Kinetic.Layer
	// private variables

	// private methods
	var setHandlerForInputPort = function() {
		dc.inputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', function() {
			returnObj.line.points([	returnObj.line.points()[0], 
									returnObj.line.points()[1], 
									dc.inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
									dc.inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * dc.inputPort.getPosition()]);
			modelLayer.draw();
		});
	}
	
	// public stuff
	var returnObj = ACS.channelView(modelLayer);
	
	returnObj.getChannel = function() {
		return dc;
	}
	
	// constructor code
	if (dc.inputPort.propertyList) { // if dc.inputPort contains something, i.e. is not empty
		returnObj.line.points([	dc.outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								dc.outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * dc.outputPort.getPosition(),
								dc.inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
								dc.inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * dc.inputPort.getPosition()]);
		setHandlerForInputPort();
	} else {
		// draw a line with length == 0 - target coordinates will be set on mouse move
		returnObj.line.points([	dc.outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								dc.outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * dc.outputPort.getPosition(), 
								dc.outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								dc.outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * dc.outputPort.getPosition()]);
	}
	
	dc.outputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', function() {
		returnObj.line.points([	dc.outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								dc.outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * dc.outputPort.getPosition(), 
								returnObj.line.points()[2], 
								returnObj.line.points()[3]]);
		modelLayer.draw();
	});
		
	return returnObj;
}