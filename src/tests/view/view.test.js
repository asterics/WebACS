import ModelList from "../../model/modelList.js";
import Component from "../../model/component.js";
import Port from "../../model/port.js";
import ClipBoard from "../../model/clipBoard.js";
import AreStatus from "../../model/areStatus.js";

import View from "../../view/view.js";
import vConst from "../../view/vConst.js";


import sinon from "sinon";
import resetDocument from "../resetDocument.js";

describe('View', () => {
	
	// handleKeyDown and handleKeyPress require user inputs

	test('cutBtnPressedHandler() > pasteBtnPressedHandler() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// var port = Port('outP', comp, 1, 0, 0, false);
		// comp.outputPortList.push(port);
		// modelList.getActModel().addComponent(comp);
		// modelList.getActModel().addItemToSelection(comp);
		// var clipBoard = ClipBoard();
		// var v = View(modelList, clipBoard, AreStatus(), {});
		// $('#cutBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(0);
		// modelList.addNewModel();
		// var alertStub = sinon.stub(window, 'alert');
		// $('#pasteBtn').trigger('click');
		// expect(alertStub.callCount).toBe(1);
		// expect(alertStub.getCall(0).args[0]).toBe(vConst.MODELVIEW_ALERTSTRINGCHANGEDCOMPONENTS + 'comp1_c (FS20Receiver)\n');
		// expect(modelList.getActModel().componentList.length).toBe(1);
		// expect(modelList.getActModel().componentList[0].getId()).toBe('comp1_c');
		// // to prevent browser from presenting a popup on unload of the page:
		// modelList.getModelAtIndex(0).hasBeenChanged = false;
		// modelList.getModelAtIndex(1).hasBeenChanged = false;
		// window.alert.restore();
	});

	test('copyBtnPressedHandler() > pasteBtnPressedHandler() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// modelList.getActModel().addComponent(comp);
		// modelList.getActModel().addItemToSelection(comp);
		// var clipBoard = ClipBoard();
		// var v = View(modelList, clipBoard, AreStatus(), {});
		// $('#copyBtn').trigger('click');
		// modelList.addNewModel();
		// var alertStub = sinon.stub(window, 'alert');
		// $('#pasteBtn').trigger('click');
		// expect(alertStub.callCount).toBe(1);
		// expect(alertStub.getCall(0).args[0]).toBe(vConst.MODELVIEW_ALERTSTRINGCHANGEDCOMPONENTS + 'comp1_c (FS20Receiver)\n');	
		// expect(modelList.getActModel().componentList.length).toBe(1);
		// expect(modelList.getActModel().componentList[0].getId()).toBe('comp1_c');
		// // to prevent browser from presenting a popup on unload of the page:
		// modelList.getModelAtIndex(0).hasBeenChanged = false;
		// modelList.getModelAtIndex(1).hasBeenChanged = false;
		// window.alert.restore();
	});

	test('deleteBtnPressedHandler() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// modelList.getActModel().addComponent(comp);
		// modelList.getActModel().addItemToSelection(comp);
		// var clipBoard = ClipBoard();
		// var v = View(modelList, clipBoard, AreStatus(), {});
		// expect(modelList.getActModel().componentList.length).toBe(1);
		// $('#deleteSelectionBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(0);
		// // to prevent browser from presenting a popup on unload of the page:
		// modelList.getModelAtIndex(0).hasBeenChanged = false;
	});

	test('undoBtnPressedHandler() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// modelList.getActModel().addComponent(comp);
		// modelList.getActModel().addItemToSelection(comp);
		// var clipBoard = ClipBoard();
		// var v = View(modelList, clipBoard);
		// $('#deleteSelectionBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(0);
		// $('#undoBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(1);
		// // to prevent browser from presenting a popup on unload of the page:
		// modelList.getModelAtIndex(0).hasBeenChanged = false;
	});

	test('redoBtnPressedHandler() - FIXME: jquery-ui', () => {
		/* FIXME: jquery-ui: menu() not defined */
		// resetDocument();
		// var modelList = ModelList();
		// var comp = Component("comp1","asterics.FS20Receiver","desc",true,1,2,"actuator",false,true);
		// modelList.getActModel().addComponent(comp);
		// modelList.getActModel().addItemToSelection(comp);
		// var clipBoard = ClipBoard();
		// var v = View(modelList, clipBoard, AreStatus(), {});
		// $('#deleteSelectionBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(0);
		// $('#undoBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(1);
		// $('#redoBtn').trigger('click');
		// expect(modelList.getActModel().componentList.length).toBe(0);
		// // to prevent browser from presenting a popup on unload of the page:
		// modelList.getModelAtIndex(0).hasBeenChanged = false;
	});
});