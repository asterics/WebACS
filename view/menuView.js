ACS.menuView = function(modelList) { // ACS.modelList
	// private variables
	var menuPanel = ACS.tabPanel(ACS.vConst.MENUVIEW_MENUMOTHERPANEL, 'tab', 'panel');
	var activeLevel1Timer = null;
	var activeLevel2Timer = null;
	var cameFromElement = null;
	var activeButtonList = '';
	var quickselectForm = document.getElementById('quickselectForm');
	
	// private methods
	var subtypeIsThere = function(element, subtype) {
		for (var i = 0; i < element.childNodes.length; i++) {
			if (element.childNodes[i].textContent.indexOf(subtype) === 0) return true;
		}
		return false;
	}
	
	var removeWhiteSpace = function(str) {
		var arr = str.split(' ');
		str = '';
		for (var i = 0; i < arr.length; i++) {
			str = str + arr[i].trim();
		}
		return str;
	}
	
	var setSubtype = function(subtype, subtypeNoSpace, typeList, type) {
		var li = document.createElement('li');
		li.setAttribute('tabindex', 0);
		var div = document.createElement('div');
		div.setAttribute('id', type + subtypeNoSpace);
		div.setAttribute('class', 'compMenuL1');
		var divText = document.createTextNode(subtype);
		div.appendChild(divText);
		li.appendChild(div);
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'compMenuL2 compMenu hiddenMenu');
		ul.setAttribute('id', type + subtypeNoSpace + 'List');
		ul.setAttribute('data-subtype', subtype);
		li.appendChild(ul);
		document.getElementById(typeList).appendChild(li);
	}
	
	var hideAllComponentMenus = function() {
		var menus = document.getElementsByClassName('compMenu');
		for (var i = 0; i < menus.length; i++) {
			if (menus.item(i).className.indexOf('hiddenMenu') === -1) menus.item(i).className = menus.item(i).className + ' hiddenMenu';
		}
	}
	
	var setComponent = function(actCompName, subtypeNoSpace, type) {
		// set the component in the menu:
		var comp = document.createElement('li');
		comp.setAttribute('tabindex', 0);
		var compText = document.createTextNode(actCompName);
		comp.appendChild(compText);
		comp.addEventListener('click', function() {	modelList.getActModel().addComponentByName(actCompName);
													hideAllComponentMenus();
												  });
		document.getElementById(type + subtypeNoSpace + 'List').appendChild(comp);
		// set the component in the datalist of the quickselect-field:
		var opt = document.createElement('option');
		opt.setAttribute('value', actCompName);
		document.getElementById('componentsDataList').appendChild(opt);
	}
	
	var getIndexInModelList = function(loadFile) {
		for (var i = 0; i < modelList.getLength(); i++) {
			if (loadFile.name === modelList.getModelAtIndex(i).getFilename()) return i;
		}
		return -1;
	}
	
	// Menu-Button-Handlers - System-Menu
	var handleConnectARE = function(e) {
		log.info('connectAREBtn has been clicked');
		// TODO: properly implement
	}
	document.getElementById('connectAREBtn').addEventListener('click', handleConnectARE);
	
	var handleNewModel = function(e) {
		modelList.addNewModel();
	}
	document.getElementById("newModelBtn").addEventListener('click', handleNewModel);

	var fileSelector = document.createElement('input'); // create "hidden" input element for choosing file
	fileSelector.setAttribute('type', 'file');
	fileSelector.setAttribute('class', 'hidden'); // must be added to DOM in order for the click event to work in IE
	document.getElementById('mainMenuPanel').appendChild(fileSelector);
	var handleSelectedFile = function(e) {
		if (fileSelector.files[0]) {
			var loadFile = fileSelector.files[0];
			var indexOfModelInList = getIndexInModelList(loadFile);
			if (indexOfModelInList > -1){ // if model already loaded, select it
				modelList.setActModel(indexOfModelInList)
			} else { // else load it
				// if active model is not empty, open new model first
				if (modelList.getActModel().componentList.length > 0) modelList.addNewModel();
				// load the model
				modelList.getActModel().loadModel(loadFile);
			}
		}
	}
	fileSelector.addEventListener('change', handleSelectedFile);
	
	var handleOpenModel = function(e) {
		// Check for the various File API support
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			fileSelector.click();
		} else {
			log.warn('file APIs not supported by browser');
		}
	}
	document.getElementById('openModelBtn').addEventListener('click', handleOpenModel);
	
	var handleCloseModel = function(e) {
		var m = modelList.getActModel();
		if ((m.hasBeenChanged) && (confirm('Save changes to ' + m.getFilename() + ' before closing?'))) {
			m.saveModel();
		}
		modelList.removeModel();
	}
	document.getElementById('closeModelBtn').addEventListener('click', handleCloseModel);
	
	var handleSaveModel = function(e) {
		modelList.getActModel().saveModel();
	}
	document.getElementById('saveModelBtn').addEventListener('click', handleSaveModel);
	
	// Menu-Button-Handlers - Components-Menu
	var stopLevel1Timer = function() {
		if (activeLevel1Timer) {
			window.clearTimeout(activeLevel1Timer);
			activeLevel1Timer=null;
		}
    }
	var stopLevel2Timer = function() {
		if (activeLevel2Timer) {
			window.clearTimeout(activeLevel2Timer);
			activeLevel2Timer=null;
		}
    }	
	
    var startLevel1Timer = function(id) {
		activeLevel1Timer = window.setTimeout(function(){	document.getElementById(id).setAttribute('class', 'compMenuL1 compMenu hiddenMenu');
															cameFromElement = null;
														}, 100);
    }
	
    var startLevel2Timer = function(id) {
		activeLevel2Timer = window.setTimeout(function(){	document.getElementById(id).setAttribute('class', 'compMenuL2 compMenu hiddenMenu');
															cameFromElement = null;
														}, 100);
    }
	
	var handleCompMenu = function(elementId, menuId, e) {
		if ((e.type === 'mouseenter') || (e.type === 'focus')) {
			if (e.currentTarget.className === 'menuButton') { // entering a menu-button
				if (cameFromElement && (cameFromElement.attributes.getNamedItem('id').value === menuId)) { // if the correct submenu is already open
					stopLevel1Timer();
				} else {
					document.getElementById(menuId).setAttribute('class', 'compMenuL1 compMenu');
					activeButtonList = menuId;
				}
			} else if (e.currentTarget.className.slice(0, 10) === 'compMenuL1') { // entering a level1 menu-item
				stopLevel1Timer();
				if (cameFromElement === document.getElementById(menuId)) { // if coming from the submenu
					stopLevel2Timer();
				} else {
					document.getElementById(menuId).setAttribute('class', 'compMenuL2 compMenu'); // open submenu
				}
			} else if (e.currentTarget.className.slice(0, 10) === 'compMenuL2') { // entering a level2 menu-item
				stopLevel1Timer();
				stopLevel2Timer();
			}
		} else if ((e.type === 'mouseleave') || (e.type === 'blur')) {
			if (e.currentTarget.className === 'menuButton') { // exiting a menu-button
				startLevel1Timer(activeButtonList);
				cameFromElement = document.getElementById(elementId);
			} else if (e.currentTarget.className.slice(0, 10) === 'compMenuL1') { // exiting a level1 menu
				startLevel2Timer(menuId);
				startLevel1Timer(activeButtonList);
				cameFromElement = document.getElementById(activeButtonList); // set to the ul, not the li
			} else if (e.currentTarget.className.slice(0, 10) === 'compMenuL2') { // exiting a level2 menu
				startLevel2Timer(menuId);
				startLevel1Timer(activeButtonList);
				cameFromElement = document.getElementById(elementId);
			}
		}
	}
	
	var setComponentsMenuHandlers = function(elementId, menuId) {
		document.getElementById(elementId).addEventListener('mouseenter', function(e) {handleCompMenu(elementId, menuId, e);});
		document.getElementById(elementId).addEventListener('focus', function(e) {handleCompMenu(elementId, menuId, e);});
		document.getElementById(elementId).addEventListener('mouseleave', function(e) {handleCompMenu(elementId, menuId, e);});
		document.getElementById(elementId).addEventListener('blur', function(e) {handleCompMenu(elementId, menuId, e);});
	}
	
	setComponentsMenuHandlers('sensorsBtn', 'sensorsBtnList');
	setComponentsMenuHandlers('processorsBtn', 'processorsBtnList');
	setComponentsMenuHandlers('actuatorsBtn', 'actuatorsBtnList');
	setComponentsMenuHandlers('savedGroupsBtn', 'savedGroupsBtnList');
		
	// public stuff
	var returnObj = {};
	
	returnObj.setComponentMenu = function() {
		// first empty the menu...
		var sensorsBtnList = document.getElementById('sensorsBtnList');
		var processorsBtnList = document.getElementById('processorsBtnList');
		var actuatorsBtnList = document.getElementById('actuatorsBtnList');
		var savedGroupsBtnList = document.getElementById('savedGroupsBtnList');
		while (sensorsBtnList.hasChildNodes()) sensorsBtnList.removeChild(sensorsBtnList.childNodes[0]);
		while (processorsBtnList.hasChildNodes()) processorsBtnList.removeChild(processorsBtnList.childNodes[0]);
		while (actuatorsBtnList.hasChildNodes()) actuatorsBtnList.removeChild(actuatorsBtnList.childNodes[0]);
		while (savedGroupsBtnList.hasChildNodes()) savedGroupsBtnList.removeChild(savedGroupsBtnList.childNodes[0]);
		// ...and empty the dataList for the quickSelect
		var dataList = document.getElementById('componentsDataList');
		while (dataList.hasChildNodes()) dataList.removeChild(dataList.childNodes[0]);
		// fill the menu with the new content
		var components = modelList.getActModel().getComponentCollection().getElementsByTagName('componentType');
		// set the subcategories:
		for (var i = 0; i < components.length; i++) {
			var actCompName = components.item(i).attributes.getNamedItem('id').textContent.slice(9); // the slice eliminates the "asterics."
			var type = components.item(i).getElementsByTagName('type').item(0).textContent;
			var subtype = components.item(i).getElementsByTagName('type').item(0).attributes.getNamedItem('subtype').textContent;
			var subtypeNoSpace = removeWhiteSpace(subtype);
			switch (type) {
				case 'sensor':
					// set new subcategory, if not yet done so:
					if (!subtypeIsThere(document.getElementById('sensorsBtnList'), subtype)) {
						setSubtype(subtype, subtypeNoSpace, 'sensorsBtnList', 'sensor');
						setComponentsMenuHandlers('sensor' + subtypeNoSpace, 'sensor' + subtypeNoSpace + 'List');
						setComponentsMenuHandlers('sensor' + subtypeNoSpace + 'List', 'sensor' + subtypeNoSpace + 'List');
					}
					// set the component:
					setComponent(actCompName, subtypeNoSpace, 'sensor');
					break;
				case 'processor':
					// set new subcategory, if not yet done so:
					if (!subtypeIsThere(document.getElementById('processorsBtnList'), subtype)) {
						setSubtype(subtype, subtypeNoSpace, 'processorsBtnList', 'processor');
						setComponentsMenuHandlers('processor' + subtypeNoSpace, 'processor' + subtypeNoSpace + 'List');
						setComponentsMenuHandlers('processor' + subtypeNoSpace + 'List', 'processor' + subtypeNoSpace + 'List');
					}
					// set the component:
					setComponent(actCompName, subtypeNoSpace, 'processor');
					break;
				case 'actuator':
					// set new subcategory, if not yet done so:
					if (!subtypeIsThere(document.getElementById('actuatorsBtnList'), subtype)) {
						setSubtype(subtype, subtypeNoSpace, 'actuatorsBtnList', 'actuator');
						setComponentsMenuHandlers('actuator' + subtypeNoSpace, 'actuator' + subtypeNoSpace + 'List');
						setComponentsMenuHandlers('actuator' + subtypeNoSpace + 'List', 'actuator' + subtypeNoSpace + 'List');
					}
					// set the component:
					setComponent(actCompName, subtypeNoSpace, 'actuator');
					break;
			}
		}
	}
	
	// constructor code
	// handlers for the quickselect field and the corresponding insert-button
	document.getElementById('quickselect').addEventListener('change', function() {	modelList.getActModel().addComponentByName(this.value);
																					this.value = '';
																				 });
	document.getElementById('insertButton').addEventListener('click', function() {	modelList.getActModel().addComponentByName(document.getElementById('quickselect').value);
																					document.getElementById('quickselect').value = '';
																				 });																			 
	// model changed handler
	modelList.getActModel().events.registerHandler('modelChangedEvent', function() {
		log.info('The model has been changed!');
	});
	
	// componentCollection changed handler
	modelList.getActModel().events.registerHandler('componentCollectionChangedEvent', function() {
		log.info('The componentCollection has been changed!');
		returnObj.setComponentMenu();
	});
	
	// actModel changed handler
	modelList.events.registerHandler('actModelChangedEvent', function() {
		log.info('A different model has been set to active');
		returnObj.setComponentMenu();
	});
	
	// window closing handler
	window.onbeforeunload = function() {
		// the desireable behaviour would be the following - sadly currently it only works in IE...
		/*while ((modelList.getLength() > 0) && (modelList.getActModel().hasBeenChanged)) {
			handleCloseModel();
		}*/
		// ... so we're using the second best option:
		for (var i = 0; i < modelList.getLength(); i++) {
			if (modelList.getModelAtIndex(i).hasBeenChanged) return ACS.vConst.MENUVIEW_BEFOREUNLOADMESSAGE;
		}
	}
	
	return returnObj;
}