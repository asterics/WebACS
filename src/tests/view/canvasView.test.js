import ModelList from "../../model/modelList.js";
import ClipBoard from "../../model/clipBoard.js";

import CanvasView from "../../view/canvasView.js";

import resetDocument from "../resetDocument.js";

describe('CanvasView', () => {

	test('addActModelToView()', () => {
		resetDocument();
		var modelList = ModelList();
		var clipBoard = ClipBoard();
		var cv = CanvasView(modelList, clipBoard);
		// addActModelToView is called by the canvasView constructor
		expect(document.getElementById('canvasTab0').textContent).toBe('newFile1');
	});

	test('filenameBeingChangedEventHandler()', () => {
		resetDocument();
		var modelList = ModelList();
		var clipBoard = ClipBoard();
		var cv = CanvasView(modelList, clipBoard);
		// addActModelToView is called by the canvasView constructor, a file called "newFile1" is therefore already there
		modelList.getActModel().setFilename('theChangedFilename');
		expect(document.getElementById('canvasTab0').textContent).toBe('theChangedFilename');
	});

	test('newModelAddedEventHandler()', () => {
		resetDocument();
		var modelList = ModelList();
		var clipBoard = ClipBoard();
		var cv = CanvasView(modelList, clipBoard);
		modelList.addNewModel();
		expect(document.getElementById('canvasTab1').textContent).toBe('newFile2');
	});

	test('removingModelEventHandler()', () => {
		resetDocument();
		var modelList = ModelList();
		var clipBoard = ClipBoard();
		var cv = CanvasView(modelList, clipBoard);
		modelList.addNewModel();
		modelList.removeModel();
		expect(document.getElementById('canvasTab1')).toBe(null);
	});

	test('tabSwitchedEventHandler()', () => {
		resetDocument();
		var modelList = ModelList();
		var clipBoard = ClipBoard();
		var cv = CanvasView(modelList, clipBoard);
		modelList.addNewModel();
		expect(modelList.getActModel().getFilename()).toBe('newFile2');
		$('#canvasTab0').trigger('click');
		expect(modelList.getActModel().getFilename()).toBe('newFile1');
	});

	test('actModelChangedEventHandler()', () => {
		resetDocument();
		var modelList = ModelList();
		var clipBoard = ClipBoard();
		var cv = CanvasView(modelList, clipBoard);
		modelList.addNewModel();
		expect(document.getElementById('canvasTab0').getAttribute('aria-selected')).toBe('false');
		expect(document.getElementById('canvasTab1').getAttribute('aria-selected')).toBe('true');
		modelList.setActModel(0);
		expect(document.getElementById('canvasTab1').getAttribute('aria-selected')).toBe('false');
		expect(document.getElementById('canvasTab0').getAttribute('aria-selected')).toBe('true');
	});
});