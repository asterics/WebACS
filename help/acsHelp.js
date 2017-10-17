/*
 * AsTeRICS - Assistive Technology Rapid Integration and Construction Set (http://www.asterics.org)
 * 
 * 
 *        d8888  .d8888b.   .d8888b.          888   888          888
 *       d88888 d88P  Y88b d88P  Y88b         888   888          888
 *      d88P888 888    888 Y88b.              888   888          888
 *     d88P 888 888         "Y888b.   8888888 888888888  .d88b.  888       8888888b.
 *    d88P  888 888            "Y88b. 8888888 888888888 d8P  Y8b 888       888    Y8b
 *   d88P   888 888    888       "888         888   888 88888888 888       888    888
 *  d8888888888 Y88b  d88P Y88b  d88P         888   888 Y8b.     888888888 888    d8P
 * d88P     888  "Y8888P"   "Y8888P"          888   888  "Y8888  888888888 8888888P"
 *                                                                         888  
 *                                                                         888
 *                                                                         888
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
 
 var acsHelp = function() {
	 
// ***********************************************************************************************************************
// ************************************************** static methods *****************************************************
// ***********************************************************************************************************************
	acsHelp.resizeIframe = function(obj) {	
		try {
			var win = obj.contentWindow || obj.contentDocument;
			obj.style.height = win.document.body.offsetHeight + 50 + 'px';
		} catch(err) {
			console.log('An error occurred during optimising size of iFrame - using default settings instead.')
		}
	}
						
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var componentCollection = null;
	var httpRequest = null;
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var removeWhiteSpace = function(str) {
		var arr = str.split(' ');
		str = '';
		for (var i = 0; i < arr.length; i++) {
			str = str + arr[i].trim();
		}
		return str;
	}
	
	var subtypeIsThere = function(element, subtype) {
		for (var i = 0; i < element.childNodes.length; i++) {
			if (element.childNodes[i].textContent.indexOf(subtype) === 0) return true;
		}
		return false;
	}

	var setSubtype = function(subtype, subtypeNoSpace, typeList, type) {
		var li = document.createElement('li');
		var div = document.createElement('div');
		div.setAttribute('id', type + subtypeNoSpace);
		var divText = document.createTextNode(subtype);
		div.appendChild(divText);
		li.appendChild(div);
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'compMenuL2 compMenu');
		ul.setAttribute('id', type + subtypeNoSpace + 'List');
		li.appendChild(ul);
		document.getElementById(typeList).appendChild(li);
	}

	var setComponent = function(actCompName, subtypeNoSpace, type) {
		// set the component in the menu:
		var comp = document.createElement('li');
		var compText = document.createTextNode(actCompName);
		comp.appendChild(compText);
		comp.setAttribute('data-filename', type + 's/' + actCompName + '.htm');
		document.getElementById(type + subtypeNoSpace + 'List').appendChild(comp);
		// set the component in the datalist of the quickselect-field:
		var opt = document.createElement('option');
		opt.setAttribute('id', 'opt_' + actCompName);
		opt.setAttribute('value', actCompName);
		opt.setAttribute('data-filename', type + 's/' + actCompName + '.htm');
		document.getElementById('componentsDataList').appendChild(opt);
	}	

	var buildMenu = function() {
		// first empty the menu...
		var sensorsList = document.getElementById('sensorsList');
		var processorsList = document.getElementById('processorsList');
		var actuatorsList = document.getElementById('actuatorsList');
		while (sensorsList.hasChildNodes()) sensorsList.removeChild(sensorsList.childNodes[0]);
		while (processorsList.hasChildNodes()) processorsList.removeChild(processorsList.childNodes[0]);
		while (actuatorsList.hasChildNodes()) actuatorsList.removeChild(actuatorsList.childNodes[0]);
		// ...and empty the dataList for the quickSelect
		var dataList = document.getElementById('componentsDataList');
		while (dataList.hasChildNodes()) dataList.removeChild(dataList.childNodes[0]);
		// fill the menu with the new content
		var components = componentCollection.getElementsByTagName('componentType');
		// set the subcategories:
		for (var i = 0; i < components.length; i++) {
			var actCompName = components.item(i).attributes.getNamedItem('id').textContent;
			if (actCompName.indexOf('Oska') === -1) actCompName = actCompName.slice(9); // the slice eliminates the "asterics."
			var type = components.item(i).getElementsByTagName('type').item(0).textContent;
			var subtype = components.item(i).getElementsByTagName('type').item(0).attributes.getNamedItem('subtype').textContent;
			var subtypeNoSpace = removeWhiteSpace(subtype);
			switch (type) {
				case 'sensor':
					// set new subcategory, if not yet done so:
					if (!subtypeIsThere(document.getElementById('sensorsList'), subtype)) {
						setSubtype(subtype, subtypeNoSpace, 'sensorsList', 'sensor');
					}
					// set the component:
					setComponent(actCompName, subtypeNoSpace, 'sensor');
					break;
				case 'processor':
					// set new subcategory, if not yet done so:
					if (!subtypeIsThere(document.getElementById('processorsList'), subtype)) {
						setSubtype(subtype, subtypeNoSpace, 'processorsList', 'processor');
					}
					// set the component:
					setComponent(actCompName, subtypeNoSpace, 'processor');
					break;
				case 'actuator':
					// set new subcategory, if not yet done so:
					if (!subtypeIsThere(document.getElementById('actuatorsList'), subtype)) {
						setSubtype(subtype, subtypeNoSpace, 'actuatorsList', 'actuator');
					}
					// set the component:
					setComponent(actCompName, subtypeNoSpace, 'actuator');
					break;
			}
		}
		if ($('#menu').menu('instance')) $('#menu').menu('destroy');
		$('#menu').menu({
			select: function(evt, ui) {
				if (ui.item[0].childElementCount === 0) {
					var compName = ui.item.attr('data-filename');
					$('#mainContent').attr('src', 'help_files/' + compName);
				}
			}
		});
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	// load the component collection
	httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE && (httpRequest.status === 404 || httpRequest.status === 0)) {
			if (httpRequest.responseURL.includes('defaultComponentCollection_help.abd')) {
				// none of the possible component collections could be found
				alert('Could not find any component collection files. Please make sure the file "defaultComponentCollection_help.abd" exists in the ./help folder.');
			} else {
				// try to load the default component collection
				httpRequest.open('GET', 'defaultComponentCollection_help.abd', true);
				httpRequest.send();
			}
		} else if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
			componentCollection = $.parseXML(httpRequest.responseText);
			// after having successfully loaded the componentCollection, build the menu
			buildMenu();
			// set the handlers for the quickselect field and the corresponding show-button
			document.getElementById('quickselect').addEventListener('change', function() {
				var compName = this.value;
				var file = document.getElementById('opt_' + compName).attributes.getNamedItem('data-filename').value;
				$('#mainContent').attr('src', 'help_files/' + file);
				this.value = '';				
			});
			document.getElementById('showButton').addEventListener('click', function() {
				var compName = document.getElementById('quickselect').value;
				var file = document.getElementById('opt_' + compName).attributes.getNamedItem('data-filename').value;
				$('#mainContent').attr('src', 'help_files/' + file);
				document.getElementById('quickselect').value = '';				
			});			
			// make sure to load the correct file on startup, if a querystring with a filename has been given
			if (window.location.search != '') {
				$('#mainContent').attr('src', 'help_files/' + window.location.search.substr(1, window.location.search.length-1));
			} else {
				$('#mainContent').attr('src', 'help_files/ACS/ACS_Basic_Functions.htm');
			}			
		}
	}
	// try to load component collection from ARE webserver
	httpRequest.open('GET', '../../componentCollections/defaultComponentCollection.abd', true);
	httpRequest.send();

	return returnObj;
}