import fs from "fs";
import path from "path";

import Model from "../../model/model.js";
import Component from "../../model/component.js";
import ClipBoard from "../../model/clipBoard.js";

import ModelView from "../../view/modelView.js";
import EditorProperties from "../../view/editorProperties.js";
import vConst from "../../view/vConst.js";

import sinon from "sinon";

import { mockFileReader } from "../mock-utils.js";

import resetDocument from "../resetDocument.js";

// initialisation is tested implicitly by the following two tests

describe('ModelView', () => {

	test('getModel()', () => {
	resetDocument();
	// create a panel to hold the modelView
	var div = document.createElement('div');
	div.setAttribute('id', 'canvasPanelTest');
	document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
	//
	var model = Model('model1');
	var clipBoard = ClipBoard();
	var editorProperties = EditorProperties();
	var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
	expect(modelView.getModel()).toBe(model);
	});

	test('getModelContainerId()', () => {
		resetDocument();
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var model = Model('model1');
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		expect(modelView.getModelContainerId()).toBe('canvasPanelTest');
	});

	test('modelChangedEventHandler()', () => {
		resetDocument();
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var model = Model('model1');
		var clipBoard = ClipBoard();
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', model, clipBoard, editorProperties);
		// a model has to be loaded from a file in order to invoke the modelChangedEventHandler
		// this model deliberately contains a component that will not be found in componentCollection and therefore an alert will be fired, which is what we can check
		var fileContent = fs.readFileSync(path.join(__dirname, "res/modelView.modelChangedEventHandler.acs"), "utf-8");
		var file = new File([fileContent], "test1.acs");
		var alertStub = sinon.stub(window, 'alert');
		window.FileReader = mockFileReader(fileContent);
		model.loadModelFromFile(file);
		expect(alertStub.callCount).toBe(1);
		window.alert.restore();
	});

	test('alertUserOfComponentCollectionMismatchEventHandler()', () => {
		resetDocument();
		// create a panel to hold the modelView
		var div = document.createElement('div');
		div.setAttribute('id', 'canvasPanelTest');
		document.getElementById(vConst.CANVASVIEW_MOTHERPANEL).appendChild(div);
		//
		var model = Model('model1');
		var clipBoard = ClipBoard();
		var comp2 = Component("comp2","asterics.Proximity","desc",true,1,2,"actuator",false,true);
		model.addComponent(comp2);
		var comp3 = Component("comp3","someIdNotInCollection","desc",true,1,2,"actuator",false,false);
		model.addComponent(comp3);
		model.addItemToSelection(comp2);
		model.addItemToSelection(comp3);
		clipBoard.cut(model);
		var newModel = Model('newTestModel.acs');
		var editorProperties = EditorProperties();
		var modelView = ModelView('canvasPanelTest', newModel, clipBoard, editorProperties);
		var alertStub = sinon.stub(window, 'alert');
		clipBoard.paste(newModel);
		expect(alertStub.callCount).toBe(2);
		window.alert.restore();
	});
});
// the other handlers in modelView must be tested manually