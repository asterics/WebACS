ACS.view = function(modelList) { // ACS.modelList
	// private variables
	var menu = ACS.menuView(modelList);
	var canvas = ACS.canvasView(modelList);
	var propertyEditor = ACS.propertyEditor(modelList);

	// private methods
	
	// public stuff
	var returnObj = {};

	// constructor code
	menu.setComponentMenu();
	// catch keyboard shortcuts
	document.addEventListener('keydown', function(e) {
		switch (e.keyCode) {
			case 49: // Ctrl-1 for menu
				if (e.ctrlKey) {
					e.cancelBubble = true;
					var tablist = document.getElementById('mainMenuTablist').getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							tablist.item(i).focus();
						}
					}
				}
				break;
			case 50: // Ctrl-2 for model panel
				if (e.ctrlKey) {
					e.cancelBubble = true;
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							tablist.item(i).focus();
						}
					}
				}
				break;
			case 51: // Ctrl-3 for model designer
				if (e.ctrlKey) {
					e.cancelBubble = true;
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							var panelId = tablist.item(i).attributes.getNamedItem('id').value;
							panelId = panelId.slice(9, panelId.length); // get rid of the word "canvasTab"
							var tab = document.getElementById('modelTabcanvasPanel' + panelId);
							if (tab) tab.click();
						}
					}
				}
				break;				
			case 52: // Ctrl-4 for gui designer
				if (e.ctrlKey) {
					e.cancelBubble = true;
					var tablist = document.getElementById(ACS.vConst.CANVASVIEW_TABLIST).getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							var panelId = tablist.item(i).attributes.getNamedItem('id').value;
							panelId = panelId.slice(9, panelId.length); // get rid of the word "canvasTab"
							var tab = document.getElementById('guiTabcanvasPanel' + panelId);
							if (tab) tab.click();
						}
					}
				}
				break;
			case 53: // Ctrl-5 for property editor
				if (e.ctrlKey) {
					e.cancelBubble = true;
					var tablist = document.getElementById('propertyEditorTablist').getElementsByClassName('tab');
					for (var i = 0; i < tablist.length; i++) {
						if (tablist.item(i).attributes.getNamedItem('aria-selected').value === 'true') {
							tablist.item(i).focus();
						}
					}
				}
				break;				
		}
	});	
		
	return returnObj;
}