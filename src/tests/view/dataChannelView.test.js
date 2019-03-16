import Model from "../../model/model.js";
import ClipBoard from "../../model/clipBoard.js"
import Component from "../../model/component.js";
import Port from "../../model/port.js";
import DataChannel from "../../model/dataChannel.js";

import ModelView from "../../view/modelView.js";
import DataChannelView from "../../view/dataChannelView.js";
import EditorProperties from "../../view/editorProperties.js";
import vConst from "../../view/vConst.js";

import Kinetic from "kinetic";

import resetDocument from "../resetDocument.js";

describe('DataChannelView', () => {

	test('init', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, null, modelLayer);
		expect(dataChannelView.line.stroke()).toBe(vConst.DATACHANNELVIEW_STROKECOLOR);
		expect(dataChannelView.line.points()[0]).toBe(1 + vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX);
		expect(dataChannelView.line.points()[1]).toBe(2 + vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port.getPosition());
		expect(dataChannelView.line.points()[2]).toBe(1 + vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX);
		expect(dataChannelView.line.points()[3]).toBe(2 + vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port.getPosition());
	});

	test('getChannel()', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, null, modelLayer);
		expect(dataChannelView.getChannel()).toBe(dataChannel);
	});

	test('destroy()', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, null, modelLayer);
		dataChannelView.destroy();
		expect(dataChannelView.line).toBe(null);
	});

	test('componentPositionChangedEventHandlerOutPort', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, modelView, modelLayer);
		dataChannel.getOutputPort().getParentComponent().setNewPosition(5,6);
		expect(dataChannelView.line.points()[0]).toBe(5 + vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX);
		expect(dataChannelView.line.points()[1]).toBe(6 + vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port.getPosition());
	});

	test('componentPositionChangedEventHandlerInPort', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var dataChannel = DataChannel('dc1');
		var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port1 = Port('portId', comp1, 2, 3, 4, true);
		var comp2 = Component("comp2","typeID","desc",true,3,4,"actuator",true,true);
		var port2 = Port('portId2', comp2, 2, 3, 4, true);
		dataChannel.setOutputPort(port1);
		dataChannel.setInputPort(port2);
		var dataChannelView = DataChannelView(dataChannel, model, modelView, modelLayer);
		dataChannel.getInputPort().getParentComponent().setNewPosition(5,6);
		expect(dataChannelView.line.points()[2]).toBe(5 - vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT);
		expect(dataChannelView.line.points()[3]).toBe(6 + vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port2.getPosition());
	});

	test('dataChannelCompletedEventHandler', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, null, modelLayer);
		var comp2 = Component("comp2","typeID","desc",true,3,4,"actuator",true,true);
		var port2 = Port('portId2', comp2, 2, 3, 4, true);
		dataChannel.setInputPort(port2);
		expect(dataChannelView.line.points()[2]).toBe(3 - vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT);
		expect(dataChannelView.line.points()[3]).toBe(4 + vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port2.getPosition());
	});

	test('selectedEventHandler', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, null, modelLayer);
		expect(dataChannelView.line.dashEnabled()).toBe(false); // checking default
		dataChannel.setIsSelected(true);
		expect(dataChannelView.line.dashEnabled()).toBe(true);
	});

	test('deSelectedEventHandler', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var dataChannel = DataChannel('dc1');
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var port = Port('portId', comp, 2, 3, 4, true);
		dataChannel.setOutputPort(port);
		var dataChannelView = DataChannelView(dataChannel, model, null, modelLayer);
		dataChannel.setIsSelected(true);
		expect(dataChannelView.line.dashEnabled()).toBe(true);
		dataChannel.setIsSelected(false);
		expect(dataChannelView.line.dashEnabled()).toBe(false);
	});
});