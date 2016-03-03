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
 
ACS.dragDropAction = function(parentModel, 	// ACS.model
							  compList) {	// Array<ACS.component>

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = ACS.action(parentModel);
	
	returnObj.execute = function() {
		if (endCoord.length === 0) {
			// set end coordinates to current values
			for (var i = 0; i < compList.length; i++) {
				endCoord[i] = {'x': compList[i].getX(),
							   'y': compList[i].getY()};
			}
		}
		// assume that this is a redo and reposition components
		for (var i = 0; i < compList.length; i++) {
			compList[i].setNewPosition(endCoord[i].x, endCoord[i].y);
		}
		parentModel.undoStack.push(returnObj);
	}
	
	returnObj.undo = function() {
		// reset components to start coordinates
		for (var i = 0; i < compList.length; i++) {
			compList[i].setNewPosition(startCoord[i].x, startCoord[i].y);
		}
		parentModel.redoStack.push(returnObj);
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	parentModel.redoStack = [];
	var startCoord = [];
	var endCoord = [];

	for (var i = 0; i < compList.length; i++) {
		startCoord[i] = {'x': compList[i].getX(),
						 'y': compList[i].getY()};
	}
	
	return returnObj;
}