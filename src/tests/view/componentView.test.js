import Model from "../../model/model.js";
import ClipBoard from "../../model/clipBoard.js"
import Component from "../../model/component.js";

import ModelView from "../../view/modelView.js";
import ComponentView from "../../view/componentView.js";
import EditorProperties from "../../view/editorProperties.js";
import vConst from "../../view/vConst.js";

import Kinetic from "kinetic";

import resetDocument from "../resetDocument.js";

// initialisation is implicitly tested by 'getComponent'

describe('ComponentView', () => {

	test('setVisible()', () => {
		resetDocument();
		var component = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var model = Model('model1');
		model.addComponent(component);
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var guiLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
			height: vConst.MODELVIEW_GUIDESIGNERSIZEY
		});	
		var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
		expect(componentView.getVisible()).toBe(true); // checking default
		componentView.setVisible(false);
		expect(componentView.getVisible()).toBe(false);
		expect(componentView.getView().isVisible()).toBe(false);
		componentView.setVisible(true);
		expect(componentView.getVisible()).toBe(true);
		expect(componentView.getView().isVisible()).toBe(true);
	});

	test('getComponent()', () => {
		resetDocument();
		var component = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var model = Model('model1');
		model.addComponent(component);
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var guiLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
			height: vConst.MODELVIEW_GUIDESIGNERSIZEY
		});	
		var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
		expect(componentView.getComponent()).toBe(component);
	});

	test('destroy()', () => {
		resetDocument();
		var component = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var model = Model('model1');
		model.addComponent(component);
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var guiLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
			height: vConst.MODELVIEW_GUIDESIGNERSIZEY
		});	
		var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
		componentView.destroy();
		expect(componentView.getView()).toBe(null);
	});

	test('getView()', () => {
		resetDocument();
		var component = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var model = Model('model1');
		model.addComponent(component);
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var guiLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
			height: vConst.MODELVIEW_GUIDESIGNERSIZEY
		});	
		var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
		expect(typeof componentView.getView()).toBe('object');
	});

	test('selectedEventHandler()', () => {
		resetDocument();
		var component = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var model = Model('model1');
		model.addComponent(component);
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var guiLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
			height: vConst.MODELVIEW_GUIDESIGNERSIZEY
		});	
		var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
		expect(componentView.getView().getChildren()[1].isVisible()).toBe(false);
		component.setIsSelected(true);
		expect(componentView.getView().getChildren()[1].isVisible()).toBe(true);
	});

	test('deSelectedEventHandler()', () => {
		resetDocument();
		var component = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var model = Model('model1');
		model.addComponent(component);
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var guiLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
			height: vConst.MODELVIEW_GUIDESIGNERSIZEY
		});	
		var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
		component.setIsSelected(true);
		expect(componentView.getView().getChildren()[1].isVisible()).toBe(true);
		component.setIsSelected(false);
		expect(componentView.getView().getChildren()[1].isVisible()).toBe(false);
	});
});