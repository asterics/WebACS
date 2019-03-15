import Model from "../../model/model.js";
import Component from "../../model/component.js";

import AddComponentAction from "../../model/addComponentAction.js";

import QUnit from "qunit";

QUnit.module( 'addComponentAction' );

QUnit.test( 'addComponentAction initialization', function( assert ) {
	var model = Model("test.acs");
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var action = AddComponentAction(model, comp);
	assert.strictEqual(action.getModel(), model);
});

QUnit.test( 'addComponentAction execute', function( assert ) {
	var model = Model("test.acs");
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var action = AddComponentAction(model, comp);
	action.execute();
	assert.strictEqual(model.componentList[0], comp);
	assert.strictEqual(model.undoStack[0], action);
});

QUnit.test( 'addComponentAction undo', function( assert ) {
	var model = Model("test.acs");
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var action = AddComponentAction(model, comp);
	action.execute();
	action.undo();
	assert.strictEqual(model.componentList.length, 0);
	assert.strictEqual(model.redoStack[0], action);
});