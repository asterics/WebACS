import ClipBoard from "../../model/clipBoard.js";
import Model from "../../model/model.js";
import Port from "../../model/port.js";
import Component from "../../model/component.js";
import DataChannel from "../../model/dataChannel.js";
import EventChannel from "../../model/eventChannel.js";

describe('ClipBoard', () => {
	
	test('cut() > paste() > getChangedComponentsList() > getRemovedComponentsList()', () => {
		var clipBoard = ClipBoard();
		
		/* Create model */
		var model = Model("test.acs");

		/* Add FS20Receiver */
		var comp1 = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		var port1 = Port('outP', comp1, 1, 0, 0, false);
		comp1.outputPortList.push(port1); 
		model.addComponent(comp1);

		/* Add Proximity */
		var comp2 = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var port2 = Port('inP', comp2, 0, 0, 0, false);
		comp2.inputPortList.push(port2);
		model.addComponent(comp2);

		/* Add unexisting component */
		var comp3 = Component("comp3","someIdNotInCollection","desc",true,1,2,"actuator",false,false);
		model.addComponent(comp3);

		/* Add another unexisting component */
		var otherComp = Component("otherComp","irrelevantTypeID","desc",true,1,2,"actuator",false,false);
		var otherPort = Port('otherPort', otherComp, 0, 0, 0, false);
		
		/* Add data and event channels */
		var dc1 = DataChannel('dataChannel1');
		dc1.setOutputPort(otherPort);
		dc1.setInputPort(otherPort);
		model.addDataChannel(dc1);	
		var ec1 = EventChannel('eventChannel1');
		ec1.startComponent = otherComp;
		ec1.endComponent = otherComp;
		model.addEventChannel(ec1);	

		var dc2 = DataChannel('dataChannel2');
		dc2.setOutputPort(port1);
		dc2.setInputPort(port2);
		model.addDataChannel(dc2);
		var ec2 = EventChannel('eventChannel2');
		ec2.startComponent = comp1;
		ec2.endComponent = comp2;
		model.addEventChannel(ec2);

		/* Select and cut components and data and event channels */
		model.addItemToSelection(comp1);
		model.addItemToSelection(comp2);
		model.addItemToSelection(comp3);
		model.addItemToSelection(dc1);
		model.addItemToSelection(ec1);
		model.addItemToSelection(dc2);
		model.addItemToSelection(ec2);
		clipBoard.cut(model);

		/* Check if selection is cut */
		expect(model.componentList.length).toBe(0);
		expect(model.dataChannelList.length).toBe(0);
		expect(model.eventChannelList.length).toBe(0);

		/* Create new model */
		var newModel = Model('newTestModel.acs');

		/* Paste previous model from clipBoard into new model */
		clipBoard.paste(newModel);

		expect(newModel.componentList.length).toBe(2);
		expect(newModel.componentList[0].getId()).toBe('comp1_c');
		expect(newModel.componentList[1].getId()).toBe('comp2_c');
		expect(newModel.dataChannelList.length).toBe(1);
		expect(newModel.dataChannelList[0].getId()).toBe('dataChannel2_c');
		expect(newModel.eventChannelList.length).toBe(1);
		expect(newModel.eventChannelList[0].getId()).toBe('eventChannel2_c');
		expect(clipBoard.getRemovedComponentsList()[0].getId()).toBe('comp3_c');
		expect(clipBoard.getChangedComponentsList().length).toBe(2);
		expect(clipBoard.getChangedComponentsList()[1].getId()).toBe('comp2_c');	
	});

	test('copy() > paste() > getChangedComponentsList() > getRemovedComponentsList()', () => {
		var clipBoard = ClipBoard();
		var model = Model("test.acs");
		var comp1 = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		var port1 = Port('outP', comp1, 1, 0, 0, false);
		comp1.outputPortList.push(port1); 
		model.addComponent(comp1);
		var comp2 = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		var port2 = Port('inP', comp2, 0, 0, 0, false);
		comp2.inputPortList.push(port2);
		model.addComponent(comp2);
		var comp3 = Component("comp3","someIdNotInCollection","desc",true,1,2,"actuator",false,false);
		model.addComponent(comp3);
		var otherComp = Component("otherComp","irrelevantTypeID","desc",true,1,2,"actuator",false,false);
		var otherPort = Port('otherPort', otherComp, 0, 0, 0, false);
		var dc1 = DataChannel('dataChannel1');
		dc1.setOutputPort(otherPort);
		dc1.setInputPort(otherPort);
		model.addDataChannel(dc1);
		var ec1 = EventChannel('eventChannel1');
		ec1.startComponent = otherComp;
		ec1.endComponent = otherComp;
		model.addEventChannel(ec1);
		var dc2 = DataChannel('dataChannel2');
		dc2.setOutputPort(port1);
		dc2.setInputPort(port2);
		model.addDataChannel(dc2);
		var ec2 = EventChannel('eventChannel2');
		ec2.startComponent = comp1;
		ec2.endComponent = comp2;
		model.addEventChannel(ec2);
		model.addItemToSelection(comp1);
		model.addItemToSelection(comp2);
		model.addItemToSelection(comp3);
		model.addItemToSelection(dc1);
		model.addItemToSelection(ec1);
		model.addItemToSelection(dc2);
		model.addItemToSelection(ec2);
		clipBoard.copy(model);
		expect(model.componentList.length).toBe(3);
		expect(model.dataChannelList.length).toBe(2);
		expect(model.eventChannelList.length).toBe(2);
		var newModel = Model('newTestModel.acs');
		clipBoard.paste(newModel);
		expect(newModel.componentList.length).toBe(2);
		expect(newModel.componentList[0].getId()).toBe('comp1_c');
		expect(newModel.componentList[1].getId()).toBe('comp2_c');
		expect(newModel.dataChannelList.length).toBe(1);
		expect(newModel.dataChannelList[0].getId()).toBe('dataChannel2_c');
		expect(newModel.eventChannelList.length).toBe(1);
		expect(newModel.eventChannelList[0].getId()).toBe('eventChannel2_c');
		expect(clipBoard.getRemovedComponentsList()[0].getId()).toBe('comp3_c');
		expect(clipBoard.getChangedComponentsList().length).toBe(2);
		expect(clipBoard.getChangedComponentsList()[1].getId()).toBe('comp2_c');
	});
});