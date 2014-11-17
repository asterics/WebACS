ACS.canvasView = function(modelList) { // ACS.modelList
	// private variables
	var canvasTabPanel = ACS.tabPanel(ACS.vConst.CANVASVIEW_MOTHERPANEL, 'canvasTab', 'canvasPanel');
	var modelViewList = [];
	var panelId = 0;
	
	// private methods
	
	// public stuff
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
		li.click(); // activate the tab
		// register the handler for changing the filename in the tablist
		actModel.events.registerHandler('filenameBeingChangedEvent', function() {
			li.textContent = actModel.getFilename();
			log.info('new filename: ' + actModel.getFilename());
		});
	}
	
	// constructor code
	returnObj.addActModelToView(); // add first model manually, because it has been created before registering the event handlers
	
	modelList.events.registerHandler('newModelAddedEvent', returnObj.addActModelToView);

	modelList.events.registerHandler('removingModelEvent', function() {
		var removeId = -1; // for the id of the tab that needs to be removed
		// remove the modelView from the list:
		for (var i = 0; i < modelViewList.length; i++) {
			if (modelViewList[i] && (modelViewList[i].getModel() === modelList.getActModel())) {
				removeId = i;
				modelViewList[i] = null;
			}
		}
		// remove the tab from the DOM:
		document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).removeChild(document.getElementById('tab' + removeId));
		document.getElementById('canvasPanel').removeChild(document.getElementById('canvasPanel' + removeId));
		// update the tabPanel:
		canvasTabPanel.updatePanel();
	});
	
	canvasTabPanel.events.registerHandler('tabSwitchedEvent', function() {
		var elements = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].getAttribute('aria-selected') === 'true') modelList.setActModel(i);
		}
	});
	
	// actModel changed handler
	modelList.events.registerHandler('actModelChangedEvent', function() {
		// seek the panel matching the actModel:
		for (var i = 0; i < modelViewList.length; i++) {
			if (modelViewList[i] && (modelViewList[i].getModel() === modelList.getActModel())) {
				// activate the tab
				document.getElementById('canvasTab' + i).click();
			}
		}	
	});
	
	
	return returnObj;
}