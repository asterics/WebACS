ACS.model = function(filename) { // String
	// private variables
	var componentCollection; // XML Document
	
	// private methods
	var loadDefaultComponentCollection = function() {
		var xmlObj;
		var httpRequest = new XMLHttpRequest(); 
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				xmlObj = httpRequest.responseXML;
			}
		}
		httpRequest.open('GET', ACS.mConst.MODEL_DEFAULTCOMPONENTCOLLECTION, false);
		httpRequest.send(null);
		return xmlObj; 
	}
	
	var getPortDataType = function(portDataTypeAsString) {
		switch (portDataTypeAsString) {
			case 'boolean':	return ACS.portDataType.BOOLEAN;
			case 'byte':	return ACS.portDataType.BYTE;
			case 'char':	return ACS.portDataType.CHAR;
			case 'integer':	return ACS.portDataType.INTEGER;
			case 'double':	return ACS.portDataType.DOUBLE;
			case 'string':	return ACS.portDataType.STRING;
		}
		return 0;
	}
	
	var findComponentInCollection = function(compTypeId) {
		var allComponents = componentCollection.getElementsByTagName('componentType');
		for (var j = 0; j < allComponents.length; j++) {
			if (allComponents.item(j).attributes.getNamedItem('id').textContent === compTypeId) return allComponents.item(j);
		}
		return null;
	}
	
	var loadComponentList = function(modelXML) {
		var componentList = [];
		var components_section = modelXML.getElementsByTagName('components').item(0); // needed so that the component-tags of the channels-sections are not confused with the components of the model
		var components = components_section.getElementsByTagName('component');
		if (components) {
			for (var i = 0; i < components.length; i++) {
				// find the current component's componentTypeId
				compTypeId = components.item(i).attributes.getNamedItem('type_id').textContent;
				// seek the component in the componentCollection, since not all information is saved in the model
				var fullComponent = findComponentInCollection(compTypeId);
				// TODO: if fullComponent was not found in collection, react adequately
				
				// find out the component's type:
				var compType = 0;
				switch (fullComponent.getElementsByTagName('type').item(0).textContent) {
					case 'actuator': 	compType = ACS.componentType.ACTUATOR;
										break;
					case 'processor':	compType = ACS.componentType.PROCESSOR;
										break;
					case 'sensor':		compType = ACS.componentType.SENSOR;
										break;					
				}
				
				// build the component-object:
				componentList[i] = ACS.component(	components.item(i).attributes.getNamedItem('id').textContent,
													compTypeId,
													components.item(i).getElementsByTagName('description').item(0).textContent,
													fullComponent.getElementsByTagName('singleton').item(0).textContent,
													parseInt(components.item(i).getElementsByTagName('layout').item(0).getElementsByTagName('posX').item(0).textContent),
													parseInt(components.item(i).getElementsByTagName('layout').item(0).getElementsByTagName('posY').item(0).textContent),
													compType,
													false);
															
				// build inputPortList:
				var inputPorts = fullComponent.getElementsByTagName('inputPort');
				for (var j = 0; j < inputPorts.length; j++) {
					var portDataType = getPortDataType(inputPorts.item(j).getElementsByTagName('dataType').item(0).textContent);
					// build the port object:
					componentList[i].inputPortList[j] = ACS.port(	inputPorts.item(j).attributes.getNamedItem('id').textContent,
																	componentList[i],
																	ACS.portType.INPUT,
																	portDataType,
																	j,
																	inputPorts.item(j).getElementsByTagName('mustBeConnected').item(0).textContent);
				}
				
				// build outputPortList:
				var outputPorts = fullComponent.getElementsByTagName('outputPort');
				for (var j = 0; j < outputPorts.length; j++) {
					var portDataType = getPortDataType(outputPorts.item(j).getElementsByTagName('dataType').item(0).textContent);
					// build the port object:
					componentList[i].outputPortList[j] = ACS.port(	outputPorts.item(j).attributes.getNamedItem('id').textContent,
																	componentList[i],
																	ACS.portType.OUTPUT,
																	portDataType,
																	j,
																	false);
				}
				
				// build listenEventList:
				var listenEvents = fullComponent.getElementsByTagName('eventListenerPort');
				for (var j = 0; j < listenEvents.length; j++) {
					componentList[i].listenEventList[j] = ACS.event(listenEvents.item(j).attributes.getNamedItem('id').textContent,
																	listenEvents.item(j).getElementsByTagName('description').item(0).textContent,
																	componentList[i]);
				}
				
				// build triggerEventList:
				var triggerEvents = fullComponent.getElementsByTagName('eventTriggererPort');
				for (var j = 0; j < triggerEvents.length; j++) {
					componentList[i].triggerEventList[j] = ACS.event(	triggerEvents.item(j).attributes.getNamedItem('id').textContent,
																		triggerEvents.item(j).getElementsByTagName('description').item(0).textContent,
																		componentList[i]);
				}

				// build propertyList:
				// TODO: redefine property class in architecture following specification of propertyType in bundle_model.xsd
				
				// build the gui object:
				if (components.item(i).getElementsByTagName('gui')) {
					var isExternal = false;
					if (fullComponent.getElementsByTagName('gui').item(0) && fullComponent.getElementsByTagName('gui').item(0).attributes.getNamedItem('IsExternalGUIElement')) {
						isExternal = fullComponent.getElementsByTagName('gui').item(0).attributes.getNamedItem('IsExternalGUIElement').textContent;
					}
					if (components.item(i).getElementsByTagName('gui').item(0) ) {
						componentList[i].gui = ACS.gui(	parseInt(components.item(i).getElementsByTagName('gui').item(0).getElementsByTagName('posX').item(0).textContent),
														parseInt(components.item(i).getElementsByTagName('gui').item(0).getElementsByTagName('posY').item(0).textContent),
														parseInt(components.item(i).getElementsByTagName('gui').item(0).getElementsByTagName('width').item(0).textContent),
														parseInt(components.item(i).getElementsByTagName('gui').item(0).getElementsByTagName('height').item(0).textContent),
														isExternal);
					}
				}
			}
		}
		return componentList;
	}
	
	var findComponentById = function(compList, compId) {
		for (var i = 0; i < compList.length; i++) {
			if (compList[i].getId() === compId) return compList[i];
		}
		return null;
	}
	
	var findPortById = function(comp, portId, isInputPort) {
		if (isInputPort) {
			var portList = comp.inputPortList;
		} else {
			var portList = comp.outputPortList;
		}
		for (var i = 0; i < portList.length; i++) {
			if (portList[i].getId() === portId) return portList[i];
		}
		return null;
	}
	
	var loadDataChannelList = function(modelXML, componentList) {
		var dataChannelList = [];
		var channels_section = modelXML.getElementsByTagName('channels').item(0);
		if (channels_section) {
			var channels = channels_section.getElementsByTagName('channel');
			for (var i = 0; i < channels.length; i++) {
				dataChannelList[i] = ACS.dataChannel(channels.item(i).attributes.getNamedItem('id').textContent);
				if (channels.item(i).getElementsByTagName('description').item(0)) dataChannelList[i].description = channels.item(i).getElementsByTagName('description').item(0).textContent;
				// get the source port:
				var sourceCompId = channels.item(i).getElementsByTagName('source').item(0).getElementsByTagName('component').item(0).attributes.getNamedItem('id').textContent;
				var sourcePortId = channels.item(i).getElementsByTagName('source').item(0).getElementsByTagName('port').item(0).attributes.getNamedItem('id').textContent;
				var sourceComponent = findComponentById(componentList, sourceCompId);
				dataChannelList[i].setOutputPort(findPortById(sourceComponent, sourcePortId, false));
				// get the target port:
				var targetCompId = channels.item(i).getElementsByTagName('target').item(0).getElementsByTagName('component').item(0).attributes.getNamedItem('id').textContent;
				var targetPortId = channels.item(i).getElementsByTagName('target').item(0).getElementsByTagName('port').item(0).attributes.getNamedItem('id').textContent;
				var targetComponent = findComponentById(componentList, targetCompId);
				dataChannelList[i].setInputPort(findPortById(targetComponent, targetPortId, true));
			}
		}
		return dataChannelList;
	}
	
	var findEventById = function(comp, eventId, isListener) {
		if (isListener) {
			var eventList = comp.listenEventList;
		} else {
			var eventList = comp.triggerEventList;
		}
		for (var i = 0; i < eventList.length; i++) {
			if (eventList[i].getId() === eventId) return eventList[i];
		}
		return null;
	}
	
	var loadEventChannelList = function(modelXML, componentList) {
		var eventChannelList = [];
		var eventChannels_section = modelXML.getElementsByTagName('eventChannels').item(0);
		if (eventChannels_section) {
			var eventChannels = eventChannels_section.getElementsByTagName('eventChannel');
			for (var i = 0; i < eventChannels.length; i++) {
				eventChannelList[i] = ACS.eventChannel(eventChannels.item(i).attributes.getNamedItem('id').textContent);
				if (eventChannels.item(i).getElementsByTagName('description').item(0)) eventChannelList[i].description = eventChannels.item(i).getElementsByTagName('description').item(0).textContent;
				// get the listener:
				var triggerCompId = eventChannels.item(i).getElementsByTagName('source').item(0).getElementsByTagName('component').item(0).attributes.getNamedItem('id').textContent;
				var triggerEventId = eventChannels.item(i).getElementsByTagName('source').item(0).getElementsByTagName('eventPort').item(0).attributes.getNamedItem('id').textContent;
				var triggerComponent = findComponentById(componentList, triggerCompId);
				eventChannelList[i].trigger = findEventById(triggerComponent, triggerEventId, false);
				// get the trigger:
				var listenerCompId = eventChannels.item(i).getElementsByTagName('target').item(0).getElementsByTagName('component').item(0).attributes.getNamedItem('id').textContent;
				var listenerEventId = eventChannels.item(i).getElementsByTagName('target').item(0).getElementsByTagName('eventPort').item(0).attributes.getNamedItem('id').textContent;
				var listenerComponent = findComponentById(componentList, listenerCompId);
				eventChannelList[i].listener = findEventById(listenerComponent, listenerEventId, true);
			}
		}
		return eventChannelList;
	}
	
	var loadMetaDataList = function(modelXML) {
		var metaDataList = [];
		var descSection = modelXML.getElementsByTagName('modelDescription').item(0);
		if (descSection) {
			var i = 0;
			if (descSection.getElementsByTagName('shortDescription').item(0)) {
				metaDataList[i] = ACS.metaData('shortDescription', descSection.getElementsByTagName('shortDescription').item(0).textContent);
				i++;
			}
			if (descSection.getElementsByTagName('requirements').item(0)) {
				metaDataList[i] = ACS.metaData('requirements', descSection.getElementsByTagName('requirements').item(0).textContent);
				i++;
			}
			if (descSection.getElementsByTagName('description').item(0)) {
				metaDataList[i] = ACS.metaData('description', descSection.getElementsByTagName('description').item(0).textContent);
				i++;
			}			
		}
		return metaDataList;
	}
	
	var compNameFound = function(name) {
		for (var i = 0; i < returnObj.componentList.length; i++) {
			if (returnObj.componentList[i].getId() === name) return true;
		}
		return false;
	}
	
	var nextCompNameNumber = function(compName) {
		var num = 1;
		while (compNameFound(compName + '.' + num)) num++;
		return num;
	}
	
	var positionTaken = function(pos) {
		for (var i = 0; i < returnObj.componentList.length; i++) {
			if ((returnObj.componentList[i].getX() === pos[0]) && (returnObj.componentList[i].getY() === pos[1])) return true;
		}
		return false;
	}
	
	var getFreePosition = function() {
		var pos = [10, 10];
		while (positionTaken(pos)) {
			pos[0] += 10;
			pos[1] += 10;
		}
		return pos;
	}
	
	// public stuff
	var returnObj = {};
	
	returnObj.componentList = []; // Array<ACS.component>
	returnObj.dataChannelList = []; // Array<ACS.dataChannel>
	returnObj.eventChannelList = []; // Array<ACS.eventChannel>
	returnObj.visualAreaMarkerList = []; // Array<ACS.visualAreaMarker>
	returnObj.undoStack = []; // Array<ACS.action>
	returnObj.redoStack = []; // Array<ACS.action>
	returnObj.metaDataList = []; // Array<ACS.metaData>
	returnObj.selectedItemsList = []; // Array<Object>
	returnObj.events = ACS.eventManager();
	
	returnObj.getFilename = function() {
		return filename;
	}
	
	returnObj.setFilename = function(newName) {
		filename = newName;
		this.events.fireEvent('filenameBeingChangedEvent');
	}

	returnObj.loadModel = function(loadFile) {
		if (loadFile) {
			returnObj.setFilename(loadFile.name);
			var fr = new FileReader();
			fr.onload = function(e) {
				var modelXML = $.parseXML(e.target.result);
				
				// TODO: write a function that checks whether the given file is a valid ACS-file and alert the user if not
				
				returnObj.componentList = loadComponentList(modelXML);
				returnObj.dataChannelList = loadDataChannelList(modelXML, returnObj.componentList);
				returnObj.eventChannelList = loadEventChannelList(modelXML, returnObj.componentList);
				//returnObj.visualAreaMarkerList = loadVisualAreaMarkerList(modelXML); // TODO: add visualAreaMarkers to XML first
				returnObj.metaDataList = loadMetaDataList(modelXML);
				returnObj.events.fireEvent('modelChangedEvent');
			};
			fr.readAsText(loadFile);
		}
	}
	
	returnObj.saveModel = function() {
		// TODO
	}
	
	returnObj.getModelXMLString = function() {
		return xmlString;
	}
	
	returnObj.addComponent = function(comp) { // ACS.component
		// TODO: this function might prove useless, in which case it can be removed
		this.events.fireEvent('componentAddedEvent');
	}
	
	returnObj.addComponentByName = function(compName) {
		// does nothing if compName does not exist
		var compTypeId = 'asterics.' + compName;
		var compXml = findComponentInCollection(compTypeId);
		if (compXml) {
			// find out the component's type:
			var compType = 0;
			switch (compXml.getElementsByTagName('type').item(0).textContent) {
				case 'actuator': 	compType = ACS.componentType.ACTUATOR;
									break;
				case 'processor':	compType = ACS.componentType.PROCESSOR;
									break;
				case 'sensor':		compType = ACS.componentType.SENSOR;
									break;					
			}
			// find a free position for the new component
			var pos = getFreePosition();
			// build the component-object:
			var newIdx = returnObj.componentList.length;
			returnObj.componentList[newIdx] = ACS.component(compName + '.' + nextCompNameNumber(compName),
															compTypeId,
															compXml.getElementsByTagName('description').item(0).textContent,
															compXml.getElementsByTagName('singleton').item(0).textContent,
															pos[0],
															pos[1],
															compType,
															true);
			// build inputPortList:
			var inputPorts = compXml.getElementsByTagName('inputPort');
			for (var j = 0; j < inputPorts.length; j++) {
				var portDataType = getPortDataType(inputPorts.item(j).getElementsByTagName('dataType').item(0).textContent);
				// build the port object:
				returnObj.componentList[newIdx].inputPortList[j] = ACS.port(inputPorts.item(j).attributes.getNamedItem('id').textContent,
																			returnObj.componentList[newIdx],
																			ACS.portType.INPUT,
																			portDataType,
																			j,
																			inputPorts.item(j).getElementsByTagName('mustBeConnected').item(0).textContent);
			}
			// build outputPortList:
			var outputPorts = compXml.getElementsByTagName('outputPort');
			for (var j = 0; j < outputPorts.length; j++) {
				var portDataType = getPortDataType(outputPorts.item(j).getElementsByTagName('dataType').item(0).textContent);
				// build the port object:
				returnObj.componentList[newIdx].outputPortList[j] = ACS.port(	outputPorts.item(j).attributes.getNamedItem('id').textContent,
																				returnObj.componentList[newIdx],
																				ACS.portType.OUTPUT,
																				portDataType,
																				j,
																				false);
			}
			// build listenEventList:
			var listenEvents = compXml.getElementsByTagName('eventListenerPort');
			for (var j = 0; j < listenEvents.length; j++) {
				returnObj.componentList[newIdx].listenEventList[j] = ACS.event(	listenEvents.item(j).attributes.getNamedItem('id').textContent,
																				listenEvents.item(j).getElementsByTagName('description').item(0).textContent,
																				returnObj.componentList[newIdx]);
			}	
			// build triggerEventList:
			var triggerEvents = compXml.getElementsByTagName('eventTriggererPort');
			for (var j = 0; j < triggerEvents.length; j++) {
				returnObj.componentList[newIdx].triggerEventList[j] = ACS.event(triggerEvents.item(j).attributes.getNamedItem('id').textContent,
																				triggerEvents.item(j).getElementsByTagName('description').item(0).textContent,
																				returnObj.componentList[newIdx]);
			}
			// build propertyList:
			// TODO: redefine property class in architecture following specification of propertyType in bundle_model.xsd
					
			// build the gui object:
			if (compXml.getElementsByTagName('gui').item(0)) {
				var isExternal = false;
				if (compXml.getElementsByTagName('gui').item(0).attributes.getNamedItem('IsExternalGUIElement')) {
					isExternal = compXml.getElementsByTagName('gui').item(0).attributes.getNamedItem('IsExternalGUIElement').textContent;
				}
				returnObj.componentList[newIdx].gui = ACS.gui(	0,
																0,
																parseInt(compXml.getElementsByTagName('gui').item(0).getElementsByTagName('width').item(0).textContent),
																parseInt(compXml.getElementsByTagName('gui').item(0).getElementsByTagName('height').item(0).textContent),
																isExternal);
			}
			this.events.fireEvent('componentAddedEvent');
		}
	}
	
	returnObj.removeComponent = function(comp) { // ACS.component

		this.events.fireEvent('componentRemovedEvent');
		return removedComponent;
	}
	
	returnObj.addDataChannel = function(ch) { // ACS.channel
		returnObj.dataChannelList.push(ch);
		this.events.fireEvent('dataChannelAddedEvent');
	}
	
	returnObj.removeDataChannel = function(ch) { // ACS.channel
		returnObj.dataChannelList.splice(returnObj.dataChannelList.indexOf(ch), 1);
		this.events.fireEvent('dataChannelRemovedEvent');
	}	

	returnObj.addEventChannel = function(ch) { // ACS.channel
		returnObj.eventChannelList.push(ch);
		this.events.fireEvent('eventChannelAddedEvent');
	}
	
	returnObj.removeEventChannel = function(ch) { // ACS.channel
		returnObj.eventChannelList.splice(returnObj.dataChannelList.indexOf(ch), 1);
		this.events.fireEvent('eventChannelRemovedEvent');
	}		
	
	returnObj.getComponentCollection = function() {
		return componentCollection; // (XML document)
	}
	
	returnObj.loadComponentCollection = function(loadFile) { // File
		// loads a component collection from a user-chosen file
		
		// componentCollection = ...
		this.events.fireEvent('componentCollectionChangedEvent');
		return componentCollection; // (XML document)
	}
	
	// constructor code
	componentCollection = loadDefaultComponentCollection();
	log.debug('the component-id of the first component in the collection is "'+componentCollection.getElementsByTagName('componentType').item(0).attributes.getNamedItem('id').nodeValue+'"');
	returnObj.events.fireEvent('componentCollectionChangedEvent');
	
	return returnObj;
}