import Model from "../../model/model.js";
import Component from "../../model/component.js";
import DataChannel from "../../model/dataChannel.js";
import EventChannel from "../../model/eventChannel.js";

import AddItemsAction from "../../model/addItemsAction.js";

import QUnit from "qunit";

QUnit.module( 'addItemsAction' );

QUnit.test( 'addItemsAction initialization', function( assert ) {
	var model = Model("test.acs");
	var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var comp2 = Component("comp2","typeID","desc",true,1,2,"actuator",true,true);
	var compList = [];
	compList.push(comp1);
	compList.push(comp2);
	var dc1 = DataChannel('dataChannel1');
	var dc2 = DataChannel('dataChannel2');
	var dcList = [];
	dcList.push(dc1);
	dcList.push(dc2);
	var ec1 = EventChannel('eventChannel1');
	var ec2 = EventChannel('eventChannel2');
	var ecList = [];
	ecList.push(ec1);
	ecList.push(ec2);
	var action = AddItemsAction(model, compList, dcList, ecList);
	assert.strictEqual(action.getModel(), model);
});

QUnit.test( 'addItemsAction execute', function( assert ) {
	var model = Model("test.acs");
	var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var comp2 = Component("comp2","typeID","desc",true,1,2,"actuator",true,true);
	var compList = [];
	compList.push(comp1);
	compList.push(comp2);
	var dc1 = DataChannel('dataChannel1');
	var dc2 = DataChannel('dataChannel2');
	var dcList = [];
	dcList.push(dc1);
	dcList.push(dc2);
	var ec1 = EventChannel('eventChannel1');
	var ec2 = EventChannel('eventChannel2');
	var ecList = [];
	ecList.push(ec1);
	ecList.push(ec2);
	var action = AddItemsAction(model, compList, dcList, ecList);
	action.execute();
	assert.strictEqual(model.componentList[0], comp1);
	assert.strictEqual(model.componentList[1], comp2);
	assert.strictEqual(model.dataChannelList[0], dc1);
	assert.strictEqual(model.dataChannelList[1], dc2);
	assert.strictEqual(model.eventChannelList[0], ec1);
	assert.strictEqual(model.eventChannelList[1], ec2);
	assert.strictEqual(model.undoStack[0], action);
});

QUnit.test( 'addItemsAction undo', function( assert ) {
	var model = Model("test.acs");
	var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var comp2 = Component("comp2","typeID","desc",true,1,2,"actuator",true,true);
	var compList = [];
	compList.push(comp1);
	compList.push(comp2);
	var dc1 = DataChannel('dataChannel1');
	var dc2 = DataChannel('dataChannel2');
	var dcList = [];
	dcList.push(dc1);
	dcList.push(dc2);
	var ec1 = EventChannel('eventChannel1');
	var ec2 = EventChannel('eventChannel2');
	var ecList = [];
	ecList.push(ec1);
	ecList.push(ec2);
	var action = AddItemsAction(model, compList, dcList, ecList);
	action.execute();
	action.undo();
	assert.strictEqual(model.componentList.length, 0);
	assert.strictEqual(model.dataChannelList.length, 0);
	assert.strictEqual(model.eventChannelList.length, 0);
	assert.strictEqual(model.redoStack[0], action);
});