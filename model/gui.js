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
 
 ACS.gui = function(x, // int
				    y, // int
				    width, // int
				    height, // int
				    isExternal) { // bool

// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.events = ACS.eventManager();
	
	returnObj.setNewPosition = function(pos) { // Object {x: int, y: int}
		x = pos.x;
		y = pos.y;
		returnObj.events.fireEvent('guiPositionChangedEvent');
	}
	
	returnObj.setNewSize = function(newSize) { // Object {width: int, height: int}
		width = newSize.width;
		height = newSize.height;
		returnObj.events.fireEvent('guiSizeChangedEvent');
	}
	
	returnObj.getIsExternal = function() {
		return isExternal;
	}	
	
	returnObj.getX = function() {
		return Number(x);
	}
	
	returnObj.getY = function() {
		return Number(y);
	}
	
	returnObj.getWidth = function() {
		return Number(width);
	}	

	returnObj.getHeight = function() {
		return Number(height);
	}		

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	
	return returnObj;
}