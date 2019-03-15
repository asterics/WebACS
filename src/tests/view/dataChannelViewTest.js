import Model from "../../model/model.js";
import Component from "../../model/component.js";
import Port from "../../model/port.js";
import DataChannel from "../../model/dataChannel.js";

import DataChannelView from "../../view/dataChannelView.js";
import vConst from "../../view/vConst.js";

import Kinetic from "kinetic";

import QUnit from "qunit";

QUnit.module( 'dataChannelView' );

QUnit.test( 'dataChannelView initialisation', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	assert.strictEqual(dataChannelView.line.stroke(), vConst.DATACHANNELVIEW_STROKECOLOR);
	assert.strictEqual(dataChannelView.line.points()[0], 1 + vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX);
	assert.strictEqual(dataChannelView.line.points()[1], 2 + vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port.getPosition());
	assert.strictEqual(dataChannelView.line.points()[2], 1 + vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX);
	assert.strictEqual(dataChannelView.line.points()[3], 2 + vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port.getPosition());
});

QUnit.test( 'dataChannelView getChannel', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	assert.strictEqual(dataChannelView.getChannel(), dataChannel);
});

QUnit.test( 'dataChannelView destroy', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	dataChannelView.destroy();
	assert.strictEqual(dataChannelView.line, null);
});

QUnit.test( 'dataChannelView componentPositionChangedEventHandlerOutPort', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	dataChannel.getOutputPort().getParentComponent().setNewPosition(5,6);
	assert.strictEqual(dataChannelView.line.points()[0], 5 + vConst.DATACHANNELVIEW_OUTPUTPORTPOSITIONX);
	assert.strictEqual(dataChannelView.line.points()[1], 6 + vConst.DATACHANNELVIEW_FIRSTOUTPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port.getPosition());
});

QUnit.test( 'dataChannelView componentPositionChangedEventHandlerInPort', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp1 = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port1 = Port('portId', comp1, 2, 3, 4, true);
	var comp2 = Component("comp2","typeID","desc",true,3,4,"actuator",true,true);
	var port2 = Port('portId2', comp2, 2, 3, 4, true);
	dataChannel.setOutputPort(port1);
	dataChannel.setInputPort(port2);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	dataChannel.getInputPort().getParentComponent().setNewPosition(5,6);
	assert.strictEqual(dataChannelView.line.points()[2], 5 - vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT);
	assert.strictEqual(dataChannelView.line.points()[3], 6 + vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port2.getPosition());
});

QUnit.test( 'dataChannelView dataChannelCompletedEventHandler', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	var comp2 = Component("comp2","typeID","desc",true,3,4,"actuator",true,true);
	var port2 = Port('portId2', comp2, 2, 3, 4, true);
	dataChannel.setInputPort(port2);
	assert.strictEqual(dataChannelView.line.points()[2], 3 - vConst.DATACHANNELVIEW_INPUTPORTLEFTOFCOMPONENT);
	assert.strictEqual(dataChannelView.line.points()[3], 4 + vConst.DATACHANNELVIEW_FIRSTINPUTPORTDOCKINGPOINTY + vConst.COMPONENTVIEW_PORTHEIGHTPLUSGAP * port2.getPosition());
});

QUnit.test( 'dataChannelView selectedEventHandler', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	assert.strictEqual(dataChannelView.line.dashEnabled(), false); // checking default
	dataChannel.setIsSelected(true);
	assert.strictEqual(dataChannelView.line.dashEnabled(), true);
});

QUnit.test( 'dataChannelView deSelectedEventHandler', function( assert ) {
	resetDocument();
	var model = Model('model1');
	modelLayer = new Kinetic.Layer({
		width: vConst.MODELVIEW_MODELDESIGNERSIZEX,
		height: vConst.MODELVIEW_MODELDESIGNERSIZEY
	});
	var dataChannel = DataChannel('dc1');
	var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
	var port = Port('portId', comp, 2, 3, 4, true);
	dataChannel.setOutputPort(port);
	var dataChannelView = DataChannelView(dataChannel, model, modelLayer);
	dataChannel.setIsSelected(true);
	assert.strictEqual(dataChannelView.line.dashEnabled(), true);
	dataChannel.setIsSelected(false);
	assert.strictEqual(dataChannelView.line.dashEnabled(), false);
});