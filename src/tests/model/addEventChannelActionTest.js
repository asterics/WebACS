import Model from "../../model/model.js";
import EventChannel from "../../model/eventChannel.js";
import AddEventChannelAction from "../../model/addEventChannelAction.js";

import QUnit from "qunit";

QUnit.module( 'addEventChannelAction' );

QUnit.test( 'addEventChannelAction initialization', function( assert ) {
	var model = Model("test.acs");
	var ec = EventChannel('eventChannel1');
	var action = AddEventChannelAction(model, ec);
	assert.strictEqual(action.getModel(), model);
});

QUnit.test( 'addEventChannelAction execute', function( assert ) {
	var model = Model("test.acs");
	var ec = EventChannel('eventChannel1');
	var action = AddEventChannelAction(model, ec);
	action.execute();
	assert.strictEqual(model.eventChannelList[0], ec);
	assert.strictEqual(model.undoStack[0], action);
});

QUnit.test( 'addEventChannelAction undo', function( assert ) {
	var model = Model("test.acs");
	var ec = EventChannel('eventChannel1');
	var action = AddEventChannelAction(model, ec);
	action.execute();
	action.undo();
	assert.strictEqual(model.eventChannelList.length, 0);
	assert.strictEqual(model.redoStack[0], action);
});