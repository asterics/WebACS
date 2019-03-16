import Model from "../../model/model.js";
import EventChannel from "../../model/eventChannel.js";
import addEventChannelAction from "../../model/addEventChannelAction.js";

describe('addEventChannelAction', () => {

	test('init', () => {
		var model = Model("test.acs");
		var ec = EventChannel('eventChannel1');
		var action = addEventChannelAction(model, ec);
		expect(action.getModel()).toBe(model);
	});

	test('execute()', () => {
		var model = Model("test.acs");
		var ec = EventChannel('eventChannel1');
		var action = addEventChannelAction(model, ec);
		action.execute();
		expect(model.eventChannelList[0]).toBe(ec);
		expect(model.undoStack[0]).toBe(action);
	});

	test('undo()', () => {
		var model = Model("test.acs");
		var ec = EventChannel('eventChannel1');
		var action = addEventChannelAction(model, ec);
		action.execute();
		action.undo();
		expect(model.eventChannelList.length).toBe(0);
		expect(model.redoStack[0]).toBe(action);
	});
});