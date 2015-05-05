ACS.view = function(modelList) { // ACS.modelList

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var menu = ACS.menuView(modelList);
	var canvas = ACS.canvasView(modelList);
	var propertyEditor = ACS.propertyEditor(modelList);

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var stopEvent = function(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		if (e.preventDefault) e.preventDefault();
	}

	var handleKeydown = function(e) {
		// catch Del to delete selected items
		if (e.keyCode === 46) { // Del can't be caught by keyPress for not all browsers act consistently (see: http://unixpapa.com/js/key.html)
			deleteSelectionHandler();
			stopEvent(e);
			return false;		
		}
	}
	
	var handleKeypress = function(e) {
		switch (e.charCode) {
			case 109: // Ctrl-m for menu
				if (e.ctrlKey) {
					var tablist = document.getElementById('mainMenuTablist').getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							tablist.item(i).focus();
						}
					}
					stopEvent(e);
					return false;
				}
				break;
			case 102: // Ctrl-f for model panel (file)
				if (e.ctrlKey) {
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							tablist.item(i).focus();
						}
					}
					stopEvent(e);
					return false;
				}
				break;
			case 100: // Ctrl-d for model designer
				if (e.ctrlKey) {
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							var panelId = tablist.item(i).attributes.getNamedItem('id').value;
							panelId = panelId.slice(9, panelId.length); // get rid of the word "canvasTab"
							var tab = document.getElementById('modelTabcanvasPanel' + panelId);
							if (tab) tab.click();
						}
					}
					stopEvent(e);
					return false;
				}
				break;				
			case 103: // Ctrl-g for gui designer
				if (e.ctrlKey) {
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							var panelId = tablist.item(i).attributes.getNamedItem('id').value;
							panelId = panelId.slice(9, panelId.length); // get rid of the word "canvasTab"
							var tab = document.getElementById('guiTabcanvasPanel' + panelId);
							if (tab) tab.click();
						}
					}
					stopEvent(e);
					return false;
				}
				break;
			case 112: // Ctrl-p for property editor
				if (e.ctrlKey) {
					var tablist = document.getElementById('propertyEditorTabList').getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							tablist.item(i).focus();
						}
					}
					stopEvent(e);
					return false;
				}
				break;
			case 122: // Ctrl-z for undo
				if (e.ctrlKey) {
					undoHandler();
					stopEvent(e);
					return false;					
				}
			case 121: // Ctrl-y for redo
				if (e.ctrlKey) {
					redoHandler();
					stopEvent(e);
					return false;					
				}
		}
	}

	var deleteSelectionHandler = function() {
		log.debug('deleteBtnPressed');
		var remAct = ACS.removeItemListAction(modelList.getActModel());
		remAct.execute();
	}
	
	var undoHandler = function() {
		if (modelList.getActModel().undoStack.length > 0) modelList.getActModel().undoStack.pop().undo();
	}
	
	var redoHandler = function() {
		if (modelList.getActModel().redoStack.length > 0) modelList.getActModel().redoStack.pop().execute();
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};

// ***********************************************************************************************************************
// *********************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	menu.setComponentMenu();
	// catch keyboard shortcuts
	document.addEventListener('keydown', handleKeydown);
	document.addEventListener('keypress', handleKeypress);
	// register handlers for button-presses in menu
	menu.events.registerHandler('deleteBtnPressedEvent', deleteSelectionHandler);
	menu.events.registerHandler('undoBtnPressedEvent', undoHandler);
	menu.events.registerHandler('redoBtnPressedEvent', redoHandler);

	return returnObj;
}