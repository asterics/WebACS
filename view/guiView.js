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
 
 ACS.guiView = function(model, // ACS.model
						modelContainerId, // String
						editorProperties) { // ACS.editorProperties
						
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var guiStage; // Kinetic.Stage
	var guiLayer; // Kinetic.Layer
	var areGUI; // guiViewElement
	var componentGUIs = []; // Array<Object {component, guiViewElement}>
	var gridLines = []; // Array<Kinetic.Line>
	var img = null; // Image
	
// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var addComponent = function(comp) {
		if (comp.gui) {
			if (model.modelGui.getDecoration()) { // if decoration enabled, position componentGUI below
				comp.gui.setNewPosition({x: comp.gui.getX(), y: comp.gui.getY() + ACS.vConst.GUIVIEW_DECORATIONHEIGHT});
			}
			if (comp.gui.getIsExternal()) { // external components can be dragged and resized on the whole canvas
				componentGUIs.push({component: comp,
									guiViewElement: ACS.guiViewElement(	model,
																		comp.gui,
																		guiLayer,
																		{width: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X - comp.gui.getX(), height: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y - comp.gui.getY()},
																		{left: 0, right: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X, upper: 0, lower: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y},
																		comp.getId(),
																		ACS.vConst.GUIVIEW_EXTERNALCOMPONENTGUIBACKGROUND,
																		editorProperties)});			
			} else { // internal components can be dragged and resized only within the areGUI
				componentGUIs.push({component: comp,
									guiViewElement: ACS.guiViewElement(	model,
																		comp.gui,
																		guiLayer,
																		{width: areGUI.getWidth() - (comp.gui.getX() - areGUI.getX()), height: areGUI.getHeight() - (comp.gui.getY() - areGUI.getY())},
																		{left: areGUI.getX(), right: areGUI.getX() + areGUI.getWidth(), upper: areGUI.getY(), lower: areGUI.getY() + areGUI.getHeight()},
																		comp.getId(),
																		ACS.vConst.GUIVIEW_COMPONENTGUIBACKGROUND,
																		editorProperties)});
				componentGUIs[componentGUIs.length - 1].guiViewElement.setParent(areGUI);
				areGUI.addChildElement(componentGUIs[componentGUIs.length - 1].guiViewElement);
			}
		}
	}

	var makeGrid = function() {
		var steps;
		switch (editorProperties.getGridSteps()) {
			case ACS.gridStepType.SMALL: steps = ACS.vConst.GUIVIEW_GRIDSTEPS_SMALL;
										 break;
			case ACS.gridStepType.MEDIUM: steps = ACS.vConst.GUIVIEW_GRIDSTEPS_MEDIUM;
										  break;
			case ACS.gridStepType.LARGE: steps = ACS.vConst.GUIVIEW_GRIDSTEPS_LARGE;
										 break;
			case ACS.gridStepType.HUGE: steps = ACS.vConst.GUIVIEW_GRIDSTEPS_HUGE;
										break;											 
		}
		// draw vertical lines
		var linePos = steps;
		while (linePos < editorProperties.getGuiDesignerSize().width) {
			gridLines.push(new Kinetic.Line({
				x: linePos,
				y: 0,
				points: [0, 1, 0, editorProperties.getGuiDesignerSize().height - 2],
				stroke: ACS.vConst.GUIVIEW_GRIDLINECOLOR,
				strokeWidth: 1
			}));
			linePos = linePos + steps;
		}
		// draw horizontal lines
		var linePos = steps;
		while (linePos < editorProperties.getGuiDesignerSize().height) {
			gridLines.push(new Kinetic.Line({
				x: 0,
				y: linePos,
				points: [1, 0, editorProperties.getGuiDesignerSize().width - 2, 0],
				stroke: ACS.vConst.GUIVIEW_GRIDLINECOLOR,
				strokeWidth: 1
			}));
			linePos = linePos + steps;
		}
		// add the lines to the layer
		for (var i = 0; i < gridLines.length; i++) {
			guiLayer.add(gridLines[i]);
		}
	}
	
	var showGrid = function(show) {
		for (var i = 0; i < gridLines.length; i++) {
			gridLine[i].visible(show);
		}
	}
	
	var killGrid = function() {
		for (var i = 0; i < gridLines.length; i++) {
			gridLine[i].destroy();
		}
		gridLines = [];
	}
	
	var switchGrid = function(on) {
		if (on) {
			if (gridLines.length > 0) {
				showGrid(true);
			} else {
				makeGrid();
			}
			guiLayer.draw();
		} else {
			showGrid(false);
			guiLayer.draw();
		}
	}
	
	// ********************************************** handlers ***********************************************************
	var componentAddedEventHandler = function() {
		if (model.componentList.length > 0) {
			addComponent(model.componentList[model.componentList.length - 1]);
			guiLayer.draw();
		}
	}
	
	var componentRemovedEventHandler = function() {
		var i = 0;
		for (var i = 0; i < componentGUIs.length; i++) {
			var found = false;
			for (var j = 0; j < model.componentList.length; j++) {
				if (componentGUIs[i].component === model.componentList[j]) {
					found = true;
				}
			}
			if (!found) {
				componentGUIs[i].guiViewElement.destroy();
				componentGUIs.splice(i, 1);
				guiLayer.draw();
			}
		}
	}
	
	var modelChangedEventHandler = function() {
		// destroy all old components
		while (componentGUIs.length > 0) {
			componentGUIs.pop().destroy();
		}
		// set decoration and controls
		areGUI.setDecoration(model.modelGui.getDecoration());
		areGUI.setAREControls(model.modelGui.getShowControlPanel());
		areGUI.reCalcSizeBoundsMin();
		// add new components
		for (var i = 0; i < model.componentList.length; i++) {
			addComponent(model.componentList[i]);
		}
		guiLayer.draw();		
	}
	
	var showGridChangedEventHandler = function() {
		switchGrid(editorProperties.getShowGrid());
	}
	
	var gridStepsChangedEventHandler = function() {
		killGrid();
		makeGrid();
	}
	
	var screenResChangedEventHandler = function() {
		guiStage.width(editorProperties.getGuiDesignerSize().width);
		guiStage.height(editorProperties.getGuiDesignerSize().height);
		guiLayer.width(editorProperties.getGuiDesignerSize().width);
		guiLayer.height(editorProperties.getGuiDesignerSize().height);
		areGUI.setSizeBoundsMax({width: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X - model.modelGui.areGuiWindow.getX(), height: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y - model.modelGui.areGuiWindow.getY()});
		areGUI.setDragBounds({left: 0, right: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X, upper: 0, lower: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y});
		for (var i = 0; i < componentGUIs.length; i++) {
			if (componentGUIs[i].getGui().getIsExternal()) {
				componentGUIs[i].setSizeBoundsMax({width: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X - componentGUIs[i].getX(), height: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y - componentGUIs[i].getY()});
				componentGUIs[i].setDragBounds({left: 0, right: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X, upper: 0, lower: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y});
			}
		}
	}
	
	var decorationChangedEventHandler = function() {
		areGUI.setDecoration(model.modelGui.getDecoration());
	}

	var showControlPanelChangedEventHandler = function() {
		areGUI.setAREControls(model.modelGui.getShowControlPanel());
		areGUI.reCalcSizeBoundsMin();
	}	
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};
	returnObj.getGuiEditorProperties = function(){
		return editorProperties;
	}
	
// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	guiStage = new Kinetic.Stage({
		container: 'guiPanel' + modelContainerId,
		width: editorProperties.getGuiDesignerSize().width,
		height: editorProperties.getGuiDesignerSize().height
	});
	guiLayer = new Kinetic.Layer({
		width: editorProperties.getGuiDesignerSize().width,
		height: editorProperties.getGuiDesignerSize().height
	});
	guiStage.add(guiLayer);
	
	var guiDesignerFrame = new Kinetic.Rect({x: 0, 
											 y: 0, 
											 width: editorProperties.getGuiDesignerSize().width,
											 height: editorProperties.getGuiDesignerSize().height,
											 stroke: 'black'});
	guiLayer.add(guiDesignerFrame);
	
	switchGrid(editorProperties.getShowGrid());
	
	areGUI = ACS.guiViewElement(model,
								model.modelGui.areGuiWindow,
								guiLayer, 
								{width: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X - model.modelGui.areGuiWindow.getX(), height: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y - model.modelGui.areGuiWindow.getY()},
								{left: 0, right: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_X, upper: 0, lower: ACS.vConst.GUIVIEWELEMENT_NORMSCREENRES_Y},
								ACS.vConst.GUIVIEW_AREWINDOWNAME,
								ACS.vConst.GUIVIEW_AREWINDOWBACKGROUND,
								editorProperties);
	areGUI.setDecoration(model.modelGui.getDecoration());
	if (model.modelGui.getShowControlPanel()) areGUI.setAREControls(true);
	for (var i = 0; i < model.componentList.length; i++) {
		addComponent(model.componentList[i]);
	}
	guiLayer.draw();
	
	model.events.registerHandler('componentAddedEvent', componentAddedEventHandler);
	model.events.registerHandler('componentRemovedEvent', componentRemovedEventHandler);
	model.events.registerHandler('modelChangedEvent', modelChangedEventHandler);
	editorProperties.events.registerHandler('showGridChangedEvent', showGridChangedEventHandler);
	editorProperties.events.registerHandler('gridStepsChangedEvent', gridStepsChangedEventHandler);
	editorProperties.events.registerHandler('screenResChangedEvent', screenResChangedEventHandler);
	model.modelGui.events.registerHandler('decorationChangedEvent', decorationChangedEventHandler);
	model.modelGui.events.registerHandler('showControlPanelChangedEvent', showControlPanelChangedEventHandler);
	
	return returnObj;
}