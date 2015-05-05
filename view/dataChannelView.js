ACS.dataChannelView = function(	dc, // ACS.dataChannel
								model, // ACS.model
								modelLayer) { // Kinetic.Layer
								
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var outputPort = dc.getOutputPort();
	var inputPort = dc.getInputPort();
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
	// ********************************************** handlers ***********************************************************
	var componentPositionChangedEventHandlerInPort = function() {
		returnObj.line.points([	returnObj.line.points()[0], 
								returnObj.line.points()[1], 
								inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
								inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * inputPort.getPosition()]);
	}
	
	var componentPositionChangedEventHandlerOutPort = function() {
		returnObj.line.points([	outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition(), 
								returnObj.line.points()[2], 
								returnObj.line.points()[3]]);
	}
	
	var dataChannelCompletedEventHandler = function() {
		// set endpoint and and handler for inputPort and redraw
		inputPort = dc.getInputPort();
		returnObj.line.points([	returnObj.line.points()[0], 
								returnObj.line.points()[1], 
								inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
								inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * inputPort.getPosition()]);
		inputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerInPort);
		modelLayer.draw();
	}

	var selectedEventHandler = function() {
		returnObj.line.stroke(ACS.vConst.DATACHANNELVIEW_SELECTEDSTROKECOLOR);
		returnObj.line.dashEnabled(true);
		modelLayer.draw();
	}
	
	var deSelectedEventHandler = function() {
		returnObj.line.stroke(ACS.vConst.DATACHANNELVIEW_STROKECOLOR);
		returnObj.line.dashEnabled(false);
		modelLayer.draw();
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = ACS.channelView(model, modelLayer);
	
	returnObj.getChannel = function() {
		return dc;
	}
	
	returnObj.destroy = function() {
		// first remove all event handlers
		if (inputPort) inputPort.getParentComponent().events.removeHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerInPort);
		outputPort.getParentComponent().events.removeHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerOutPort);
		dc.events.removeHandler('dataChannelCompletedEvent', dataChannelCompletedEventHandler);
		dc.events.removeHandler('selectedEvent', selectedEventHandler);
		dc.events.removeHandler('deSelectedEvent', deSelectedEventHandler);
		// de-select the channel
		if (dc.getIsSelected()) {
			model.removeItemFromSelection(dc);
		}
		// destroy the line
		if (returnObj.line) returnObj.line.destroy();
	}	
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	if (inputPort) {
		returnObj.line.points([	outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition(),
								inputPort.getParentComponent().getX() - ACS.vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT,
								inputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * inputPort.getPosition()]);
		inputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerInPort);
	} else {
		// draw a line with length == 0 - target coordinates will be set on mouse move
		returnObj.line.points([	outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition(), 
								outputPort.getParentComponent().getX() + ACS.vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX, 
								outputPort.getParentComponent().getY() + ACS.vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * outputPort.getPosition()]);
	}
	
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
	
	// register event handlers
	outputPort.getParentComponent().events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerOutPort);
	dc.events.registerHandler('dataChannelCompletedEvent', dataChannelCompletedEventHandler);
	dc.events.registerHandler('selectedEvent', selectedEventHandler);
	dc.events.registerHandler('deSelectedEvent', deSelectedEventHandler);
	
	return returnObj;
}