ACS.eventChannelView = function(ec, // ACS.eventChannel
								startComponent, // ACS.component
								modelLayer) { // Kinetic.Layer
	// private variables
	var endComponent = null;
	
	// private methods
	var setHandlerForListener = function() {
		endComponent.events.registerHandler('componentPositionChangedEvent', function() {
			returnObj.line.points([	returnObj.line.points()[0], 
									returnObj.line.points()[1], 
									endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
									endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
			modelLayer.draw();
		});
	}
	
	var setHandlerForTrigger = function() {
		startComponent.events.registerHandler('componentPositionChangedEvent', function() {
			returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
									startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT, 
									returnObj.line.points()[2], 
									returnObj.line.points()[3]]);
			modelLayer.draw();
		});
	}
	
	var getComponentHeight = function(component) {
		// determine height of the component, depending on the amount of input- and/or output-ports
		var elementHeight = ACS.vConst.COMPONENTVIEW_ELEMENTHEIGHT;
		if ((component.outputPortList.length > 3) || (component.inputPortList.length > 3)) {
			if (component.outputPortList.length > component.inputPortList.length) {
				elementHeight = elementHeight + (component.outputPortList.length-3) * ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP;
			} else {
				elementHeight = elementHeight + (component.inputPortList.length-3) * ACS.vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP;
			}
		}
		return elementHeight;
	}
	
	// public stuff
	var returnObj = ACS.channelView(modelLayer);

	returnObj.setStartComponent = function(c) {
		startComponent = c;
		returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
								returnObj.line.points()[2], 
								returnObj.line.points()[3]]);
		setHandlerforTrigger();
	}
	
	returnObj.getStartComponent = function(c) {
		return startComponent;
	}	
	
	returnObj.setEndComponent = function(c) {
		endComponent = c;
		returnObj.line.points([	returnObj.line.points()[0],
								returnObj.line.points()[1],
								endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
								endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
		setHandlerForListener();
	}
	
	returnObj.getEndComponent = function(c) {
		return endComponent;
	}
	
	returnObj.setEventChannel = function(c) {
		ec = c;
		startComponent = ec.trigger.getParentComponent();
		endComponent = ec.listener.getParentComponent();
		returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
								endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
								endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
		setHandlerForTrigger();
		setHandlerForListener();		
	}
	
	returnObj.getChannel = function() {
		return ec;
	}
	
	// constructor code
	returnObj.line.stroke(ACS.vConst.EVENTCHANNELVIEW_STROKECOLOR);
	if (ec && (ec !== {})) {
		returnObj.setEventChannel(ec);
	} else if (startComponent) {
		// draw a line with length == 0 - target coordinates will be set on mouse move
		returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
								startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT]);
		setHandlerForTrigger();	
	}
	
	return returnObj;
}