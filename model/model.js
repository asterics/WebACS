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
	
	var getDataType = function(dataTypeAsString) {
		switch (dataTypeAsString) {
			case 'boolean':	return ACS.dataType.BOOLEAN;
			case 'byte':	return ACS.dataType.BYTE;
			case 'char':	return ACS.dataType.CHAR;
			case 'integer':	return ACS.dataType.INTEGER;
			case 'double':	return ACS.dataType.DOUBLE;
			case 'string':	return ACS.dataType.STRING;
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
				// check if the component has a description
				var description = null;
				if (components.item(i).getElementsByTagName('description')) description = components.item(i).getElementsByTagName('description').item(0).textContent;
				// seek the component in the componentCollection, since not all information is saved in the model
				var fullComponent = findComponentInCollection(compTypeId);
				if (fullComponent === null) { // i.e. component was not found in componentCollection
					componentList[i] = ACS.component(	components.item(i).attributes.getNamedItem('id').textContent,
														compTypeId,
														'',
														false,
														0,
														0,
														0,
														false,
														false);
				} else {
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
														description,
														fullComponent.getElementsByTagName('singleton').item(0).textContent,
														parseInt(components.item(i).getElementsByTagName('layout').item(0).getElementsByTagName('posX').item(0).textContent),
														parseInt(components.item(i).getElementsByTagName('layout').item(0).getElementsByTagName('posY').item(0).textContent),
														compType,
														false,
														true);
																
					// build inputPortList:
					var inputPortsFull = fullComponent.getElementsByTagName('inputPort');
					var inputPortsModel = components.item(i).getElementsByTagName('inputPort');
					var numInPorts = inputPortsFull.length;
					if (numInPorts < inputPortsModel.length) numInPorts = inputPortsModel.length; // in case the amount of ports has been reduced by developer in component collection
					for (var j = 0; j < numInPorts; j++) {
						if (inputPortsFull[j]) {
							var portDataType = getDataType(inputPortsFull.item(j).getElementsByTagName('dataType').item(0).textContent);
							var portTypeId = '';
							if (inputPortsModel.item(j)) {
								portTypeId = inputPortsModel.item(j).attributes.getNamedItem('portTypeID').textContent;
							} else {
								// in case new ports have been added to component in collection
								portTypeId = inputPortsFull.item(j).attributes.getNamedItem('id').textContent;
								componentList[i].matchesComponentCollection = false;
							}
							// build the port object:
							componentList[i].inputPortList[j] = ACS.port(	portTypeId,
																			componentList[i],
																			ACS.portType.INPUT,
																			portDataType,
																			j,
																			inputPortsFull.item(j).getElementsByTagName('mustBeConnected').item(0).textContent);
							// TODO: add the port's properties
							if (inputPortsModel.item(j).attributes.getNamedItem('sync')) componentList[i].inputPortList[j].sync = inputPortsModel.item(j).attributes.getNamedItem('sync').textContent;
						} else { // if the port was deleted by developer
							componentList[i].matchesComponentCollection = false;
						}
					}
					
					// build outputPortList:
					var outputPortsFull = fullComponent.getElementsByTagName('outputPort');
					var outputPortsModel = components.item(i).getElementsByTagName('outputPort');
					var numOutPorts = outputPortsFull.length;
					if (numOutPorts < outputPortsModel.length) numOutPorts = outputPortsModel.length; // in case the amount of ports has been reduced by developer in component collection
					for (var j = 0; j < numOutPorts; j++) {
						if (outputPortsFull[j]) {
							var portDataType = getDataType(outputPortsFull.item(j).getElementsByTagName('dataType').item(0).textContent);
							var portTypeId = '';
							if (outputPortsModel.item(j)) {
								portTypeId = outputPortsModel.item(j).attributes.getNamedItem('portTypeID').textContent;
							} else {
								// in case new ports have been added to component in collection
								portTypeId = outputPortsFull.item(j).attributes.getNamedItem('id').textContent;
								componentList[i].matchesComponentCollection = false;
							}
							// build the port object:
							componentList[i].outputPortList[j] = ACS.port(	portTypeId,
																			componentList[i],
																			ACS.portType.OUTPUT,
																			portDataType,
																			j,
																			false);
							// TODO: add the port's properties
						} else { // if the port was deleted by developer
							componentList[i].matchesComponentCollection = false;
						}
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
					var propertiesFull = fullComponent.getElementsByTagName('property');
					var propertiesModel = components.item(i).getElementsByTagName('property');
					var numProps = propertiesFull.length;
					if (numProps < propertiesModel.length) numProps = propertiesModel.length; // in case the amount of properties has been reduced by developer in component collection
					for (j = 0; j < numProps; j++) {
						if (propertiesFull[j]) {
							var propertyValue = '';
							if (propertiesModel.item(j)) {
								propertyValue = propertiesModel.item(j).attributes.getNamedItem('value').textContent;
							} else {
								// in case a new property has been added to component in collection
								propertyValue = propertiesFull.item(j).attributes.getNamedItem('value').textContent;
								componentList[i].matchesComponentCollection = false;
							}
							componentList[i].propertyList.push(ACS.property(propertiesFull.item(j).attributes.getNamedItem('name').textContent, 
																			getDataType(propertiesFull.item(j).attributes.getNamedItem('type').textContent), 
																			propertyValue));
							if (propertiesFull.item(j).attributes.getNamedItem('description'))
								componentList[i].propertyList[componentList[i].propertyList.length - 1].description = propertiesFull.item(j).attributes.getNamedItem('description').textContent;
							if (propertiesFull.item(j).attributes.getNamedItem('combobox'))
								componentList[i].propertyList[componentList[i].propertyList.length - 1].combobox = propertiesFull.item(j).attributes.getNamedItem('combobox').textContent;
							if (propertiesFull.item(j).attributes.getNamedItem('getStringList'))
								componentList[i].propertyList[componentList[i].propertyList.length - 1].getStringList = propertiesFull.item(j).attributes.getNamedItem('getStringList').textContent;
						} else { // if the property was deleted by developer
							componentList[i].matchesComponentCollection = false;
						}
					}
					
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
				dataChannelList.push(ACS.dataChannel(channels.item(i).attributes.getNamedItem('id').textContent));
				if (channels.item(i).getElementsByTagName('description').item(0)) dataChannelList[dataChannelList.length-1].description = channels.item(i).getElementsByTagName('description').item(0).textContent;
				// get the source port:
				var sourceCompId = channels.item(i).getElementsByTagName('source').item(0).getElementsByTagName('component').item(0).attributes.getNamedItem('id').textContent;
				var sourcePortId = channels.item(i).getElementsByTagName('source').item(0).getElementsByTagName('port').item(0).attributes.getNamedItem('id').textContent;
				var sourceComponent = findComponentById(componentList, sourceCompId);
				if (sourceComponent && (sourceComponent.foundInComponentCollection)) {
					var outPort = findPortById(sourceComponent, sourcePortId, false);
					if (outPort) {
						dataChannelList[dataChannelList.length-1].setOutputPort(outPort);
						// get the target port:
						var targetCompId = channels.item(i).getElementsByTagName('target').item(0).getElementsByTagName('component').item(0).attributes.getNamedItem('id').textContent;
						var targetPortId = channels.item(i).getElementsByTagName('target').item(0).getElementsByTagName('port').item(0).attributes.getNamedItem('id').textContent;
						var targetComponent = findComponentById(componentList, targetCompId);
						if (targetComponent && (targetComponent.foundInComponentCollection)) {
							var inPort = findPortById(targetComponent, targetPortId, true);
							if (inPort) {
								dataChannelList[dataChannelList.length-1].setInputPort(inPort);
							} else {
								// in case the matching inputPort was not found on the component, delete the channel again
								dataChannelList.pop();
							}
						} else {
							// in case the target component was not found in the component collection, delete the channel again
							dataChannelList.pop();
						}
					} else {
						// in case the matching outputPort was not found on the component, delete the channel again
						dataChannelList.pop();
					}
				} else {
					// in case the source component was not found in the component collection, delete the channel again
					dataChannelList.pop();
				}
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
	
	var loadModelGui = function(modelXML) {
		if (modelXML.getElementsByTagName('modelGUI')) {
			var modelGui = modelXML.getElementsByTagName('modelGUI').item(0);
			returnObj.modelGui.setDecoration(modelGui.getElementsByTagName('Decoration').item(0).textContent);
			returnObj.modelGui.setDecoration(modelGui.getElementsByTagName('Fullscreen').item(0).textContent);
			returnObj.modelGui.setDecoration(modelGui.getElementsByTagName('AlwaysOnTop').item(0).textContent);
			returnObj.modelGui.setDecoration(modelGui.getElementsByTagName('ToSystemTray').item(0).textContent);
			returnObj.modelGui.setDecoration(modelGui.getElementsByTagName('ShopControlPanel').item(0).textContent); // TODO: change to "ShowControlPanel", when changed in XML
			var guiWindow = modelGui.getElementsByTagName('AREGUIWindow').item(0);
			returnObj.modelGui.areGuiWindow.x = guiWindow.getElementsByTagName('posX').item(0).textContent;
			returnObj.modelGui.areGuiWindow.y = guiWindow.getElementsByTagName('posY').item(0).textContent;
			returnObj.modelGui.areGuiWindow.width = guiWindow.getElementsByTagName('width').item(0).textContent;
			returnObj.modelGui.areGuiWindow.height = guiWindow.getElementsByTagName('height').item(0).textContent;
		}
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
	
	var generateModelName = function() {
		var time = new Date();
		var d = time.getDay();
		var m = time.getMonth();
		var y = time.getFullYear();
		var h = time.getHours();
		var min = time.getMinutes();
		if (d < 10) d = '0' + d;
		if (m < 10) m = '0' + m;
		if (h < 10) h = '0' + h;
		if (min < 10) min = '0' + min;
		return d + '/' + m + '/' + y + '_' + h + min;
	}
	
	// public stuff
	var returnObj = {};
	
	returnObj.componentList = []; // Array<ACS.component>
	returnObj.dataChannelList = []; // Array<ACS.dataChannel>
	returnObj.eventChannelList = []; // Array<ACS.eventChannel>
	returnObj.modelGui = ACS.modelGui();
	returnObj.visualAreaMarkerList = []; // Array<ACS.visualAreaMarker>
	returnObj.undoStack = []; // Array<ACS.action>
	returnObj.redoStack = []; // Array<ACS.action>
	returnObj.metaDataList = []; // Array<ACS.metaData>
	returnObj.selectedItemsList = []; // Array<Object>
	returnObj.events = ACS.eventManager();
	returnObj.modelName = generateModelName();
	returnObj.acsVersion = ACS.mConst.MODELGUI_ACSVERSION;
	returnObj.hasBeenChanged = false;
	
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
				
				returnObj.modelName = modelXML.getElementsByTagName('model').item(0).attributes.getNamedItem('modelName').textContent;
				returnObj.acsVersion = modelXML.getElementsByTagName('model').item(0).attributes.getNamedItem('version').textContent;
				returnObj.componentList = loadComponentList(modelXML);
				returnObj.dataChannelList = loadDataChannelList(modelXML, returnObj.componentList);
				returnObj.eventChannelList = loadEventChannelList(modelXML, returnObj.componentList);
				loadModelGui(modelXML);
				//returnObj.visualAreaMarkerList = loadVisualAreaMarkerList(modelXML); // TODO: add visualAreaMarkers to XML first
				returnObj.metaDataList = loadMetaDataList(modelXML);
				returnObj.events.fireEvent('modelChangedEvent');
			};
			fr.readAsText(loadFile);
			returnObj.hasBeenChanged = false;
		}
	}
	
	returnObj.saveModel = function() {
		var saveString = '<?xml version="1.0"?>\r<model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" modelName="' + returnObj.modelName + '" version="' + returnObj.acsVersion + '">\r';
		saveString += '\t<modelDescription>\r';
		for (var i = 0; i < returnObj.metaDataList.length; i++) {
			saveString += '\t\t<' + returnObj.metaDataList[i].getKey() + '>' + returnObj.metaDataList[i].value + '<\\' + returnObj.metaDataList[i].getKey() + '>\r';
		}
		saveString += '\t</modelDescription>\r';
		// save the components
		saveString += '\t<components>\r';
		for (var i = 0; i < returnObj.componentList.length; i++) {
			saveString += '\t\t<component id="' + returnObj.componentList[i].getId() + '" type_id="' + returnObj.componentList[i].getComponentTypeId() + '">\r';
			if (returnObj.componentList[i].getDescription()) saveString += '\t\t\t<description>' + returnObj.componentList[i].getDescription() + '</description>\r';
			// save the ports
			if ((returnObj.componentList[i].inputPortList.length > 0) || (returnObj.componentList[i].outputPortList.length > 0)) {
				saveString += '\t\t\t<ports>\r';
				// save the inputPorts
				for (var j = 0; j < returnObj.componentList[i].inputPortList.length; j++) {
					saveString += '\t\t\t\t<inputPort portTypeID="' + returnObj.componentList[i].inputPortList[j].getId() + '" sync="' + returnObj.componentList[i].inputPortList[j].sync + '">\r';
					if (returnObj.componentList[i].inputPortList[j].propertyList.length > 0) {
						saveString += '\t\t\t\t\t<properties>\r';
						for (var k = 0; k < returnObj.componentList[i].inputPortList[j].propertyList.length; k++) {
							saveString += '\t\t\t\t\t\t<property name="' + returnObj.componentList[i].inputPortList[j].propertyList[k].getKey() + '" value="' + returnObj.componentList[i].inputPortList[j].propertyList[k].value + '" />\r';
						}
						saveString += '\t\t\t\t\t</properties>\r';
					}
					saveString += '\t\t\t\t</inputPort>\r';
				}
				// save the outputPorts
				for (var j = 0; j < returnObj.componentList[i].outputPortList.length; j++) {
					saveString += '\t\t\t\t<outputPort portTypeID="' + returnObj.componentList[i].outputPortList[j].getId() + '">\r';
					if (returnObj.componentList[i].outputPortList[j].propertyList.length > 0) {
						saveString += '\t\t\t\t\t<properties>\r';
						for (var k = 0; k < returnObj.componentList[i].outputPortList[j].propertyList.length; k++) {
							saveString += '\t\t\t\t\t\t<property name="' + returnObj.componentList[i].outputPortList[j].propertyList[k].getKey() + '" value="' + returnObj.componentList[i].outputPortList[j].propertyList[k].value + '" />\r';
						}
						saveString += '\t\t\t\t\t</properties>\r';
					}
					saveString += '\t\t\t\t</outputPort>\r';
				}				
				saveString += '\t\t\t</ports>\r';
			}
			// save the properties
			if (returnObj.componentList[i].propertyList.length > 0) {
				saveString += '\t\t\t<properties>\r';
				for (var j = 0; j < returnObj.componentList[i].propertyList.length; j++) {
					saveString += '\t\t\t\t<property name="' + returnObj.componentList[i].propertyList[j].getKey() + '" value="' + returnObj.componentList[i].propertyList[j].value + '" />\r';
				}
				saveString += '\t\t\t</properties>\r';
			}
			// save the layout
			saveString += '\t\t\t<layout>\r';
			saveString += '\t\t\t\t<posX>' + returnObj.componentList[i].getX() + '</posX>\r';
			saveString += '\t\t\t\t<posY>' + returnObj.componentList[i].getY() + '</posY>\r';
			saveString += '\t\t\t</layout>\r';
			// save the GUI
			if (returnObj.componentList[i].gui) {
				saveString += '\t\t\t<gui>\r';
				saveString += '\t\t\t\t<posX>' + returnObj.componentList[i].gui.x + '</posX>\r';
				saveString += '\t\t\t\t<posY>' + returnObj.componentList[i].gui.y + '</posY>\r';
				saveString += '\t\t\t\t<width>' + returnObj.componentList[i].gui.width + '</width>\r';
				saveString += '\t\t\t\t<height>' + returnObj.componentList[i].gui.height + '</height>\r';
				saveString += '\t\t\t</gui>\r';
			}
			saveString += '\t\t</component>\r';
		}
		saveString += '\t</components>\r';
		// save the channels
		if (returnObj.dataChannelList.length > 0) {
			saveString += '\t<channels>\r';
			for (var i = 0; i < returnObj.dataChannelList.length; i++) {
				if (returnObj.dataChannelList[i].getInputPort()) { // avoids saving unfinished channels
					saveString += '\t\t<channel id="' + returnObj.dataChannelList[i].getId() + '">\r';
					if (returnObj.dataChannelList[i].description !== '') saveString += '\t\t\t<description>' + returnObj.dataChannelList[i].description + '</description>\r';
					saveString += '\t\t\t<source>\r';
					saveString += '\t\t\t\t<component id="' + returnObj.dataChannelList[i].getOutputPort().getParentComponent().getId() + '" />\r';
					saveString += '\t\t\t\t<port id="' + returnObj.dataChannelList[i].getOutputPort().getId() + '" />\r';
					saveString += '\t\t\t</source>\r';
					saveString += '\t\t\t<target>\r';
					saveString += '\t\t\t\t<component id="' + returnObj.dataChannelList[i].getInputPort().getParentComponent().getId() + '" />\r';
					saveString += '\t\t\t\t<port id="' + returnObj.dataChannelList[i].getInputPort().getId() + '" />\r';
					saveString += '\t\t\t</target>\r';
					saveString += '\t\t</channel>\r';
				}
			}
			saveString += '\t</channels>\r';
		}
		// save the eventChannels
		if (returnObj.eventChannelList.length > 0) {
			saveString += '\t<eventChannels>\r';
			for (var i = 0; i < returnObj.eventChannelList.length; i++) {
				saveString += '\t\t<eventChannel id="' + returnObj.eventChannelList[i].getId() + '">\r';
				if (returnObj.eventChannelList[i].description !== '') saveString += '\t\t\t<description>' + returnObj.eventChannelList[i].description + '</description>\r';
				saveString += '\t\t\t<sources>\r';
				saveString += '\t\t\t\t<source>\r';
				saveString += '\t\t\t\t\t<component id="' + returnObj.eventChannelList[i].trigger.getParentComponent().getId() + '" />\r';
				saveString += '\t\t\t\t\t<eventPort id="' + returnObj.eventChannelList[i].trigger.getId() + '" />\r';
				saveString += '\t\t\t\t</source>\r';
				saveString += '\t\t\t</sources>\r';
				saveString += '\t\t\t<targets>\r';
				saveString += '\t\t\t\t<target>\r';
				saveString += '\t\t\t\t\t<component id="' + returnObj.eventChannelList[i].listener.getParentComponent().getId() + '" />\r';
				saveString += '\t\t\t\t\t<eventPort id="' + returnObj.eventChannelList[i].listener.getId() + '" />\r';
				saveString += '\t\t\t\t</target>\r';				
				saveString += '\t\t\t</targets>\r';
				saveString += '\t\t</eventChannel>\r';
			}
			saveString += '\t</eventChannels>\r';
		}
		// TODO: save groups
		// save the modeGUI
		saveString += '\t<modelGUI>\r';
		saveString += '\t\t<Decoration>' + returnObj.modelGui.getDecoration() + '</Decoration>\r';
		saveString += '\t\t<Fullscreen>' + returnObj.modelGui.getFullScreen() + '</Fullscreen>\r';
		saveString += '\t\t<AlwaysOnTop>' + returnObj.modelGui.getAlwaysOnTop() + '</AlwaysOnTop>\r';
		saveString += '\t\t<ToSystemTray>' + returnObj.modelGui.getToSystemTray() + '</ToSystemTray>\r';
		saveString += '\t\t<ShopControlPanel>' + returnObj.modelGui.getShowControlPanel() + '</ShopControlPanel>\r'; // TODO: correct to "ShowcontrolPanel", when corrected in XML
		saveString += '\t\t<AREGUIWindow>\r';
		saveString += '\t\t\t<posX>' + returnObj.modelGui.areGuiWindow.x + '</posX>\r';
		saveString += '\t\t\t<posY>' + returnObj.modelGui.areGuiWindow.y + '</posY>\r';
		saveString += '\t\t\t<width>' + returnObj.modelGui.areGuiWindow.width + '</width>\r';
		saveString += '\t\t\t<height>' + returnObj.modelGui.areGuiWindow.height + '</height>\r';
		saveString += '\t\t</AREGUIWindow>\r';
		saveString += '\t</modelGUI>\r';
		saveString += '</model>';
		// actually save the string
		var blob = new Blob([saveString], {type: 'text/plain;charset=utf-8'});
		var saveName;
		if (filename.substring(filename.length-4, filename.length) === '.acs') {
			saveName = prompt('Save file as: ', filename);
		} else {
			saveName = prompt('Save file as: ', filename + '.acs');
		}
		if (saveName) {
			saveAs(blob, saveName);
			if (saveName !== returnObj.getFilename()) returnObj.setFilename(saveName);
			returnObj.hasBeenChanged = false;
		}
	}
	
	returnObj.getModelXMLString = function() {
		return xmlString;
	}
	
	returnObj.addComponent = function(comp) { // ACS.component
		// TODO: this function might prove useless, in which case it can be removed
		this.events.fireEvent('componentAddedEvent');
		returnObj.hasBeenChanged = true;
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
															true,
															true);
			// build inputPortList:
			var inputPorts = compXml.getElementsByTagName('inputPort');
			for (var j = 0; j < inputPorts.length; j++) {
				var portDataType = getDataType(inputPorts.item(j).getElementsByTagName('dataType').item(0).textContent);
				// build the port object:
				returnObj.componentList[newIdx].inputPortList[j] = ACS.port(inputPorts.item(j).attributes.getNamedItem('id').textContent,
																			returnObj.componentList[newIdx],
																			ACS.portType.INPUT,
																			portDataType,
																			j,
																			inputPorts.item(j).getElementsByTagName('mustBeConnected').item(0).textContent);
				// TODO: add the port's properties
			}
			// build outputPortList:
			var outputPorts = compXml.getElementsByTagName('outputPort');
			for (var j = 0; j < outputPorts.length; j++) {
				var portDataType = getDataType(outputPorts.item(j).getElementsByTagName('dataType').item(0).textContent);
				// build the port object:
				returnObj.componentList[newIdx].outputPortList[j] = ACS.port(	outputPorts.item(j).attributes.getNamedItem('id').textContent,
																				returnObj.componentList[newIdx],
																				ACS.portType.OUTPUT,
																				portDataType,
																				j,
																				false);
				// TODO: add the port's properties
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
			var properties = compXml.getElementsByTagName('property');
			for (j = 0; j < properties.length; j++) {
				returnObj.componentList[newIdx].propertyList.push(ACS.property(properties.item(j).attributes.getNamedItem('name').textContent, 
																			   getDataType(properties.item(j).attributes.getNamedItem('type').textContent), 
																			   properties.item(j).attributes.getNamedItem('value').textContent));
				if (properties.item(j).attributes.getNamedItem('description'))
					returnObj.componentList[newIdx].propertyList[returnObj.componentList[newIdx].propertyList.length - 1].description = properties.item(j).attributes.getNamedItem('description').textContent;
				if (properties.item(j).attributes.getNamedItem('combobox'))
					returnObj.componentList[newIdx].propertyList[returnObj.componentList[newIdx].propertyList.length - 1].combobox = properties.item(j).attributes.getNamedItem('combobox').textContent;
				if (properties.item(j).attributes.getNamedItem('getStringList'))
					returnObj.componentList[newIdx].propertyList[returnObj.componentList[newIdx].propertyList.length - 1].getStringList = properties.item(j).attributes.getNamedItem('getStringList').textContent;
			}
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
			returnObj.hasBeenChanged = true;
			this.events.fireEvent('componentAddedEvent');
		}
	}
	
	returnObj.removeComponent = function(comp) { // ACS.component
		if (returnObj.componentList.indexOf(comp) > -1) {
			// first delete all channels that lead to or from this component
			for (var i = 0; i < returnObj.dataChannelList.length; i++) {
				if (returnObj.dataChannelList[i].getInputPort().getParentComponent() === comp) returnObj.removeDataChannel(returnObj.dataChannelList[i]);
				if (returnObj.dataChannelList[i].getOutputPort().getParentComponent() === comp) returnObj.removeDataChannel(returnObj.dataChannelList[i]);
			}
			for (var i = 0; i < returnObj.eventChannelList.length; i++) {
				if (returnObj.eventChannelList[i].listener.getParentComponent() === comp) returnObj.removeEventChannel(returnObj.eventChannelList[i]);
				if (returnObj.eventChannelList[i].trigger.getParentComponent() === comp) returnObj.removeEventChannel(returnObj.eventChannelList[i]);
			}
			// then delete the component itself
			returnObj.componentList.splice(returnObj.componentList.indexOf(comp), 1);
		}
		returnObj.hasBeenChanged = true;
		this.events.fireEvent('componentRemovedEvent');
	}
	
	returnObj.addDataChannel = function(ch) { // ACS.channel
		returnObj.dataChannelList.push(ch);
		returnObj.hasBeenChanged = true;
		this.events.fireEvent('dataChannelAddedEvent');
	}
	
	returnObj.removeDataChannel = function(ch) { // ACS.channel
		if (returnObj.dataChannelList.indexOf(ch) > -1) returnObj.dataChannelList.splice(returnObj.dataChannelList.indexOf(ch), 1);
		returnObj.hasBeenChanged = true;
		this.events.fireEvent('dataChannelRemovedEvent');
	}	

	returnObj.addEventChannel = function(ch) { // ACS.channel
		returnObj.eventChannelList.push(ch);
		returnObj.hasBeenChanged = true;
		this.events.fireEvent('eventChannelAddedEvent');
	}
	
	returnObj.removeEventChannel = function(ch) { // ACS.channel
		if (returnObj.eventChannelList.indexOf(ch) > -1) returnObj.eventChannelList.splice(returnObj.eventChannelList.indexOf(ch), 1);
		returnObj.hasBeenChanged = true;
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
	
	returnObj.deSelectAll = function() {
		for (var i = 0; i < returnObj.componentList.length; i++) {
			if (returnObj.componentList[i].getIsSelected()) returnObj.componentList[i].setIsSelected(false);
		}
		for (var i = 0; i < returnObj.dataChannelList.length; i++) {
			if (returnObj.dataChannelList[i].getIsSelected()) returnObj.dataChannelList[i].setIsSelected(false);
		}
		for (var i = 0; i < returnObj.eventChannelList.length; i++) {
			if (returnObj.eventChannelList[i].getIsSelected()) returnObj.eventChannelList[i].setIsSelected(false);
		}
	}	
	
	// constructor code
	componentCollection = loadDefaultComponentCollection();
	log.debug('the component-id of the first component in the collection is "'+componentCollection.getElementsByTagName('componentType').item(0).attributes.getNamedItem('id').nodeValue+'"');
	returnObj.events.fireEvent('componentCollectionChangedEvent');
	
	return returnObj;
}