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
 
ACS.view = function(modelList, // ACS.modelList
					clipBoard, // ACS.clipBoard
					areStatus) { // ACS.areStatus

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var menu = ACS.menuView(modelList, areStatus);
	var canvas = ACS.canvasView(modelList, clipBoard);
	var propertyEditor = ACS.propertyEditor(modelList,canvas.getCanvasModelViewList(),canvas.getEditorProperties(), areStatus);

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
	
	// ********************************************** handlers ***********************************************************
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
			case 48: // Ctrl-0 for menu
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
			case 49: // Ctrl-1 for model panel (file)
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
			case 50: // Ctrl-2 for model designer
				if (e.ctrlKey) {
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							var panelId = tablist.item(i).attributes.getNamedItem('id').value;
							panelId = panelId.slice(9, panelId.length); // get rid of the word "canvasTab"
							var tab = document.getElementById('modelTabcanvasContainer' + panelId);
							if (tab) tab.click();
						}
					}
					stopEvent(e);
					return false;
				}
				break;				
			case 51: // Ctrl-3 for gui designer
				if (e.ctrlKey) {
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							var panelId = tablist.item(i).attributes.getNamedItem('id').value;
							panelId = panelId.slice(9, panelId.length); // get rid of the word "canvasTab"
							var tab = document.getElementById('guiTabcanvasContainer' + panelId);
							if (tab) tab.click();
						}
					}
					stopEvent(e);
					return false;
				}
				break;
			case 52: // Ctrl-4 for property editor
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
			case 57: // CTRL-9 for toggle blind mode
				if (e.ctrlKey) {
					// change keycode-menu at the top of the page
					if ($('#AKmodelDesigner').hasClass('displayNone')) {
						$('#AKmodelDesigner').removeClass('displayNone');
						$('#AKguiDesigner').removeClass('displayNone');
					} else {
						$('#AKmodelDesigner').addClass('displayNone');
						$('#AKguiDesigner').addClass('displayNone');
					}
					canvas.toggleBlindMode();
					propertyEditor.toggleBlindMode();
					stopEvent(e);
					return false;
				}
				break;				
			case 120: // Ctrl-x for cut
				if (e.ctrlKey) {
					cutHandler();
					stopEvent(e);
					return false;					
				}		
			case 99: // Ctrl-c for copy
				if (e.ctrlKey) {
					copyHandler();
					stopEvent(e);
					return false;					
				}
			case 118: // Ctrl-v for paste
				if (e.ctrlKey) {
					pasteHandler();
					stopEvent(e);
					return false;					
				}				
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
	
	var cutHandler = function() {
		clipBoard.cut(modelList.getActModel());
	}
	
	var copyHandler = function() {
		clipBoard.copy(modelList.getActModel());
	}
	
	var pasteHandler = function() {
		clipBoard.paste(modelList.getActModel());
	}	

	var deleteSelectionHandler = function() {
		log.debug('deleteBtnPressed');
		var remAct = ACS.removeItemListAction(modelList.getActModel(), modelList.getActModel().selectedItemsList);
		remAct.execute();
	}
	
	var undoHandler = function() {
		// find out, if the Model Designer or the GUI Designer is active, then pop from the corresponding stack
		var modelTabs = null;
		var canvasPanels = document.getElementsByClassName('canvasPanel');
		for (var i = 0; i < canvasPanels.length; i++) {
			if (canvasPanels[i].getAttribute('aria-hidden') === 'false') {
				modelTabs = document.getElementsByClassName('modelTab');
			}
		}
		if (modelTabs[0].getAttribute('aria-selected') === 'true') {
			if (modelList.getActModel().undoStack.length > 0) modelList.getActModel().undoStack.pop().undo();
		} else {
			if (modelList.getActModel().guiUndoStack.length > 0) modelList.getActModel().guiUndoStack.pop().undo();
		}
	}
	
	var redoHandler = function() {
		// find out, if the Model Designer or the GUI Designer is active, then pop from the corresponding stack
		var modelTabs = null;
		var canvasPanels = document.getElementsByClassName('canvasPanel');
		for (var i = 0; i < canvasPanels.length; i++) {
			if (canvasPanels[i].getAttribute('aria-hidden') === 'false') {
				modelTabs = document.getElementsByClassName('modelTab');
			}
		}
		if (modelTabs[0].getAttribute('aria-selected') === 'true') {
			if (modelList.getActModel().redoStack.length > 0) modelList.getActModel().redoStack.pop().execute();
		} else {
			if (modelList.getActModel().guiRedoStack.length > 0) modelList.getActModel().guiRedoStack.pop().execute();
		}
	}
	
	var AREStatusChangedEventHandler = function() {
		switch (areStatus.getStatus()) {
			case ACS.statusType.DISCONNECTED: document.getElementById('AREstatus').textContent = 'Disconnected'; break;
			case ACS.statusType.CONNECTING:	document.getElementById('AREstatus').textContent = 'Trying to connect'; break;
			case ACS.statusType.CONNECTED: document.getElementById('AREstatus').textContent = 'Connected'; break;
			case ACS.statusType.STARTING: document.getElementById('AREstatus').textContent = 'Attempting to start model'; break;
			case ACS.statusType.STARTED: document.getElementById('AREstatus').textContent = 'Model running'; break;
			case ACS.statusType.PAUSING: document.getElementById('AREstatus').textContent = 'Attempting to pause model'; break;
			case ACS.statusType.PAUSED: document.getElementById('AREstatus').textContent = 'Model paused'; break;
			case ACS.statusType.RESUMING: document.getElementById('AREstatus').textContent = 'Attempting to resume model'; break;
			case ACS.statusType.STOPPING: document.getElementById('AREstatus').textContent = 'Attempting to stop model'; break;
			case ACS.statusType.STOPPED: document.getElementById('AREstatus').textContent = 'Model stopped'; break;
			case ACS.statusType.CONNECTIONLOST: document.getElementById('AREstatus').textContent = 'Connection lost'; break;
		}
	}
	
	var ARESynchronisationChangedEventHandler = function() {
		if ((areStatus.getStatus() === ACS.statusType.DISCONNECTED) || (areStatus.getStatus() === ACS.statusType.CONNECTIONLOST) || (areStatus.getStatus() === ACS.statusType.CONNECTING)) {
			document.getElementById('synchronisationStatus').textContent = '';
		} else {
			switch (areStatus.getSynchronised()) {
				case true: document.getElementById('synchronisationStatus').textContent = ' / synchronised';
						   break;
				case false: document.getElementById('synchronisationStatus').textContent = ' / NOT synchronised';
						   break;
				case undefined: document.getElementById('synchronisationStatus').textContent = ' / synchronisation status unknown';
						   break;						   
			}
		}
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};

// ***********************************************************************************************************************
// *********************************************** constructor code ******************************************************
// ***********************************************************************************************************************
	menu.setComponentMenu();
	// catch keyboard shortcuts
	document.addEventListener('keydown', handleKeydown);
	document.addEventListener('keypress', handleKeypress);
	// register handlers for button-presses in menu
	menu.events.registerHandler('cutBtnPressedEvent', cutHandler);
	menu.events.registerHandler('copyBtnPressedEvent', copyHandler);
	menu.events.registerHandler('pasteBtnPressedEvent', pasteHandler);
	menu.events.registerHandler('deleteBtnPressedEvent', deleteSelectionHandler);
	menu.events.registerHandler('undoBtnPressedEvent', undoHandler);
	menu.events.registerHandler('redoBtnPressedEvent', redoHandler);
	// register handlers for areStatus events
	areStatus.events.registerHandler('AREStatusChangedEvent', AREStatusChangedEventHandler);
	areStatus.events.registerHandler('ARESynchronisationChangedEvent', ARESynchronisationChangedEventHandler);

	return returnObj;
}