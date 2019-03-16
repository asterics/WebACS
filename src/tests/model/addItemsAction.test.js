import Model from "../../model/model.js";
import Component from "../../model/component.js";
import DataChannel from "../../model/dataChannel.js";
import EventChannel from "../../model/eventChannel.js";

import addItemsAction from "../../model/addItemsAction.js";

describe('addItemsAction', () => {

	test('init', () => {
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
		var action = addItemsAction(model, compList, dcList, ecList);
		expect(action.getModel()).toBe(model);
	});

	test('execute()', () => {
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
		var action = addItemsAction(model, compList, dcList, ecList);
		action.execute();
		expect(model.componentList[0]).toBe(comp1);
		expect(model.componentList[1]).toBe(comp2);
		expect(model.dataChannelList[0]).toBe(dc1);
		expect(model.dataChannelList[1]).toBe(dc2);
		expect(model.eventChannelList[0]).toBe(ec1);
		expect(model.eventChannelList[1]).toBe(ec2);
		expect(model.undoStack[0]).toBe(action);
	});

	test('undo()', () => {
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
		var action = addItemsAction(model, compList, dcList, ecList);
		action.execute();
		action.undo();
		expect(model.componentList.length).toBe(0);
		expect(model.dataChannelList.length).toBe(0);
		expect(model.eventChannelList.length).toBe(0);
		expect(model.redoStack[0]).toBe(action);
	});
});