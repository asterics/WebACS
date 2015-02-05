ACS.propertyEditor = function(modelList) {
	// private variables
	var propertiesTabPanel = ACS.tabPanel(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL, 'propEdTab', 'propEdPanel');
	
	// private methods
	
	// public stuff
	var returnObj = {};

	// constructor code
	var li = document.createElement('li');
	li.setAttribute('id', 'propertiesTab');
	li.setAttribute('class', 'tab propEdTab');
	li.setAttribute('aria-controls', 'propertiesPanel');
	li.setAttribute('aria-selected', 'false');
	li.setAttribute('role', 'tab');
	li.setAttribute('tabindex', -1);
	li.textContent = 'Properties';
	document.getElementById(ACS.vConst.PROPERTYEDITOR_TABLIST).appendChild(li);
	var div = document.createElement('div');
	div.setAttribute('id', 'propertiesPanel');
	div.setAttribute('class', 'panel propEdPanel');
	div.setAttribute('aria-labelledby', 'propertiesTab');
	div.setAttribute('role', 'tabpanel');
	document.getElementById(ACS.vConst.PROPERTYEDITOR_MOTHERPANEL).appendChild(div);
	propertiesTabPanel.updatePanel();
	// activate the propertiesTab (a simple li.click() will not work in safari)
	var click_ev = document.createEvent("MouseEvents");
	click_ev.initEvent("click", true, true);
	li.dispatchEvent(click_ev);	
	
	return returnObj;
}