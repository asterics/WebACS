import Model from "../../model/model.js";
import ClipBoard from "../../model/clipBoard.js"

import vConst from "../../view/vConst.js";

import Kinetic from "kinetic";

import QUnit from "qunit";

QUnit.module( 'componentView' );

// initialisation is implicitly tested by 'componentView getComponent'

QUnit.test( 'componentView setVisible_getVisible', function( assert ) {
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
	var modelView = ModelView('canvasPanelTest', model, clipBoard);
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: vConst.MODELVIEW_GUIDESIGNERSIZEY
	});	
	var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
	assert.strictEqual(componentView.getVisible(), true); // checking default
	componentView.setVisible(false);
	assert.strictEqual(componentView.getVisible(), false);
	assert.strictEqual(componentView.getView().isVisible(), false);
	componentView.setVisible(true);
	assert.strictEqual(componentView.getVisible(), true);
	assert.strictEqual(componentView.getView().isVisible(), true);	
});

QUnit.test( 'componentView getComponent', function( assert ) {
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
	var modelView = ModelView('canvasPanelTest', model, clipBoard);
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: vConst.MODELVIEW_GUIDESIGNERSIZEY
	});	
	var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
	assert.strictEqual(componentView.getComponent(), component);
});

QUnit.test( 'componentView destroy', function( assert ) {
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
	var modelView = ModelView('canvasPanelTest', model, clipBoard);
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: vConst.MODELVIEW_GUIDESIGNERSIZEY
	});	
	var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
	componentView.destroy();
	assert.strictEqual(componentView.getView(), null);
});

QUnit.test( 'componentView getView', function( assert ) {
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
	var modelView = ModelView('canvasPanelTest', model, clipBoard);
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: vConst.MODELVIEW_GUIDESIGNERSIZEY
	});	
	var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
	assert.strictEqual(typeof componentView.getView(), 'object');
});

QUnit.test( 'componentView selectedEventHandler', function( assert ) {
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
	var modelView = ModelView('canvasPanelTest', model, clipBoard);
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: vConst.MODELVIEW_GUIDESIGNERSIZEY
	});	
	var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
	assert.strictEqual(componentView.getView().getChildren()[1].isVisible(), false);
	component.setIsSelected(true);
	assert.strictEqual(componentView.getView().getChildren()[1].isVisible(), true);
});

QUnit.test( 'componentView deSelectedEventHandler', function( assert ) {
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
	var modelView = ModelView('canvasPanelTest', model, clipBoard);
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	guiLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_GUIDESIGNERSIZEX,
		height: vConst.MODELVIEW_GUIDESIGNERSIZEY
	});	
	var componentView = ComponentView(component, model, modelView, modelLayer, guiLayer);
	component.setIsSelected(true);
	assert.strictEqual(componentView.getView().getChildren()[1].isVisible(), true);
	component.setIsSelected(false);
	assert.strictEqual(componentView.getView().getChildren()[1].isVisible(), false);
});

