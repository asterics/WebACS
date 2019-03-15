import Model from "../../model/model.js";
import DataChannel from "../../model/dataChannel.js";
import AddDataChannelAction from "../../model/addDataChannelAction.js";

import QUnit from "qunit";

QUnit.module( 'addDataChannelAction' );

QUnit.test( 'addDataChannelAction initialization', function( assert ) {
	var model = Model("test.acs");
	var dc = DataChannel('dataChannel1');
	var action = AddDataChannelAction(model, dc);
	assert.strictEqual(action.getModel(), model);
});

QUnit.test( 'addDataChannelAction execute', function( assert ) {
	var model = Model("test.acs");
	var dc = DataChannel('dataChannel1');
	var action = AddDataChannelAction(model, dc);
	action.execute();
	assert.strictEqual(model.dataChannelList[0], dc);
	assert.strictEqual(model.undoStack[0], action);
});

QUnit.test( 'addDataChannelAction undo', function( assert ) {
	var model = Model("test.acs");
	var dc = DataChannel('dataChannel1');
	var action = AddDataChannelAction(model, dc);
	action.execute();
	action.undo();
	assert.strictEqual(model.dataChannelList.length, 0);
	assert.strictEqual(model.redoStack[0], action);
});