ACS.modelView = function(	modelContainerId, // String
							model) { // ACS.model
							
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
		if (removedComponents.length > 0) {
			var alertString = 'The definition of the following components was not found in the component\ncollection - they have therefore been removed from the model:\n\n';
			for (j = 0; j < removedComponents.length; j++) {
				model.removeComponent(removedComponents[j]);
				var compTypeId = removedComponents[j].getComponentTypeId();
				alertString = alertString + removedComponents[j].getId() + ' ('	+ compTypeId.substring(9, compTypeId.length) + ')\n';
			}
			alert(alertString);
		}
		// alert the user in case some components do not match the component collection, in which case ports and properties would be reset to default values
		if (changedComponents.length > 0) {
			var alertString = 'The definition of the following components did not match the component\ncollection - undefined properties or ports have been reset to default values:\n\n';
			for (j = 0; j < changedComponents.length; j++) {
				var compTypeId = changedComponents[j].getComponentTypeId();
				alertString = alertString + changedComponents[j].getId() + ' ('	+ compTypeId.substring(9, compTypeId.length) + ')\n';
			}
			alert(alertString);
		}
		
		for (i = 0; i < model.dataChannelList.length; i++) {
			dataChannelViewList[i] = ACS.dataChannelView(model.dataChannelList[i], model, modelLayer);
		}
		for (i = 0; i < model.eventChannelList.length; i++) {
			var ecv = getEventChannelView(model.eventChannelList[i].trigger.getParentComponent(), model.eventChannelList[i].listener.getParentComponent());
			if (ecv) {
				ecv.ecList.push(model.eventChannelList[i]);
			} else {
				eventChannelViewList.push(ACS.eventChannelView(model.eventChannelList[i], null, model, modelLayer));
			}
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
				for (var j = 0; j < eventChannelViewList[i].ecList.length; j++) {
					model.addItemToSelection(eventChannelViewList[i].ecList[j]);
				}
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
	
	var getEventChannelView = function(startC, endC) {
		for (var i = 0; i < eventChannelViewList.length; i++) {
			if ((eventChannelViewList[i].getStartComponent() === startC) && (eventChannelViewList[i].getEndComponent() === endC)) {
				return eventChannelViewList[i];
			}
		}
		return null;
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
		dataChannelViewList.push(ACS.dataChannelView(model.dataChannelList[model.dataChannelList.length -1], model, modelLayer));
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
		var ecv = getEventChannelView(model.eventChannelList[model.eventChannelList.length -1].trigger.getParentComponent(), model.eventChannelList[model.eventChannelList.length -1].listener.getParentComponent());
		if (ecv) {
			ecv.ecList.push(model.eventChannelList[model.eventChannelList.length -1]);
		} else {
			eventChannelViewList.push(ACS.eventChannelView(model.eventChannelList[model.eventChannelList.length -1], null, model, modelLayer));
			modelLayer.draw();
		}	
	}
	
	var eventChannelRemovedEventHandler = function() {
		var found = false;
		var i = 0;
		while (!found && (i < eventChannelViewList.length)) {
			var j = 0;
			while (!found && (j < eventChannelViewList[i].ecList.length)) {
				if (!eventChannelExists(eventChannelViewList[i].ecList[j])) {
					eventChannelViewList[i].ecList.splice(j, 1);
					found = true;
				}
				j++;
			}
			i++;
		}
	}
	
	var eventChannelViewMightNeedRemovingEventHandler = function() {
		// this event gets fired, when some items have been selected and deleted
		var i = 0;
		while (i < eventChannelViewList.length) {
			if (eventChannelViewList[i].ecList.length === 0) {
				eventChannelViewList[i].destroy();
				eventChannelViewList.splice(i, 1);
			} else {
				i++;
			}
		}
		modelLayer.draw();
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
	
	returnObj.addEventChannelView = function(ecv) {
		eventChannelViewList.push(ecv);
	}
	
	returnObj.removeEventChannelView = function(ecv) {
		for (var i = 0; i < eventChannelViewList.length; i++) {
			if (eventChannelViewList[i] === ecv) {
				for (var j = 0; j < eventChannelViewList[i].ecList.length; j++) {
					model.removeEventChannel(eventChannelViewList[i].ecList[j]);
				}
				eventChannelViewList[i].destroy();
				eventChannelViewList.splice(i, 1);
				modelLayer.draw();
				return true;
			}
		}
		return false;
	}
	
	returnObj.getEventChannelViewList = function() {
		return eventChannelViewList;
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
		draggable: true
	});
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
	model.events.registerHandler('eventChannelViewMightNeedRemovingEvent', eventChannelViewMightNeedRemovingEventHandler);
	
	// register mouse-event handlers
	modelLayer.on('mousemove', function() {
		var mousePos = modelStage.getPointerPosition();
		if ((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort())) {
			dataChannelViewList[dataChannelViewList.length - 1].setEndPoint(mousePos.x, mousePos.y);
			this.draw();
		} else if ((eventChannelViewList.length > 0) && (!eventChannelViewList[eventChannelViewList.length - 1].getEndComponent())) {
			eventChannelViewList[eventChannelViewList.length - 1].setEndPoint(mousePos.x, mousePos.y)
			this.draw();
		} else if (focusRect) {
			focusRect.width(mousePos.x - focusRect.x() - 2); // the "- 2" is a workaround to KineticJS' anti-aliasing-bug
			focusRect.height(mousePos.y - focusRect.y() - 2); // the "- 2" is a workaround to KineticJS' anti-aliasing-bug
			modelLayer.draw();
		}
	});
	
	modelLayer.on('click', function(e) {
		if ((model.dataChannelList.length > 0) && (!model.dataChannelList[model.dataChannelList.length - 1].getInputPort())) {
			// started channel is dropped, because click was not on an inputPort
			var ch = model.undoStack.pop();
			ch.undo();
		} else if ((eventChannelViewList.length > 0) && (!eventChannelViewList[eventChannelViewList.length - 1].getEndComponent())) {
			eventChannelViewList[eventChannelViewList.length - 1].destroy();
			eventChannelViewList.pop();
			this.draw();
			log.debug('eventChannel dropped');
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
	
	returnObj.selectedComponentsGroup.on('dragmove', function() {
		for (var i = 0; i <returnObj.selectedComponentsGroup.children.length; i++) {
			var elem = returnObj.selectedComponentsGroup.getChildren()[i];
			elem.attrs.comp.setNewPosition(elem.getChildren()[2].getAbsolutePosition().x, elem.getChildren()[2].getAbsolutePosition().y);
		}
	});
	
	return returnObj;
}