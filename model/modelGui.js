ACS.modelGui = function() { 


// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var decoration = ACS.mConst.MODELGUI_DECORATION;
	var fullScreen = ACS.mConst.MODELGUI_FULLSCREEN;
	var alwaysOnTop = ACS.mConst.MODELGUI_ALWAYSONTOP;
	var toSystemTray = ACS.mConst.MODELGUI_TOSYSTEMTRAY;
	var showControlPanel = ACS.mConst.MODELGUI_SHOWCONTROLPANEL;

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.areGuiWindow = ACS.gui(ACS.mConst.MODELGUI_AREGUIWINDOW_X, ACS.mConst.MODELGUI_AREGUIWINDOW_Y, ACS.mConst.MODELGUI_AREGUIWINDOW_WIDTH, ACS.mConst.MODELGUI_AREGUIWINDOW_HEIGHT, false);
	
	returnObj.setDecoration = function(dec) {
		decoration = dec;
	}
	
	returnObj.getDecoration = function() {
		return decoration;
	}

	returnObj.setFullScreen = function(fs) {
		fullScreen = fs;
	}
	
	returnObj.getFullScreen = function() {
		return fullScreen;
	}

	returnObj.setAlwaysOnTop = function(aot) {
		alwaysOnTop = aot;
	}
	
	returnObj.getAlwaysOnTop = function() {
		return alwaysOnTop;
	}

	returnObj.setToSystemTray = function(tst) {
		toSystemTray = tst;
	}
	
	returnObj.getToSystemTray = function() {
		return toSystemTray;
	}

	returnObj.setShowControlPanel = function(scp) {
		showControlPanel = scp;
	}
	
	returnObj.getShowControlPanel = function() {
		return showControlPanel;
	}	
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	
	return returnObj;
}
