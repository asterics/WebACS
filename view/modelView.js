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
 
 ACS.modelView = function(	modelContainerId, // String
							model, // ACS.modelList
							clipBoard) { // ACS.clipBoard
							
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var modelTabPanel = ACS.tabPanel(modelContainerId, 'modelTab', 'modelPanel');
	var componentViewList = []; // Array<ACS.componentView>
	var dataChannelViewList = []; // Array<ACS.dataChannelView>
	var eventChannelViewList = []; // Array<ACS.eventChannelView>
	var visualAreaMarkerViewList = []; // Array<ACS.visualMarkerView>
	var modelStage; // Kinetic.Stage
	var modelLayer; // Kinetic.Layer
	var guiStage; // Kinetic.Stage
	var guiLayer; // Kinetic.Layer
	var focusRect = null; // Kinetic.Rect
	var dragAct = null; // ACS.dragDropAction
	var dragging = false; // boolean
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var drawCompleteModel = function() {
		var i;
		// destroy and delete the old views:
		for (i = 0; i < componentViewList.length; i++) componentViewList[i].destroy();
		componentViewList = [];
		for (i = 0; i < dataChannelViewList.length; i++) dataChannelViewList[i].destroy();
		dataChannelViewList = [];
		for (i = 0; i < eventChannelViewList.length; i++) eventChannelViewList[i].destroy();
		eventChannelViewList = [];
		for (i = 0; i < visualAreaMarkerViewList.length; i++) visualAreaMarkerViewList[i].destroy();
		visualAreaMarkerViewList = [];
		// instantiate new views:
		var removedComponents = [];
		var changedComponents = [];
		for (i = 0; i < model.componentList.length; i++) {
			if (model.componentList[i].foundInComponentCollection) {
				componentViewList.push(ACS.componentView(model.componentList[i], model, returnObj, modelLayer, guiLayer));
				if (!model.componentList[i].matchesComponentCollection) {
					changedComponents.push(model.componentList[i]);
				}
			} else {
				removedComponents.push(model.componentList[i]);
			}
		}
		
		// alert the user in case some components were not found in the component collection and therefore removed from the model
		alertUserOfRemovedComponents(removedComponents, true);
		// alert the user in case some components do not match the component collection, in which case ports and properties would be reset to default values
		alertUserOfChangedComponents(changedComponents);
		
		for (i = 0; i < model.dataChannelList.length; i++) {
			dataChannelViewList[i] = ACS.dataChannelView(model.dataChannelList[i], model, returnObj, modelLayer);
		}
		for (i = 0; i < model.eventChannelList.length; i++) {
			eventChannelViewList[i] = ACS.eventChannelView(model.eventChannelList[i], model, returnObj, modelLayer);
		}
		for (i = 0; i < model.visualAreaMarkerList.length; i++) {
			visualAreaMarkerViewList[i] = ACS.visualAreaMarkerView(model.visualAreaMarkerList[i], modelLayer);
		}
		// actually do the drawing:
		modelLayer.draw();
	}
	
	var selectInFocusRect = function() {
		model.deSelectAll(); // clears all earlier selections
		var focusRectCorners = sortCorners(focusRect); // Object defining the corners of the focusRect: tl: top-left, tr: top-right, br: bottom-right, bl: bottom-left	
		// check all components for intersection with focusRect
		for (var i = 0; i < componentViewList.length; i++) {
			var intersectionFound = false;
			var viewCorners = sortCorners(componentViewList[i].getView().children[0]);
			for (var j = viewCorners.tl[0]; j < viewCorners.tr[0]; j++) {
				if (pointInRect(j, viewCorners.tl[1], focusRectCorners) || pointInRect(j, viewCorners.bl[1], focusRectCorners)) {
					intersectionFound = true;
					break;
				}
			}
			if (!intersectionFound) {
				for (var j = viewCorners.tl[1]; j < viewCorners.bl[1]; j++) {
					if (pointInRect(viewCorners.tl[0], j, focusRectCorners) || pointInRect(viewCorners.tr[0], j, focusRectCorners)) {
						intersectionFound = true;
						break;
					}
				}
			}
			if (intersectionFound) {
				model.addItemToSelection(componentViewList[i].getComponent());
				log.debug('component selected');
			}
		}
		// check all dataChannels for intersection with focusRect
		for (var i = 0; i < dataChannelViewList.length; i++) {
			var intersectionFound = false;
			var points = dataChannelViewList[i].line.getPoints();
			var lineDef = {
				startPoint: [points[0], points[1]],
				vector: [points[2] - points[0], points[3] - points[1]]
			}
			for (var j = 0; j < 1; j+=0.01) {
				if (pointInRect(lineDef.startPoint[0] + j * lineDef.vector[0], lineDef.startPoint[1] + j * lineDef.vector[1], focusRectCorners)) {
					intersectionFound = true;
					break;
				}
			}
			if (intersectionFound) {
				model.addItemToSelection(dataChannelViewList[i].getChannel());
				log.debug('dataChannel selected');
			}
		}
		// check all eventChannels for intersection with focusRect
		for (var i = 0; i < eventChannelViewList.length; i++) {
			var intersectionFound = false;
			var points = eventChannelViewList[i].line.getPoints();
			var lineDef = {
				startPoint: [points[0], points[1]],
				vector: [points[2] - points[0], points[3] - points[1]]
			}
			for (var j = 0; j < 1; j+=0.01) {
				if (pointInRect(lineDef.startPoint[0] + j * lineDef.vector[0], lineDef.startPoint[1] + j * lineDef.vector[1], focusRectCorners)) {
					intersectionFound = true;
					break;
				}
			}
			if (intersectionFound) {
				model.addItemToSelection(eventChannelViewList[i].getChannel());
				log.debug('eventChannel selected');
			}
		}
	}	
	
	// ********************************************** private helper methods *********************************************
	var eventChannelExists = function(ec) {
		for (var i = 0; i < model.eventChannelList.length; i++) {
			if (model.eventChannelList[i] === ec) return true;
		}
		return false;
	}
	
	var sortCorners = function(shape) { // returns an Object defining the corners of the given Kinetic.Shape: tl: top-left, tr: top-right, br: bottom-right, bl: bottom-left	
		var corners = {tl: [], tr: [], br: [], bl: []};
		// set all x-coordinates
		if (shape.width() < 0) {
			corners.tl[0] = shape.x() + shape.width();
			corners.tr[0] = shape.x();
			corners.br[0] = shape.x();
			corners.bl[0] = shape.x() + shape.width();
		} else {
			corners.tl[0] = shape.x();
			corners.tr[0] = shape.x() + shape.width();
			corners.br[0] = shape.x() + shape.width();
			corners.bl[0] = shape.x();
		}
		// set all y-coordinates
		if (shape.height() < 0) {
			corners.tl[1] = shape.y() + shape.height();
			corners.tr[1] = shape.y() + shape.height();
			corners.br[1] = shape.y();
			corners.bl[1] = shape.y();
		} else {
			corners.tl[1] = shape.y();
			corners.tr[1] = shape.y();
			corners.br[1] = shape.y() + shape.height();
			corners.bl[1] = shape.y() + shape.height();
		}
		return corners;
	}
	
	var pointInRect = function(x, y, rectCorners) { // rectCorners is an Object defining the corners of a rectangle: tl: top-left, tr: top-right, br: bottom-right, bl: bottom-left
		if (((x > rectCorners.tl[0]) && (x < rectCorners.tr[0])) && ((y > rectCorners.tl[1]) && (y < rectCorners.bl[1]))) {
			return true;
		}
		return false;
	}
	
	var alertUserOfRemovedComponents = function(removedComponents, removeFromModel) {
		if (removedComponents.length > 0) {
			var alertString = ACS.vConst.MODELVIEW_ALERTSTRINGREMOVEDCOMPONENTS;
			for (j = 0; j < removedComponents.length; j++) {
				if (removeFromModel) model.removeComponent(removedComponents[j]);
				var compTypeId = removedComponents[j].getComponentTypeId();
				alertString = alertString + removedComponents[j].getId() + ' ('	+ compTypeId.substring(9, compTypeId.length) + ')\n';
			}
			alert(alertString);
		}
	}
	
	var alertUserOfChangedComponents = function(changedComponents) {
		if (changedComponents.length > 0) {
			var alertString = ACS.vConst.MODELVIEW_ALERTSTRINGCHANGEDCOMPONENTS;
			for (j = 0; j < changedComponents.length; j++) {
				var compTypeId = changedComponents[j].getComponentTypeId();
				alertString = alertString + changedComponents[j].getId() + ' ('	+ compTypeId.substring(9, compTypeId.length) + ')\n';
			}
			alert(alertString);
		}
	}
	
	var getSelectedComponentsList = function() {
		var compList = [];
		for (var i = 0; i <returnObj.selectedComponentsGroup.children.length; i++) {
			compList[i] = returnObj.selectedComponentsGroup.getChildren()[i].attrs.comp;
		}
		
		return compList;
	}
	
	// ********************************************** handlers ***********************************************************
	var modelChangedEventHandler = function() {
		drawCompleteModel();
	}
	
	var componentAddedEventHandler = function() {
		if (model.componentList.length > 0) componentViewList.push(ACS.componentView(model.componentList[model.componentList.length - 1], model, returnObj, modelLayer, guiLayer));
		modelLayer.draw();
	}
	
	var componentRemovedEventHandler = function() {
		var i = 0;
		for (var i = 0; i < componentViewList.length; i++) {
			var found = false;
			for (var j = 0; j < model.componentList.length; j++) {
				if (componentViewList[i].getComponent() === model.componentList[j]) {
					found = true;
				}
			}
			if (!found) {
				componentViewList[i].destroy();
				componentViewList.splice(i, 1);
				modelLayer.draw();
			}
		}
	}
	
	var dataChannelAddedEventHandler = function() {
		dataChannelViewList.push(ACS.dataChannelView(model.dataChannelList[model.dataChannelList.length -1], model, returnObj, modelLayer));
		modelLayer.draw();
	}
	
	var dataChannelRemovedEventHandler = function() {
		var found = false;
		var i = 0;
		while (!found && (i < dataChannelViewList.length)) {
			if (dataChannelViewList[i].getChannel() !== model.dataChannelList[i]) {
				dataChannelViewList[i].destroy();
				dataChannelViewList.splice(i, 1);
				modelLayer.draw();
				found = true;
			}
			i++;
		}
	}
	
	var eventChannelAddedEventHandler = function() {
		eventChannelViewList.push(ACS.eventChannelView(model.eventChannelList[model.eventChannelList.length -1], model, returnObj, modelLayer));
		modelLayer.draw();
	}
	
	var eventChannelRemovedEventHandler = function() {
		var found = false;
		var i = 0;
		while (!found && (i < eventChannelViewList.length)) {
			if (!eventChannelExists(eventChannelViewList[i].getChannel())) {
				eventChannelViewList[i].destroy();
				eventChannelViewList.splice(i, 1);
				modelLayer.draw();
				found = true;
			}
			i++;
		}
	}
	
	var alertUserOfComponentCollectionMismatchEventHandler = function() {
		alertUserOfRemovedComponents(clipBoard.getRemovedComponentsList(), false);
		alertUserOfChangedComponents(clipBoard.getChangedComponentsList());
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	
	returnObj.selectedComponentsGroup = null;
	
	returnObj.getModel = function() {
		return model;
	}
	
	returnObj.getModelContainerId = function() {
		return modelContainerId;
	}
	
	returnObj.isDragging = function() {
		return dragging;
	}	
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	// initiate the tabPanel:
	var ul = document.createElement('ul');
	ul.setAttribute('id', modelContainerId + 'TabList');
	ul.setAttribute('class', 'tablist');
	ul.setAttribute('role', 'tablist');
	document.getElementById(modelContainerId).appendChild(ul);
	var li1 = document.createElement('li');
	li1.setAttribute('id', 'modelTab' + modelContainerId);
	li1.setAttribute('class', 'tab modelTab');
	li1.setAttribute('aria-controls', 'modelPanel' + modelContainerId);
	li1.setAttribute('aria-selected', 'false');
	li1.setAttribute('role', 'tab');
	li1.setAttribute('tabindex', -1);
	li1.textContent = ACS.vConst.MODELVIEW_MODELDESIGNERHEADER;
	document.getElementById(modelContainerId + 'TabList').appendChild(li1);
	var div = document.createElement('div');
	div.setAttribute('id', 'modelPanel' + modelContainerId);
	div.setAttribute('class', 'panel modelPanel');
	div.setAttribute('aria-labelledby', 'modelTab' + modelContainerId);
	div.setAttribute('role', 'tabpanel');
	document.getElementById(modelContainerId).appendChild(div);
	var li2 = document.createElement('li');
	li2.setAttribute('id', 'guiTab' + modelContainerId);
	li2.setAttribute('class', 'tab modelTab');
	li2.setAttribute('aria-controls', 'guiPanel' + modelContainerId);
	li2.setAttribute('aria-selected', 'false');
	li2.setAttribute('role', 'tab');
	li2.setAttribute('tabindex', -1);
	li2.textContent = ACS.vConst.MODELVIEW_GUIDESIGNERHEADER;
	document.getElementById(modelContainerId + 'TabList').appendChild(li2);
	div = document.createElement('div');
	div.setAttribute('id', 'guiPanel' + modelContainerId);
	div.setAttribute('class', 'panel modelPanel');
	div.setAttribute('aria-labelledby', 'guiTab' + modelContainerId);
	div.setAttribute('role', 'tabpanel');
	document.getElementById(modelContainerId).appendChild(div);
	modelTabPanel.updatePanel();
	// activate the modelTab (a simple li1.click() will not work in safari)
	var click_ev = document.createEvent("MouseEvents");
	click_ev.initEvent("click", true, true);
	li1.dispatchEvent(click_ev);
	// initiate Stages and Layers and add Layers:
	modelStage = new Kinetic.Stage({
		container: 'modelPanel' + modelContainerId,
		width: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	modelLayer = new Kinetic.Layer({
		width: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	modelStage.add(modelLayer);
	guiStage = new Kinetic.Stage({
		container: 'guiPanel' + modelContainerId,
		width: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_GUIDESIGNERSIZEY
	});
	guiStage.add(guiLayer);
	// draw a rectangle over the whole layer - only then mouse-events can be caught with layer.on(...) in KineticJS
	var transparentRect = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY,
		fill: 'transparent',
		strokeWidth: 0,
		listening: true
	});
	modelLayer.add(transparentRect);
	// initiate and add the Kinetic.Group that will hold the selected components (to make them draggable together)
	returnObj.selectedComponentsGroup = new Kinetic.Group({
		x: 0,
		y: 0,
		draggable: true,
		dragBoundFunc: function(pos) {
			var dx = pos.x - this.oldX;
			var dy = pos.y - this.oldY;
			// recalculate the groups bounds (see below)
			this.leftBound = this.leftBound + dx;
			this.rightBound = this.rightBound + dx;
			this.upperBound = this.upperBound + dy;
			this.lowerBound = this.lowerBound + dy;
			// check if any bound is now outside the canvas and set to canvas-edge if so
			if (this.leftBound < 0) {
				dx = dx - this.leftBound;
				this.leftBound = 0;
			}
			if (this.rightBound > ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX) {
				dx = dx - (this.rightBound - ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX);
				this.rightBound = ACS.vConst.MODELVIEW_MODELDESIGNERSIZEX;
			}
			if (this.upperBound < 0) {
				dy = dy - this.upperBound;
				this.upperBound = 0;
			}
			if (this.lowerBound > ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY) {
				dy = dy - (this.lowerBound - ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY);
				this.lowerBound = ACS.vConst.MODELVIEW_MODELDESIGNERSIZEY;
			}
			// calculate new position, based on corrected dx and dy
			var newX = this.oldX + dx;
			var newY = this.oldY + dy;
			// set oldX and OldY to new values for next dragMove
			this.oldX = newX;
			this.oldY = newY;
			// set the group to the corrected position - dragging outside the canvas is now not possible any more
			return {x: newX, y: newY};
		}
	});
	// the following custom attributes remember the old position of the group (to enalbe calculation of relative position changes while dragging)
	returnObj.selectedComponentsGroup.oldX = 0;
	returnObj.selectedComponentsGroup.oldY = 0;
	// the following are custom attributes for the outer bounds of the group, defined by the left-most, right-most, up-most and down-most element in the group
	// (the built-in attributes of the group cannot be used for this, since the Kinetic-group has width and height always 0 and its absolutePosition has 
	// nothing to do with the position of the child elements, when added)
	returnObj.selectedComponentsGroup.leftBound = 0;
	returnObj.selectedComponentsGroup.rightBound = 0;
	returnObj.selectedComponentsGroup.upperBound = 0;
	returnObj.selectedComponentsGroup.lowerBound = 0;		
		
	modelLayer.add(returnObj.selectedComponentsGroup);
	// draw the model
	drawCompleteModel();
	// register event-handlers
	model.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	model.events.registerHandler('componentAddedEvent', componentAddedEventHandler);
	model.events.registerHandler('componentRemovedEvent', componentRemovedEventHandler);
	model.events.registerHandler('dataChannelAddedEvent', dataChannelAddedEventHandler);
	model.events.registerHandler('dataChannelRemovedEvent', dataChannelRemovedEventHandler);
	model.events.registerHandler('eventChannelAddedEvent', eventChannelAddedEventHandler);
	model.events.registerHandler('eventChannelRemovedEvent', eventChannelRemovedEventHandler);
	model.events.registerHandler('alertUserOfComponentCollectionMismatchEvent', alertUserOfComponentCollectionMismatchEventHandler);
	
	// register mouse-event handlers
	modelLayer.on('mousemove', function() {
		var mousePos = modelStage.getPointerPosition();
		if ((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort())) {
			dataChannelViewList[dataChannelViewList.length - 1].setEndPoint(mousePos.x, mousePos.y);
			this.draw();
		} else if ((eventChannelViewList.length > 0) && (!eventChannelViewList[eventChannelViewList.length - 1].getChannel().endComponent)) {
			eventChannelViewList[eventChannelViewList.length - 1].setEndPoint(mousePos.x, mousePos.y)
			this.draw();
		} else if (focusRect) {
			focusRect.width(mousePos.x - focusRect.x() - 2); // the "- 2" is a workaround to KineticJS' anti-aliasing-bug
			focusRect.height(mousePos.y - focusRect.y() - 2); // the "- 2" is a workaround to KineticJS' anti-aliasing-bug
			modelLayer.draw();
		}
	});
	
	modelLayer.on('click', function(e) {
		// started channels of any kind are dropped, because click was not on an inputPort
		if (((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort())) || // unfinished dataChannel to be dropped
		   ((eventChannelViewList.length > 0) && (!eventChannelViewList[eventChannelViewList.length - 1].getChannel().endComponent))) { // unfinished eventChannel to be dropped
			var ch = model.undoStack.pop();
			ch.undo();
		}
	});
	
	modelLayer.on('mousedown', function() {
		if (!((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort()))) {
			var mousePos = modelStage.getPointerPosition();
			if (focusRect) focusRect.destroy();
			focusRect = new Kinetic.Rect({ 
				x: mousePos.x - 2, // the "- 2" is a workaround to KineticJS' anti-aliasing-bug
				y: mousePos.y - 2, // the "- 2" is a workaround to KineticJS' anti-aliasing-bug
				width: 0,
				height: 0,
				fill: ACS.vConst.MODELVIEW_FOCUSRECTCOLOR,
				stroke: ACS.vConst.MODELVIEW_FOCUSRECTSTROKECOLOR,
				strokeWidth: 1,
				listening: true
			});
			modelLayer.add(focusRect);
			modelLayer.draw();
		}
	});
	
	modelLayer.on('mouseup', function() {
		if (focusRect) {
			selectInFocusRect();
			focusRect.destroy();
			focusRect = null;
			modelLayer.draw();
		}
	});
	
	modelStage.on('contentMouseover', function(e) {
		// if mouse-button was released while outside the stage
		if (focusRect && e.evt.buttons === 0) {
			selectInFocusRect();
			focusRect.destroy();
			focusRect = null;
			modelLayer.draw();
		}
	});
	
	returnObj.selectedComponentsGroup.on('mousedown', function(e) {
		e.cancelBubble = true; // avoids the starting of a focusRect
	});
	
	returnObj.selectedComponentsGroup.on('dragstart', function() {
		dragging = true;
		dragAct = ACS.dragDropAction(model, getSelectedComponentsList());
	});
	
	returnObj.selectedComponentsGroup.on('dragmove', function() {
		for (var i = 0; i <returnObj.selectedComponentsGroup.children.length; i++) {
			var elem = returnObj.selectedComponentsGroup.getChildren()[i];
			elem.attrs.comp.setNewPosition(elem.getChildren()[2].getAbsolutePosition().x, elem.getChildren()[2].getAbsolutePosition().y);
		}
	});
	
	returnObj.selectedComponentsGroup.on('dragend', function() {
		dragging = false;
		dragAct.execute();
	});
	
	return returnObj;
}