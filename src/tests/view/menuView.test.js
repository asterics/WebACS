import Component from "../../model/component.js";
import Port from "../../model/port.js";
import ModelList from "../../model/modelList.js";

import MenuView from "../../view/menuView.js";

import AreStatus from "../../model/areStatus.js";

import resetDocument from "../resetDocument.js";

describe('MenuView', () => {

	test('setComponentMenu() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var menuView = MenuView(modelList, AreStatus(), {});
		// menuView.setComponentMenu();
		// expect(document.getElementById('sensorsBtnList').getElementsByTagName('li').length).toBe(50);
		// expect(document.getElementById('processorsBtnList').getElementsByTagName('li').length).toBe(73);
		// expect(document.getElementById('actuatorsBtnList').getElementsByTagName('li').length).toBe(54);
	});

	// componentCollectionChangedEventHandler and actModelChangedEventHandler simply call setComponentMenu - so nothing more to test here

	// handleConnectARE: TODO

	test('handleNewModel() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var menuView = MenuView(modelList, AreStatus(), {});
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// var port = Port('outP', comp, 1, 0, 0, false);
		// comp.outputPortList.push(port);
		// modelList.getActModel().addComponent(comp);
		// $('#newModelBtn').trigger('click');
		// expect(modelList.getLength()).toBe(2);
	});

	// handleSelectedFile and handleOpenModel require user input to file dialog

	test('handleCloseModel() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var menuView = MenuView(modelList, AreStatus(), {});
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// var port = Port('outP', comp, 1, 0, 0, false);
		// comp.outputPortList.push(port);
		// modelList.getActModel().addComponent(comp);
		// $('#newModelBtn').trigger('click');
		// expect(modelList.getLength()).toBe(2);
		// $('#closeModelBtn').trigger('click');
		// expect(modelList.getLength()).toBe(1);
	});

	// handleSaveModel requires user input to file dialog

	test('handleCompMenu() - FIXME: jquery-ui', (done) => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var menuView = MenuView(modelList, AreStatus(), {});
		// menuView.setComponentMenu();
		// var evObjEnter = document.createEvent( 'Events' );
		// evObjEnter.initEvent('mouseenter', true, false );
		// var evObjLeave = document.createEvent( 'Events' );
		// evObjLeave.initEvent('mouseleave', true, false );	
		// document.getElementById('sensorsBtn').dispatchEvent( evObjEnter );
		// expect(document.getElementById('sensorsBtnList').className).toBe('compMenuL1 compMenu');
		// document.getElementById('sensorsBtn').dispatchEvent( evObjLeave );
		// document.getElementById('sensorInertialMeasurement').dispatchEvent( evObjEnter );
		// expect(document.getElementById('sensorInertialMeasurementList').className).toBe('compMenuL2 compMenu');
		// document.getElementById('sensorInertialMeasurement').dispatchEvent( evObjLeave );
		// document.getElementById('processorsBtn').dispatchEvent( evObjEnter );
		// setTimeout(() => {
		// 	expect(document.getElementById('sensorsBtnList').className).toBe('compMenuL1 compMenu hiddenMenu');
		// 	expect(document.getElementById('sensorInertialMeasurementList').className).toBe('compMenuL2 compMenu hiddenMenu');
		// 	done();
		// }, 200);
		done();
	});

});

// handleCut, handleCopy, handlePaste, handleDeleteSelection, handleUndo and handleRedo are implicitly tested in viewTest.js