ACS.eventChannelView = function(ec, // ACS.eventChannel
								modelLayer) { // Kinetic.Layer
	// private variables
	var startComponent = null;
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
		var elementHeight = 120;
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
	
	returnObj.setEndComponent = function(c) {
		endComponent = c;
		returnObj.line.points([	returnObj.line.points()[0],
								returnObj.line.points()[1],
								endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
								endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
		setHandlerForListener();
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
	returnObj.line.stroke('rgb(229, 117, 117)');
	if (ec !== {}) {
		if ((ec.trigger) && (ec.trigger !== {})) startComponent = ec.trigger.getParentComponent();
		if ((ec.listener) && (ec.listener !== {})) endComponent = ec.listener.getParentComponent();
	}
	if (startComponent) {
		if (endComponent) { // if we already have both ends of the channel
			returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
									startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
									endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
									endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
			setHandlerForListener();
		} else {
			// draw a line with length == 0 - target coordinates will be set on mouse move
			returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
									startComponent.getY() + getComponentHeight(ec.trigger.getParentComponent()) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
									startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
									startComponent.getY() + getComponentHeight(ec.trigger.getParentComponent()) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT]);
		}
		setHandlerForTrigger();	
	}
	
	return returnObj;
}