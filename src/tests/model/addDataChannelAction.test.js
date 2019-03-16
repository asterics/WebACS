import Model from "../../model/model.js";
import DataChannel from "../../model/dataChannel.js";
import addDataChannelAction from "../../model/addDataChannelAction.js";

describe('addDataChannelAction', () => {

	test('init', () => {
		var model = Model("test.acs");
		var dc = DataChannel('dataChannel1');
		var action = addDataChannelAction(model, dc);
		expect(action.getModel()).toBe(model);
	})

	test('execute()', () => {
		var model = Model("test.acs");
		var dc = DataChannel('dataChannel1');
		var action = addDataChannelAction(model, dc);
		action.execute();
		expect(model.dataChannelList[0]).toBe(dc);
		expect(model.undoStack[0]).toBe(action);
	});

	test('undo()', () => {
		var model = Model("test.acs");
		var dc = DataChannel('dataChannel1');
		var action = addDataChannelAction(model, dc);
		action.execute();
		action.undo();
		expect(model.dataChannelList.length).toBe(0);
		expect(model.redoStack[0]).toBe(action);
	});
});