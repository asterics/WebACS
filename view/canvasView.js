ACS.canvasView = function(modelList) { // ACS.modelList

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var canvasTabPanel = ACS.tabPanel(ACS.vConst.CANVASVIEW_MOTHERPANEL, 'canvasTab', 'canvasPanel');
	var modelViewList = [];
	var panelId = 0;
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	// ********************************************** handlers ***********************************************************
	
	// filenameBeingChangedEventHandler is defined in addActModelToView
	
	var newModelAddedEventHandler = function() {
		returnObj.addActModelToView();
	}
	
	var removingModelEventHandler = function() {
		var removePanel = ''; // for the id of the panel that needs to be removed
		// remove the modelView from the list:
		for (var i = 0; i < modelViewList.length; i++) {
			if (modelViewList[i] && (modelViewList[i].getModel() === modelList.getActModel())) {
				removePanel = modelViewList[i].getModelContainerId();
				modelViewList.splice(i, 1);
			}
		}
		// remove the tab from the DOM:
		document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).removeChild(document.getElementById(removePanel.replace('Panel', 'Tab')));
		document.getElementById(ACS.vConst.CANVASVIEW_MOTHERPANEL).removeChild(document.getElementById(removePanel));
		// update the tabPanel:
		canvasTabPanel.updatePanel();
	}
	
	var tabSwitchedEventHandler = function() {
		var elements = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].getAttribute('aria-selected') === 'true') modelList.setActModel(i);
		}
	}
	
	var actModelChangedEventHandler = function() {
		// seek the panel matching the actModel:
		for (var i = 0; i < modelViewList.length; i++) {
			if (modelViewList[i] && (modelViewList[i].getModel() === modelList.getActModel())) {
				// activate the tab
				var tabId = modelViewList[i].getModelContainerId().replace('Panel', 'Tab');
				document.getElementById(tabId).click();
			}
		}	
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.addActModelToView = function() {
		var actModel = modelList.getActModel();
		var li = document.createElement('li');
		li.setAttribute('id', 'canvasTab' + panelId);
		li.setAttribute('class', 'tab canvasTab');
		li.setAttribute('aria-controls', 'canvasPanel' + panelId);
		li.setAttribute('aria-selected', 'false');
		li.setAttribute('role', 'tab');
		li.setAttribute('tabindex', -1);
		li.textContent = actModel.getFilename();
		document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).appendChild(li);
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanel' + panelId);
		div.setAttribute('class', 'panel canvasPanel');
		div.setAttribute('aria-labelledby', 'tab' + panelId);
		div.setAttribute('role', 'tabpanel');
		document.getElementById(ACS.vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		modelViewList[panelId] = ACS.modelView('canvasPanel' + panelId, actModel);
		panelId++;
		canvasTabPanel.updatePanel();
		// activate the tab (a simple li.click() will not work in safari)
		var click_ev = document.createEvent("MouseEvents");
		click_ev.initEvent("click", true, true);
		li.dispatchEvent(click_ev);
		// register the handler for changing the filename in the tablist
		actModel.events.registerHandler('filenameBeingChangedEvent', function() {
			li.textContent = actModel.getFilename();
			log.info('new filename: ' + actModel.getFilename());
		});
	}
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	returnObj.addActModelToView(); // add first model manually, because it has been created before registering the event handlers

	// register event handlers
	modelList.events.registerHandler('newModelAddedEvent', newModelAddedEventHandler);
	modelList.events.registerHandler('removingModelEvent', removingModelEventHandler);	
	canvasTabPanel.events.registerHandler('tabSwitchedEvent', tabSwitchedEventHandler);
	modelList.events.registerHandler('actModelChangedEvent', actModelChangedEventHandler);
	
	return returnObj;
}