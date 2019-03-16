import ModelList from "../../model/modelList.js";

describe('ModelList', () => {

	test('init', () => {
		var modelList = ModelList();
		expect(modelList.getModelAtIndex(0).getFilename()).toBe('newFile1');
	});

	test('addNewModel(), setActModel()', () => {
		var modelList = ModelList();
		modelList.addNewModel();
		modelList.addNewModel();
		modelList.setActModel(1);
		expect(modelList.actIndex).toBe(1);
		expect(modelList.getActModel().getFilename()).toBe('newFile2');
	});

	test('removeModel()', () => {
		var modelList = ModelList();
		modelList.addNewModel();
		modelList.addNewModel();
		modelList.setActModel(1);
		modelList.removeModel();
		expect(modelList.getLength()).toBe(2);
		expect(modelList.getActModel().getFilename()).toBe('newFile3');
	});

	test('setFilename()', () => {
		var modelList = ModelList();
		modelList.getActModel().setFilename('anotherName');
		expect(modelList.getModelAtIndex(0).getFilename()).toBe('anotherName');
	});
});