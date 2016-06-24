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
 
 ACS.listComponentView = function(	mainList, // DOM Element
									component, // ACS.component
									model) { // ACS.model
								
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var listElem = document.createElement('li');
	var subList = document.createElement('ul');

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var getOutputPort = function(inPort) {
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getInputPort() === inPort) return model.dataChannelList[i].getOutputPort();
		}
		return null;
	}
	
	var getInputPorts = function(outPort) {
		var inPortList = [];
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getOutputPort() === outPort) inPortList.push(model.dataChannelList[i].getInputPort());
		}
		return inPortList;
	}

	var generatePortList = function(id, portList) {
		var $list = $(document.createElement('ul'));
		$list.attr('id', id + 'List');
		for (var i = 0; i < portList.length; i++) {
			var $li = $(document.createElement('li'));
			$li.attr('id', portList[i].getId().replace(/\s+/g, '').replace(/\.+/g, '') + 'AT' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
			$li.attr('tabindex', '0');
			var tmp = portList[i];
			$li.focus(function(port) {
				return function() {console.log('der focus ist auf ' + port.getId() + ' AT ' + component.getId());};
			}(portList[i]));
			$list.append($li);
			if (portList[i].getType() === ACS.portType.INPUT) {
				var outputPort = getOutputPort(portList[i]);
				if (outputPort) {
					$li.append(portList[i].getId() + ' connected to port ');
					var $btn = $(document.createElement('button'));
					$btn.attr('type', 'button');
					$btn.text(outputPort.getId());
					$btn.click(function(oPort) {
						return function(evt) {$('#' + oPort.getId().replace(/\s+/g, '').replace(/\.+/g, '') + 'AT' + oPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
					}(outputPort));
					
					$li.append($btn);
					$li.append(' at ');
					$btn = $(document.createElement('button'));
					$btn.attr('type', 'button');
					$btn.text(outputPort.getParentComponent().getId());
					$btn.click(function(oPort) {
						return function() {$('#' + oPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
					}(outputPort));
					$li.append($btn);
				} else {
					$li.text(portList[i].getId());
				}
			} else {
				var inputPorts = getInputPorts(portList[i]);
				if (inputPorts.length > 0) {
					$li.text(portList[i].getId() + ' connected to');
					var $ul = $(document.createElement('ul'));
					$li.append($ul);
					for (var j = 0; j < inputPorts.length; j++) {
						var $subLi = $(document.createElement('li'));
						$subLi.append('port ');
						var $btn = $(document.createElement('button'));
						$btn.attr('type', 'button');
						$btn.text(inputPorts[j].getId());
						$btn.click(function(iPort) {
							return function(evt) {$('#' + iPort.getId().replace(/\s+/g, '').replace(/\.+/g, '') + 'AT' + iPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
						}(inputPorts[j]));						
						$subLi.append(' at ');
						$btn = $(document.createElement('button'));
						$btn.attr('type', 'button');
						$btn.text(inputPorts[j].getParentComponent().getId());
						$btn.click(function(iPort) {
							return function(evt) {$('#' + iPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
						}(inputPorts[j]));
						$subLi.append($btn);
						$ul.append($subLi);
					}
				} else {
					$li.text(portList[i].getId());
				}
			}			
		}
		$('#' + id).append($list);
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};

	returnObj.getComponent = function() {
		return component;
	}	
	
	returnObj.destroy = function() {
		$(listElem).remove();
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	$(listElem).attr('tabindex', '0');
	$(listElem).attr('id', component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
	$(listElem).text(component.getId());
	$(subList).addClass('componentSublist');
	$(listElem).append(subList);
	$(mainList).append(listElem);	
	if (component.inputPortList.length > 0) {
		$(subList).append('<li id="inputPorts' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '" tabindex="0">Input Ports:</li>');
		generatePortList('inputPorts' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''), component.inputPortList);
	}
	if (component.outputPortList.length > 0) {
		$(subList).append('<li id="outputPorts' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '" tabindex="0">Output Ports:</li>');
		generatePortList('outputPorts' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''), component.outputPortList);
	}

	return returnObj;
}