ACS.webACS = function() {
	// *************************************************************************************************************************
	var modelList = ACS.modelList();
	var view = ACS.view(modelList);

	// private methods
	
	// public stuff
	var returnObj = {};

	// constructor code
	log.setLevel(log.levels.TRACE); // loglevel usage log.trace(msg), log.debug(msg), log.info(msg), log.warn(msg), log.error(msg) (https://github.com/pimterry/loglevel)
		
	return returnObj;
}