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
							clipBoard) { // ACS.clipBoard
							
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var listComponentViewList = []; // Array<ACS.listComponentView>
	var mainList = document.createElement('ul');	
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var reloadListView = function() {
		// remove old content
		listComponentViewList = [];
		$(mainList).empty();
		// load all components to list (first sensors, then processors, then actuators, to give the list-user a clearer idea of the dataflow)
		for (var i = 0; i < model.componentList.length; i++) {
			if (model.componentList[i].getType() === ACS.componentType.SENSOR) listComponentViewList.push(ACS.listComponentView(mainList, model.componentList[i], model));
		}
		for (var i = 0; i < model.componentList.length; i++) {
			if (model.componentList[i].getType() === ACS.componentType.PROCESSOR) listComponentViewList.push(ACS.listComponentView(mainList, model.componentList[i], model));
		}
		for (var i = 0; i < model.componentList.length; i++) {
			if (model.componentList[i].getType() === ACS.componentType.ACTUATOR) listComponentViewList.push(ACS.listComponentView(mainList, model.componentList[i], model));
		}		
	}
	
	// ********************************************** handlers ***********************************************************
	var modelChangedEventHandler = function() {
		reloadListView();
	}
	
	var componentAddedEventHandler = function() {

	}
	
	var componentRemovedEventHandler = function() {

	}
	
	var dataChannelAddedEventHandler = function() {

	}
	
	var dataChannelRemovedEventHandler = function() {

	}
	
	var eventChannelAddedEventHandler = function() {

	}
	
	var eventChannelRemovedEventHandler = function() {

	}
	
	var alertUserOfComponentCollectionMismatchEventHandler = function() {

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
	$('#' + containerId).append('<h1>List of components:</h1>');
	$(mainList).attr('id', 'componentList');
	$('#' + containerId).append(mainList);
	$('#' + containerId).append('<div id="arePropertyDiv">ARE properties (see property editor for details)</div>');
	$('#arePropertyDiv').attr('tabindex', '0');
	reloadListView();

	// register event-handlers
	model.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	model.events.registerHandler('componentAddedEvent', componentAddedEventHandler);
	model.events.registerHandler('componentRemovedEvent', componentRemovedEventHandler);
	model.events.registerHandler('dataChannelAddedEvent', dataChannelAddedEventHandler);
	model.events.registerHandler('dataChannelRemovedEvent', dataChannelRemovedEventHandler);
	model.events.registerHandler('eventChannelAddedEvent', eventChannelAddedEventHandler);
	model.events.registerHandler('eventChannelRemovedEvent', eventChannelRemovedEventHandler);
	model.events.registerHandler('alertUserOfComponentCollectionMismatchEvent', alertUserOfComponentCollectionMismatchEventHandler);
	

	
	return returnObj;
}