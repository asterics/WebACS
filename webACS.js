ACS.webACS = function() {
	// private variables
	var modelList = ACS.modelList();
	var menu = ACS.menuView(modelList);
	var canvas = ACS.canvasView(modelList);
	var propertyEditor = ACS.propertyEditor(modelList);

	// private methods
	
	// public stuff
	var returnObj = {};

	// constructor code
	log.setLevel(log.levels.TRACE); // loglevel usage log.trace(msg), log.debug(msg), log.info(msg), log.warn(msg), log.error(msg) (https://github.com/pimterry/loglevel)
	menu.setComponentMenu();
		
	return returnObj;
}