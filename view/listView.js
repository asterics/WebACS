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
 
 ACS.listView = function(	containerId, // String
							model, // ACS.model
							clipBoard, // ACS.clipBoard
							tabId, // String
							modelTabPanel) { // ACS.tabPanel
							
// ***********************************************************************************************************************
// ************************************************** static methods *****************************************************
// ***********************************************************************************************************************
	ACS.listView.makeCancelButton = function(model) {
		var $cancelBtn = $(document.createElement('button'));
		$cancelBtn.attr('type', 'button');
		$cancelBtn.text('Cancel channel');
		$cancelBtn.click(function() {
			// drop the started channel
			var ch = model.undoStack.pop();
			ch.undo();
		});
		return $cancelBtn;		
	}
							
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var sensorViewList = []; // Array<ACS.listComponentView>
	var processorViewList = []; // Array<ACS.listComponentView>
	var actuatorViewList = []; // Array<ACS.listComponentView>
	var sensorList = document.createElement('ul');
	var processorList = document.createElement('ul');
	var actuatorList = document.createElement('ul');	
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var reloadListView = function() {
		// remove old content
		sensorViewList = [];
		processorViewList = [];
		actuatorViewList = [];
		$(sensorList).empty();
		$(processorList).empty();
		$(actuatorList).empty();
		// load all components to their dedicated lists (first sensors, then processors, then actuators, to give the list-user a clearer idea of the dataflow)
		for (var i = 0; i < model.componentList.length; i++) {
			switch (model.componentList[i].getType()) {
				case ACS.componentType.SENSOR: sensorViewList.push(ACS.listComponentView(containerId, sensorList, model.componentList[i], model)); break;
				case ACS.componentType.PROCESSOR: processorViewList.push(ACS.listComponentView(containerId, processorList, model.componentList[i], model)); break;
				case ACS.componentType.ACTUATOR: actuatorViewList.push(ACS.listComponentView(containerId, actuatorList, model.componentList[i], model)); break;
			}
		}
	}
	
	var focusSelectedItem = function() {
		// select the selected item; if more than one item is selected, select only the first one in the list; 
		// in the case of a channel, select the outport of the "left" component;
		if (model.selectedItemsList.length > 0)	{
			if (typeof(model.selectedItemsList[0].getComponentTypeId) !== 'undefined') {
				// must be a component
				var done = false;
				var i = 0;
				while (!done && (i < sensorViewList.length)) {
					if (sensorViewList[i].getComponent() === model.selectedItemsList[0]) {
						sensorViewList[i].focusComponent();
						done = true;
					}
					i++;
				}
				i = 0;
				while (!done && (i < processorViewList.length)) {
					if (processorViewList[i].getComponent() === model.selectedItemsList[0]) {
						processorViewList[i].focusComponent();
						done = true;
					}
					i++;
				}
				i = 0;
				while (!done && (i < actuatorViewList.length)) {
					if (actuatorViewList[i].getComponent() === model.selectedItemsList[0]) {
						actuatorViewList[i].focusComponent();
						done = true;
					}
					i++;
				}				
			} else if (typeof(model.selectedItemsList[0].startComponent) !== 'undefined') {
				// must be an eventChannel
				var done = false;
				var i = 0;
				while (!done && (i < sensorViewList.length)) {
					if (sensorViewList[i].getComponent() === model.selectedItemsList[0].startComponent) {
						sensorViewList[i].focusOutgoingEventConnection(model.selectedItemsList[0]);
						done = true;
					}
					i++;
				}
				i = 0;
				while (!done && (i < processorViewList.length)) {
					if (processorViewList[i].getComponent() === model.selectedItemsList[0].startComponent) {
						processorViewList[i].focusOutgoingEventConnection(model.selectedItemsList[0]);
						done = true;
					}
					i++;
				}
				i = 0;
				while (!done && (i < actuatorViewList.length)) {
					if (actuatorViewList[i].getComponent() === model.selectedItemsList[0].startComponent) {
						actuatorViewList[i].focusOutgoingEventConnection(model.selectedItemsList[0]);
						done = true;
					}
					i++;
				}									
			} else if (typeof(model.selectedItemsList[0].getInputPort) !== 'undefined') {
				// must be a dataChannel
				var done = false;
				var i = 0;
				while (!done && (i < sensorViewList.length)) {
					if (sensorViewList[i].getComponent() === model.selectedItemsList[0].getOutputPort().getParentComponent()) {
						sensorViewList[i].focusOutgoingDataChannel(model.selectedItemsList[0]);
						done = true;
					}
					i++;
				}
				i = 0;
				while (!done && (i < processorViewList.length)) {
					if (processorViewList[i].getComponent() === model.selectedItemsList[0].getOutputPort().getParentComponent()) {
						processorViewList[i].focusOutgoingDataChannel(model.selectedItemsList[0]);
						done = true;
					}
					i++;
				}
				i = 0;
				while (!done && (i < actuatorViewList.length)) {
					if (actuatorViewList[i].getComponent() === model.selectedItemsList[0].getOutputPort().getParentComponent()) {
						actuatorViewList[i].focusOutgoingDataChannel(model.selectedItemsList[0]);
						done = true;
					}
					i++;
				}												
			}
		}
	}
	
	var removeComponent = function(viewList) {
		var found = true;
		var i = 0;
		while (found && (i < viewList.length)) {
			found = false;
			for (var j = 0; j < model.componentList.length; j++) {
				if (viewList[i].getComponent() === model.componentList[j]) {
					found = true;
				}
			}
			if (!found) {
				viewList[i].destroy();
				viewList.splice(i, 1);
			}
			i++;
		}
		return !found;
	}
	
	var removeDataChannelFromList = function(viewList, comp, channel, removeAtOutputPort) {
		for (var i = 0; i < viewList.length; i++) {
			if (viewList[i].getComponent() === comp) {
				if (removeAtOutputPort) {
					viewList[i].removeOutgoingDataChannel(channel);
				} else {
					viewList[i].removeIncomingDataChannel(channel);
				}
				return true;
			}
		}
		return false;
	}
	
	var removeEventChannelFromList = function(viewList, comp, channel, removeAtOutputPort) {
		for (var i = 0; i < viewList.length; i++) {
			if (viewList[i].getComponent() === comp) {
				if (removeAtOutputPort) {
					viewList[i].removeOutgoingEventChannel(channel);
				} else {
					viewList[i].removeIncomingEventChannel(channel);
				}
				return true;
			}
		}
		return false;
	}	
	
	var findListComponentView = function(comp) {
		var seekList = [];
		switch (comp.getType()) {
			case ACS.componentType.SENSOR: seekList = sensorViewList; break;
			case ACS.componentType.PROCESSOR: seekList = processorViewList; break;
			case ACS.componentType.ACTUATOR: seekList = actuatorViewList; break;			
		}
		for (var i = 0; i < seekList.length; i++) {
			if (seekList[i].getComponent() === comp) return seekList[i];
		}
		return null;
	}
	
	// ********************************************** handlers ***********************************************************
	var modelChangedEventHandler = function() {
		reloadListView();
	}
	
	var componentAddedEventHandler = function() {
		switch (model.componentList[model.componentList.length - 1].getType()) {
			case ACS.componentType.SENSOR: sensorViewList.push(ACS.listComponentView(containerId, sensorList, model.componentList[model.componentList.length - 1], model)); break;
			case ACS.componentType.PROCESSOR: processorViewList.push(ACS.listComponentView(containerId, processorList, model.componentList[model.componentList.length - 1], model)); break;
			case ACS.componentType.ACTUATOR: actuatorViewList.push(ACS.listComponentView(containerId, actuatorList, model.componentList[model.componentList.length - 1], model)); break;
		}
	}
	
	var componentRemovedEventHandler = function() {
		if (!removeComponent(sensorViewList)) {
			if (!removeComponent(processorViewList)) {
				removeComponent(actuatorViewList);
			}
		}	
	}
	
	var dataChannelCompletedEventHandler = function() {
		findListComponentView(model.dataChannelList[model.dataChannelList.length - 1].getOutputPort().getParentComponent()).addOutgoingDataChannel(model.dataChannelList[model.dataChannelList.length - 1]);
		findListComponentView(model.dataChannelList[model.dataChannelList.length - 1].getOutputPort().getParentComponent()).focusOutgoingDataChannel(model.dataChannelList[model.dataChannelList.length - 1]);
		findListComponentView(model.dataChannelList[model.dataChannelList.length - 1].getInputPort().getParentComponent()).addIncomingDataChannel(model.dataChannelList[model.dataChannelList.length - 1]);
		// delete pending action
		$('#' + containerId + '_actionInfo').text('none');
		$('.' + containerId + '_dataInPortBtn').attr('disabled', '');
		$('.' + containerId + '_dataOutPortBtn').removeAttr('disabled');
		$('.' + containerId + '_eventInPortBtn').attr('disabled', '');
		$('.' + containerId + '_eventOutPortBtn').removeAttr('disabled');
	}

	var dataChannelAddedEventHandler = function() {
		if (model.dataChannelList[model.dataChannelList.length - 1].getInputPort()) { // channel is already complete - must be an undo
			dataChannelCompletedEventHandler();
		} else {
			// register handler for DataChannel completion
			model.dataChannelList[model.dataChannelList.length - 1].events.registerHandler('dataChannelCompletedEvent', dataChannelCompletedEventHandler);
			// set the pending action
			$('#' + containerId + '_actionInfo').text('A new data channel has been started. Please complete the channel by using the "connect here"-button at a matching input port.');
			$('#' + containerId + '_actionInfo').append(ACS.listView.makeCancelButton(model));
			$('.' + containerId + '_dataInPortBtn').removeAttr('disabled');
			$('.' + containerId + '_dataOutPortBtn').attr('disabled', '');
			$('.' + containerId + '_eventInPortBtn').attr('disabled', '');
			$('.' + containerId + '_eventOutPortBtn').attr('disabled', '');
			$('#' + containerId + '_actionInfo').focus();
		}
	}
	
	var dataChannelRemovedEventHandler = function() {
		if (typeof model.recentlyRemovedChannel.startComponent === 'undefined') { // if the recently removed channel is a dataChannel
			if (model.recentlyRemovedChannel.getInputPort()) { // if the removed channel was a completed channel
				// remove from outputPort
				switch (model.recentlyRemovedChannel.getOutputPort().getParentComponent().getType()) {
					case ACS.componentType.SENSOR: removeDataChannelFromList(sensorViewList, model.recentlyRemovedChannel.getOutputPort().getParentComponent(), model.recentlyRemovedChannel, true); break;
					case ACS.componentType.PROCESSOR: removeDataChannelFromList(processorViewList, model.recentlyRemovedChannel.getOutputPort().getParentComponent(), model.recentlyRemovedChannel, true); break;
					case ACS.componentType.ACTUATOR: removeDataChannelFromList(actuatorViewList, model.recentlyRemovedChannel.getOutputPort().getParentComponent(), model.recentlyRemovedChannel, true); break;
				}
				// remove from inputPort
				switch (model.recentlyRemovedChannel.getInputPort().getParentComponent().getType()) {
					case ACS.componentType.SENSOR: removeDataChannelFromList(sensorViewList, model.recentlyRemovedChannel.getInputPort().getParentComponent(), model.recentlyRemovedChannel, false); break;
					case ACS.componentType.PROCESSOR: removeDataChannelFromList(processorViewList, model.recentlyRemovedChannel.getInputPort().getParentComponent(), model.recentlyRemovedChannel, false); break;
					case ACS.componentType.ACTUATOR: removeDataChannelFromList(actuatorViewList, model.recentlyRemovedChannel.getInputPort().getParentComponent(), model.recentlyRemovedChannel, false); break;
				}
			} else { // an incomplete channel has been dropped
				$('#' + containerId + '_actionInfo').text('none');
				$('.' + containerId + '_dataInPortBtn').attr('disabled', '');
				$('.' + containerId + '_dataOutPortBtn').removeAttr('disabled');
				$('.' + containerId + '_eventInPortBtn').attr('disabled', '');
				$('.' + containerId + '_eventOutPortBtn').removeAttr('disabled');
			}
		}
	}

	var eventChannelCompletedEventHandler = function() {
		findListComponentView(model.eventChannelList[model.eventChannelList.length - 1].startComponent).addOutgoingEventChannel(model.eventChannelList[model.eventChannelList.length - 1]);
		findListComponentView(model.eventChannelList[model.eventChannelList.length - 1].startComponent).focusOutgoingEventConnection(model.eventChannelList[model.eventChannelList.length - 1]);
		findListComponentView(model.eventChannelList[model.eventChannelList.length - 1].endComponent).addIncomingEventChannel(model.eventChannelList[model.eventChannelList.length - 1]);
		// delete pending action
		$('#' + containerId + '_actionInfo').text('none');
		$('.' + containerId + '_dataInPortBtn').attr('disabled', '');
		$('.' + containerId + '_dataOutPortBtn').removeAttr('disabled');
		$('.' + containerId + '_eventInPortBtn').attr('disabled', '');
		$('.' + containerId + '_eventOutPortBtn').removeAttr('disabled');
	}
	
	var eventChannelAddedEventHandler = function() {
		if (model.eventChannelList[model.eventChannelList.length - 1].endComponent) { // channel is already complete - must be an undo
			eventChannelCompletedEventHandler();
		} else {		
			// register handler for EventChannel completion
			model.eventChannelList[model.eventChannelList.length - 1].events.registerHandler('eventChannelCompletedEvent', eventChannelCompletedEventHandler);
			// set the pending action
			$('#' + containerId + '_actionInfo').text('A new event channel has been started. Please complete the channel by using the "connect here"-button at an event input port.');
			$('#' + containerId + '_actionInfo').append(ACS.listView.makeCancelButton(model));
			$('.' + containerId + '_dataInPortBtn').attr('disabled', '');
			$('.' + containerId + '_dataOutPortBtn').attr('disabled', '');
			$('.' + containerId + '_eventInPortBtn').removeAttr('disabled');
			$('.' + containerId + '_eventOutPortBtn').attr('disabled', '');
			$('#' + containerId + '_actionInfo').focus();
		}
	}
	
	var eventChannelRemovedEventHandler = function() {
		if (typeof model.recentlyRemovedChannel.startComponent !== 'undefined') { // if the recently removed channel is an eventChannel	
			if (model.recentlyRemovedChannel.endComponent) { // if the removed channel was a completed channel
				// remove from outputPort
				switch (model.recentlyRemovedChannel.startComponent.getType()) {
					case ACS.componentType.SENSOR: removeEventChannelFromList(sensorViewList, model.recentlyRemovedChannel.startComponent, model.recentlyRemovedChannel, true); break;
					case ACS.componentType.PROCESSOR: removeEventChannelFromList(processorViewList, model.recentlyRemovedChannel.startComponent, model.recentlyRemovedChannel, true); break;
					case ACS.componentType.ACTUATOR: removeEventChannelFromList(actuatorViewList,model.recentlyRemovedChannel.startComponent,  model.recentlyRemovedChannel, true); break;
				}
				// remove from inputPort
				switch (model.recentlyRemovedChannel.endComponent.getType()) {
					case ACS.componentType.SENSOR: removeEventChannelFromList(sensorViewList, model.recentlyRemovedChannel.endComponent, model.recentlyRemovedChannel, false); break;
					case ACS.componentType.PROCESSOR: removeEventChannelFromList(processorViewList, model.recentlyRemovedChannel.endComponent, model.recentlyRemovedChannel, false); break;
					case ACS.componentType.ACTUATOR: removeEventChannelFromList(actuatorViewList, model.recentlyRemovedChannel.endComponent, model.recentlyRemovedChannel, false); break;
				}
			} else { // an incomplete channel has been dropped
				$('#' + containerId + '_actionInfo').text('none');
				$('.' + containerId + '_dataInPortBtn').attr('disabled', '');
				$('.' + containerId + '_dataOutPortBtn').removeAttr('disabled');
				$('.' + containerId + '_eventInPortBtn').attr('disabled', '');
				$('.' + containerId + '_eventOutPortBtn').removeAttr('disabled');
			}
		}
	}
	
	var tabSwitchedEventHandler = function() {
		if ($('#' + tabId).attr('aria-selected')) focusSelectedItem();
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.getModel = function() {
		return model;
	}
	
	returnObj.getContainerId = function() {
		return containerId;
	}
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	$('#' + containerId).append('<h2>Action pending:</h2>');
	$('#' + containerId).append('<div id="' + containerId + '_actionInfo" class="additionalFocusableElement" tabindex="0">none</div>');
	$('#' + containerId).append('<h2>List of components:</h2>');
	$('#' + containerId).append('<h3>Sensors:</h3>');
	$(sensorList).attr('id', containerId + '_sensorList');
	$('#' + containerId).append(sensorList);
	$('#' + containerId).append('<h3>Processors:</h3>');
	$(processorList).attr('id', containerId + '_processorList');
	$('#' + containerId).append(processorList);
	$('#' + containerId).append('<h3>Actuators:</h3>');
	$(actuatorList).attr('id', containerId + '_actuatorList');
	$('#' + containerId).append(actuatorList);
	$('#' + containerId).append('<div id="' + containerId + '_arePropertyDiv" class="additionalFocusableElement" tabindex="0">ARE properties (see property editor for details)</div>');
	reloadListView();

	// register event-handlers
	model.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	model.events.registerHandler('componentAddedEvent', componentAddedEventHandler);
	model.events.registerHandler('componentRemovedEvent', componentRemovedEventHandler);
	model.events.registerHandler('dataChannelAddedEvent', dataChannelAddedEventHandler);
	model.events.registerHandler('dataChannelRemovedEvent', dataChannelRemovedEventHandler);
	model.events.registerHandler('eventChannelAddedEvent', eventChannelAddedEventHandler);
	model.events.registerHandler('eventChannelRemovedEvent', eventChannelRemovedEventHandler);
	modelTabPanel.events.registerHandler('tabSwitchedEvent', tabSwitchedEventHandler);
	
	return returnObj;
}