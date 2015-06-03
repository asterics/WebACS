/*
 * AsTeRICS - Assistive Technology Rapid Integration and Construction Set (http://www.asterics.org)
 * 
 * 
 * Y88b                     d88P      888               d8888  .d8888b.   .d8888b. 
 *  Y88b                   d88P       888              d88888 d88P  Y88b d88P  Y88b
 *   Y88b                 d88P        888             d88P888 888    888 Y88b.
 *    Y88b     d888b     d88P .d88b.  8888888b.      d88P 888 888         "Y888b.  
 *     Y88b   d88888b   d88P d8P  Y8b 888   Y88b    d88P  888 888            "Y88b.
 *      Y88b d88P Y88b d88P  88888888 888    888   d88P   888 888    888       "888
 *       Y88888P   Y88888P   Y8b.     888   d88P  d8888888888 Y88b  d88P Y88b  d88P
 *        Y888P     Y888P     "Y8888  8888888P"  d88P     888  "Y8888P"   "Y8888P"
 * 
 * Copyright 2015 Kompetenznetzwerk KI-I (http://ki-i.at)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
 ACS.eventChannelView = function(ec, // ACS.eventChannel
								startComponent, // ACS.component
								model, // ACS.model
								modelLayer) { // Kinetic.Layer
								
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var endComponent = null;
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	// ********************************************** private helper methods *********************************************
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
	
	var selectLine = function() {
		returnObj.line.stroke(ACS.vConst.EVENTCHANNELVIEW_SELECTEDSTROKECOLOR);
		returnObj.line.dashEnabled(true);
	}
	
	// ********************************************** handlers ***********************************************************
	var componentPositionChangedEventHandlerListener = function() {
			returnObj.line.points([	returnObj.line.points()[0], 
									returnObj.line.points()[1], 
									endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
									endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
	}
	
	var componentPositionChangedEventHandlerTrigger = function() {
			returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
									startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT, 
									returnObj.line.points()[2], 
									returnObj.line.points()[3]]);
	}
	
	var selectedEventHandler = function() {
		// make sure selection is only done once, if several channels are connected
		if (!returnObj.line.dashEnabled()) {
			selectLine();
			modelLayer.draw();
		}
	}

	var deSelectedEventHandler = function() {
		// make sure deSelection is only done once, if several channels are connected
		if (returnObj.line.dashEnabled()) {
			returnObj.line.stroke(ACS.vConst.EVENTCHANNELVIEW_STROKECOLOR);
			returnObj.line.dashEnabled(false);
			modelLayer.draw();
		}
	}

// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = ACS.channelView(model, modelLayer);
	
	returnObj.ecList = [];

	returnObj.setStartComponent = function(c) {
		startComponent = c;
		returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
								returnObj.line.points()[2], 
								returnObj.line.points()[3]]);
		startComponent.events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerTrigger);
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
		endComponent.events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerListener);
		// if there is no eventChannel connected yet (i.e. the channel has just been drawn), add a dummy-eventChannel object
		if (returnObj.ecList.length === 0) {
			returnObj.ecList.push(ACS.eventChannel('_dummy_'));
			returnObj.ecList[0].trigger = ACS.event('_dummy_', '', startComponent);
			returnObj.ecList[0].listener = ACS.event('_dummy_', '', endComponent);
			var action = ACS.addEventChannelAction(model, returnObj.ecList[0]);
			action.execute();
			returnObj.ecList[0].events.registerHandler('selectedEvent', selectedEventHandler);
			returnObj.ecList[0].events.registerHandler('deSelectedEvent', deSelectedEventHandler);		
		}
	}
	
	returnObj.getEndComponent = function(c) {
		return endComponent;
	}
	
	returnObj.destroy = function() {
		// remove all event handlers
		startComponent.events.removeHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerTrigger);
		endComponent.events.removeHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerListener);
		for (var i = 0; i < returnObj.ecList.length; i++) {
			returnObj.ecList[i].events.removeHandler('selectedEvent', selectedEventHandler);
			returnObj.ecList[i].events.removeHandler('deSelectedEvent', deSelectedEventHandler);
		}
		// destroy the line
		if (returnObj.line) returnObj.line.destroy();
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	returnObj.line.stroke(ACS.vConst.EVENTCHANNELVIEW_STROKECOLOR);
	if (ec && (ec !== {})) {
		// set start- and endComponent according to the eventChannel passed in the constructor
		returnObj.ecList.push(ec);
		startComponent = ec.trigger.getParentComponent();
		endComponent = ec.listener.getParentComponent();
		returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
								endComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_LISTENERPOSX,
								endComponent.getY() + getComponentHeight(endComponent) + ACS.vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT]);
		startComponent.events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerTrigger);
		endComponent.events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerListener);
		// check if channel is already selected on insert
		if (ec.getIsSelected()) selectLine();
	} else if (startComponent) {
		// if there is no complete channel yet (i.e. it is being drawn), draw a line with length == 0 - target coordinates will be set on mouse move
		returnObj.line.points([	startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT,
								startComponent.getX() + ACS.vConst.EVENTCHANNELVIEW_TRIGGERPOSX,
								startComponent.getY() + getComponentHeight(startComponent) + ACS.vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT]);
		startComponent.events.registerHandler('componentPositionChangedEvent', componentPositionChangedEventHandlerTrigger);
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
			var newStatus = !returnObj.ecList[0].getIsSelected();
			for (var i = 0; i < returnObj.ecList.length; i++) {
				returnObj.ecList[i].setIsSelected(newStatus);
				if (newStatus) {
					model.addItemToSelection(returnObj.ecList[i]);
				} else {
					model.removeItemFromSelection(returnObj.ecList[i]);
				}			
			}
		} else {
			// select only this channel
			model.deSelectAll();
			for (var i = 0; i < returnObj.ecList.length; i++) {
				model.addItemToSelection(returnObj.ecList[i]);
			}
		}
		e.cancelBubble = true;
	});
	// register event handlers for selecting
	for (var i = 0; i < returnObj.ecList.length; i++) {
		returnObj.ecList[i].events.registerHandler('selectedEvent', selectedEventHandler);
		returnObj.ecList[i].events.registerHandler('deSelectedEvent', deSelectedEventHandler);
	}

	return returnObj;
}