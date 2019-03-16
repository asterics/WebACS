import Model from "../../model/model.js";
import Component from "../../model/component.js";

import addComponentAction from "../../model/addComponentAction.js";

describe('addComponentAction', () => {

	test('init', () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var action = addComponentAction(model, comp);
		expect(action.getModel()).toBe(model);
	});

	test('execute()', () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var action = addComponentAction(model, comp);
		action.execute();
		expect(model.componentList[0]).toBe(comp);
		expect(model.undoStack[0]).toBe(action);
	});

	test('undo()', () => {
		var model = Model("test.acs");
		var comp = Component("comp1","typeID","desc",true,1,2,"actuator",true,true);
		var action = addComponentAction(model, comp);
		action.execute();
		action.undo();
		expect(model.componentList.length).toBe(0);
		expect(model.redoStack[0]).toBe(action);
	});
});