import Model from "../../model/model.js";
import ClipBoard from "../../model/clipBoard.js"
import Component from "../../model/component.js";
import EventChannel from "../../model/eventChannel.js";

import ModelView from "../../view/modelView.js";
import EventChannelView from "../../view/eventChannelView.js";
import EditorProperties from "../../view/editorProperties.js";
import vConst from "../../view/vConst.js";

import Kinetic from "kinetic";

import resetDocument from "../resetDocument.js";

describe('EventChannelView', () => {

	test('init', () => {
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
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		expect(eventChannelView.line.stroke()).toBe(vConst.EVENTCHANNELVIEW_STROKECOLOR);
		expect(eventChannelView.line.points()[0]).toBe(1 + vConst.EVENTCHANNELVIEW_TRIGGERPOSX);
		expect(eventChannelView.line.points()[1]).toBe(2 + vConst.COMPONENTVIEW_ELEMENTHEIGHT + vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT);
		expect(eventChannelView.line.points()[2]).toBe(1 + vConst.EVENTCHANNELVIEW_TRIGGERPOSX);
		expect(eventChannelView.line.points()[3]).toBe(2 + vConst.COMPONENTVIEW_ELEMENTHEIGHT + vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT);
	});

	test('getChannel()', () => {
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
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		expect(eventChannelView.getChannel()).toBe(eventChannel);
	});

	test('destroy()', () => {
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
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		eventChannelView.destroy();
		expect(eventChannelView.line).toBe(null);
	});

	test('componentPositionChangedEventHandlerStartComponent()', () => {
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
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		eventChannel.startComponent.setNewPosition(5,6);
		expect(eventChannelView.line.points()[0]).toBe(5 + vConst.EVENTCHANNELVIEW_TRIGGERPOSX);
		expect(eventChannelView.line.points()[1]).toBe(6 + vConst.COMPONENTVIEW_ELEMENTHEIGHT + vConst.EVENTCHANNELVIEW_TRIGGERBELOWCOMPONENT);
	});

	test('componentPositionChangedEventHandlerEndComponent()', () => {
		resetDocument();
		var model = Model('model1');
		var modelLayer = new Kinetic.Layer({
			width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
			height: vConst.MODELVIEW_MODELDESIGNERSIZEY
		});
		var eventChannel = EventChannel('ec1');
		eventChannel.startComponent = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		eventChannel.endComponent = Component("comp2","typeID","desc",true,3,4,"actuator",true,true);
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		eventChannel.endComponent.setNewPosition(5,6);
		expect(eventChannelView.line.points()[2]).toBe(5 + vConst.EVENTCHANNELVIEW_LISTENERPOSX);
		expect(eventChannelView.line.points()[3]).toBe(6 + vConst.COMPONENTVIEW_ELEMENTHEIGHT + vConst.EVENTCHANNELVIEW_LISTENERBELOWCOMPONENT);
	});

	// eventChannelCompletedEventHandler: the corresponding event is sent on user input

	test('selectedEventHandler()', () => {
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
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		expect(eventChannelView.line.dashEnabled()).toBe(false); // checking default
		eventChannel.setIsSelected(true);
		expect(eventChannelView.line.dashEnabled()).toBe(true);
	});

	test('deSelectedEventHandler()', () => {
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
		var eventChannelView = EventChannelView(eventChannel, model, modelView, modelLayer);
		eventChannel.setIsSelected(true);
		expect(eventChannelView.line.dashEnabled()).toBe(true);
		eventChannel.setIsSelected(false);
		expect(eventChannelView.line.dashEnabled()).toBe(false);
	});
});