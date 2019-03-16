import Model from "../../model/model.js";
import ClipBoard from "../../model/clipBoard.js";
import Component from "../../model/component.js";
import EventChannel from "../../model/eventChannel.js";

import ModelView from "../../view/modelView.js";
import ChannelView from "../../view/channelView.js";
import EditorProperties from "../../view/editorProperties.js";
import vConst from "../../view/vConst.js";

import Kinetic from "kinetic";

import resetDocument from "../resetDocument.js";

// initialisation is implicitly tested through the tests of eventChannelView and dataChannelView

describe('ChannelView', () => {
	
	test('setStartPoint()', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var channelView = ChannelView(model, null, modelLayer);
		channelView.setStartPoint(1, 2);
		expect(channelView.line.points()[0]).toBe(1);
		expect(channelView.line.points()[1]).toBe(2);
	});

	test('setEndPoint()', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var eventChannel = EventChannel('ec1');
		eventChannel.startComponent = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var channelView = ChannelView(model, modelView, modelLayer);
		channelView.setEndPoint(3, 4);
		expect(channelView.line.points()[2]).toBe(3);
		expect(channelView.line.points()[3]).toBe(4);
	});

	test('setVisible()', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var channelView = ChannelView(model, null, modelLayer);
		expect(channelView.line.isVisible()).toBe(true); // checking default
		expect(channelView.getVisible()).toBe(true); // checking default
		channelView.setVisible(false);
		expect(channelView.line.isVisible()).toBe(false);
		expect(channelView.getVisible()).toBe(false);
	});

	test('destroy', () => {
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
		var channelView = ChannelView(model, modelView, modelLayer);
		
		channelView.setEndPoint(3, 4);
		expect(channelView.line.points()[2]).toBe(3);
		expect(channelView.line.points()[3]).toBe(4);
	});
});