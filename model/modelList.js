ACS.modelList = function() {

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var list = []; // ACS.model
	var filenameCounter = 1;
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.actIndex = 0;
	returnObj.events = ACS.eventManager();
	
	returnObj.removeSubstituteFilename = function() { // is called when actModel is removed or loaded from a file
		var actNumber = list[returnObj.actIndex].getFilename().slice(7); // removing the 7-letter-word "newfile" leaves the number
		if ((filenameCounter - 1) + '' === actNumber) filenameCounter--;
	}	
	
	returnObj.addNewModel = function() {
		this.actIndex = (list.push(ACS.model('newFile' + filenameCounter))) - 1;
		filenameCounter++;
		this.events.fireEvent('actModelChangedEvent');
		this.events.fireEvent('newModelAddedEvent');
		list[this.actIndex].events.registerHandler('filenameBeingChangedEvent', returnObj.removeSubstituteFilename);
	}
	
	returnObj.getActModel = function() {
		return list[this.actIndex];
	}
	
	returnObj.setActModel = function(actIndex) {
		if ((actIndex > -1) && (actIndex < list.length)) {
			this.actIndex = actIndex;
			this.events.fireEvent('actModelChangedEvent');
			return true;
		}  else {
			return false;
		}
	}
	
	returnObj.getModelAtIndex = function(index) {
		return list[index];
	}
	
	returnObj.removeModel = function() { // removes the actModel
		this.events.fireEvent('removingModelEvent');
		this.removeSubstituteFilename();
		list.splice(this.actIndex, 1);
		if (this.actIndex > (list.length - 1)) this.actIndex--; // if no more models to the right, go to the left
		if (this.actIndex === -1) { // if list is empty, add a new empty model again
			returnObj.addNewModel();
		}
		this.events.fireEvent('actModelChangedEvent');
	}
	
	returnObj.getLength = function() {
		return list.length;
	}
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	returnObj.addNewModel();
	
	return returnObj;
}