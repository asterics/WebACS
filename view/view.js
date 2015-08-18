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
					clipBoard) { // ACS.clipBoard

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var menu = ACS.menuView(modelList);
	var canvas = ACS.canvasView(modelList, clipBoard);
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
	menu.events.registerHandler('cutBtnPressedEvent', cutHandler);
	menu.events.registerHandler('copyBtnPressedEvent', copyHandler);
	menu.events.registerHandler('pasteBtnPressedEvent', pasteHandler);
	menu.events.registerHandler('deleteBtnPressedEvent', deleteSelectionHandler);
	menu.events.registerHandler('undoBtnPressedEvent', undoHandler);
	menu.events.registerHandler('redoBtnPressedEvent', redoHandler);

	return returnObj;
}