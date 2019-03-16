import fs from "fs";
import path from "path";

import Model from "../../model/model.js";
import Component from "../../model/component.js";
import DataChannel from "../../model/dataChannel.js";
import EventChannel from "../../model/eventChannel.js";
import mConst from "../../model/mConst.js";

import { mockFileReader } from "../mock-utils.js";

import { pd } from "pretty-data";

describe('Model', () => {


	test('init', () => {
		var model = Model("test.acs");
		expect(model.getFilename()).toBe("test.acs");
	});

	test('setFilename()', () => {
		var model = Model("test.acs");
		model.setFilename("anotherTest.acs");
		expect(model.getFilename()).toBe("anotherTest.acs");
	});

	test("findComponentInCollection()", () => {
		var model = Model("test.acs");
		var comp = model.findComponentInCollection("asterics.AnalogOut");
		var id = comp.getAttribute('id');
		expect(id).toBe("asterics.AnalogOut");
	});

	test("getDataType()", () => {
		var model = Model("test.acs");
		expect(model.getDataType('boolean')).toBe(1);
		expect(model.getDataType('byte')).toBe(2);
		expect(model.getDataType('char')).toBe(3);
		expect(model.getDataType('integer')).toBe(4);
		expect(model.getDataType('double')).toBe(5);
		expect(model.getDataType('string')).toBe(6);
	});

	test("getFreePosition()", () => {
		var model = Model("test.acs");
		expect(model.getFreePosition([1, 2])[0]).toBe(1);
		expect(model.getFreePosition([1, 2])[1]).toBe(2);
		model.addComponent(Component("comp1","typeID","desc",true,1,2,"actuator",true,true));
		expect(model.getFreePosition([1, 2])[0]).toBe(1 + mConst.MODEL_COMPONENTPOSITIONOFFSETX);
		expect(model.getFreePosition([1, 2])[1]).toBe(2 + mConst.MODEL_COMPONENTPOSITIONOFFSETY);
	});

	test("loadModelFromFile()", () => {
		var model = Model("test.acs");
		var fileContent = fs.readFileSync(path.join(__dirname, "res/model.loadModelFromFile.acs"), "utf-8");
		var file = new File([fileContent], "test1.acs");
		window.FileReader = mockFileReader(fileContent);
		model.loadModelFromFile(file);
		expect(model.getFilename()).toBe("test1.acs");
		expect(model.componentList.length).toBe(5);
		expect(model.componentList[1].getId()).toBe('Arduino.1');
		expect(model.dataChannelList.length).toBe(1);
		expect(model.dataChannelList[0].getId()).toBe('binding.0');
		expect(model.eventChannelList.length).toBe(1);
		expect(model.eventChannelList[0].getId()).toBe('Arduino.1_PlatformDigitalOut.1');
		expect(model.modelGui.getDecoration()).toBe(true);
		// TODO: add assertion for visualAreaMarker
		expect(model.metaDataList.length).toBe(3);
		expect(model.metaDataList[0].value).toBe('das ist die short description');
		expect(model.modelName).toBe('29.07.2014_1130');
		expect(model.acsVersion).toBe('20130320');
	});


	test("getModelXMLString()", () => {
		var model = Model("test.acs");
		var fileContent = fs.readFileSync(path.join(__dirname, "res/model.getModelXMLString.acs"), "utf-8");
		var file = new File([fileContent], "test1.acs");
		window.FileReader = mockFileReader(fileContent);
		model.loadModelFromFile(file);
		var xmlModel = model.getModelXMLString();
		expect(pd.xml(xmlModel)).toBe(pd.xml(fileContent));
	});

	test("initiateComponentByName()", () => {
		var model = Model("test.acs");
		var comp = model.initiateComponentByName('Deadzone');
		expect(comp.getId()).toBe('Deadzone.1');
		expect(comp.getComponentTypeId()).toBe('asterics.Deadzone');
		expect(comp.getDescription()).toBe('Defines active/passive Zone for x/y values');
		expect(comp.getSingleton()).toBe(false);
		expect(comp.getX()).toBe(mConst.MODEL_NEWCOMPONENTPOSITIONX);
		expect(comp.getY()).toBe(mConst.MODEL_NEWCOMPONENTPOSITIONY);
		expect(comp.getType()).toBe(2);
		expect(comp.getIsSelected()).toBe(false);
		expect(comp.inputPortList.length).toBe(3);
		expect(comp.inputPortList[2].getId()).toBe('radius');
		expect(comp.outputPortList.length).toBe(2);
		expect(comp.outputPortList[0].getId()).toBe('outX');
		expect(comp.listenEventList.length).toBe(1);
		expect(comp.listenEventList[0].getId()).toBe('setCenter');
		expect(comp.triggerEventList.length).toBe(2);
		expect(comp.triggerEventList[1].getId()).toBe('exitZone');
		expect(comp.propertyList.length).toBe(4);
		expect(comp.propertyList[2].getKey()).toBe('radius');
		expect(comp.gui).toBe(null);
		expect(comp.matchesComponentCollection).toBe(true);
		expect(comp.foundInComponentCollection).toBe(true);
	});

	test("addComponent()", () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		model.addComponent(comp);
		expect(model.componentList[0]).toBe(comp);
	});

	test("removeComponent()", () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		model.addComponent(comp);
		model.removeComponent(comp);
		expect(model.componentList.length).toBe(0);
	});

	test("addDataChannel()", () => {
		var model = Model("test.acs");
		var ch = DataChannel('channel1');
		model.addDataChannel(ch);
		expect(model.dataChannelList[0]).toBe(ch);
	});

	test("removeDataChannel()", () => {
		var model = Model("test.acs");
		var ch = DataChannel('channel1');
		model.addDataChannel(ch);
		model.removeDataChannel(ch);
		expect(model.dataChannelList.length).toBe(0);
	});

	test("addEventChannel()", () => {
		var model = Model("test.acs");
		var ch = EventChannel('channel1');
		model.addEventChannel(ch);
		expect(model.eventChannelList[0]).toBe(ch);
	});

	test("removeEventChannel()", () => {
		var model = Model("test.acs");
		var ch = EventChannel('channel1');
		model.addEventChannel(ch);
		model.removeEventChannel(ch);
		expect(model.eventChannelList.length).toBe(0);
	});

	test("getComponentCollection()", () => {
		var model = Model("test.acs");
		var coll = model.getComponentCollection();
		expect(coll.getElementsByTagName('componentType')[0].getAttribute('id')).toBe('asterics.AnalogOut');
	});

	// loadComponentCollection requires user inputs

	test("addItemToSelection()", () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",false,true);
		model.addItemToSelection(comp);
		expect(model.selectedItemsList[0]).toBe(comp);
	});

	test("removeItemFromSelection()", () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",false,true);
		model.addItemToSelection(comp);
		model.removeItemFromSelection(comp);
		expect(model.selectedItemsList.length).toBe(0);
	});

	test("deSelectAll()", () => {
		var model = Model("test.acs");
		var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",false,true);
		var comp2 = Component("comp2","typeID","desc",true,1,2,"actuator",false,true);
		model.addItemToSelection(comp1);
		model.addItemToSelection(comp2);
		model.deSelectAll();
		expect(model.selectedItemsList.length).toBe(0);
	});
});