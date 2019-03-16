import Model from "../../model/model.js";
import Component from "../../model/component.js";
import DataChannel from "../../model/dataChannel.js";
import EventChannel from "../../model/eventChannel.js";

import removeItemListAction from "../../model/removeItemListAction.js";

describe('removeItemListAction', () => {
	
	test('init', () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		
		var itemList = [comp];
		var action = removeItemListAction(model, itemList);
		expect(action.getModel()).toBe(model);
	});

	test('execute()', () => {
		var model = Model("test.acs");
		var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var comp2 = Component("comp2","typeID","desc",true,1,2,"actuator",true,true);
		var dc1 = DataChannel('dataChannel1');
		var dc2 = DataChannel('dataChannel2');
		var ec1 = EventChannel('eventChannel1');
		var ec2 = EventChannel('eventChannel2');
		model.addComponent(comp1);
		model.addComponent(comp2);
		model.addDataChannel(dc1);
		model.addDataChannel(dc2);
		model.addEventChannel(ec1);
		model.addEventChannel(ec2);
		var itemList = [];
		itemList.push(comp1);
		itemList.push(dc1);
		itemList.push(ec1);
		var action = removeItemListAction(model, itemList);
		action.execute();
		expect(model.componentList.length).toBe(1);
		expect(model.componentList[0]).toBe(comp2);
		expect(model.dataChannelList.length).toBe(1);
		expect(model.dataChannelList[0]).toBe(dc2);
		expect(model.eventChannelList.length).toBe(1);
		expect(model.eventChannelList[0]).toBe(ec2);
		expect(model.undoStack[0]).toBe(action);
	});

	test('undo()', () => {
		var model = Model("test.acs");
		var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var comp2 = Component("comp2","typeID","desc",true,1,2,"actuator",true,true);
		var dc1 = DataChannel('dataChannel1');
		var dc2 = DataChannel('dataChannel2');
		var ec1 = EventChannel('eventChannel1');
		var ec2 = EventChannel('eventChannel2');
		model.addComponent(comp1);
		model.addComponent(comp2);
		model.addDataChannel(dc1);
		model.addDataChannel(dc2);
		model.addEventChannel(ec1);
		model.addEventChannel(ec2);
		var itemList = [];
		itemList.push(comp1);
		itemList.push(dc1);
		itemList.push(ec1);
		var action = removeItemListAction(model, itemList);
		action.execute();
		action.undo();
		expect(model.componentList.length).toBe(2);
		expect(model.dataChannelList.length).toBe(2);
		expect(model.eventChannelList.length).toBe(2);
		expect(model.undoStack[0]).toBe(action);
	});
});