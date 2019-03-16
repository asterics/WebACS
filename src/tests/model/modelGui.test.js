import ModelGui from "../../model/modelGui.js";

describe('ModelGui', () => {

	test('setDecoration()', () => {
		var mGui = ModelGui();
		mGui.setDecoration(false);
		expect(mGui.getDecoration()).toBe(false);
	});

	test('setFullScreen()', () => {
		var mGui = ModelGui();
		mGui.setFullScreen(true);
		expect(mGui.getFullScreen()).toBe(true);
	});

	test('setAlwaysOnTop()', () => {
		var mGui = ModelGui();
		mGui.setAlwaysOnTop(true);
		expect(mGui.getAlwaysOnTop()).toBe(true);
	});

	test('setToSystemTray()', () => {
		var mGui = ModelGui();
		mGui.setToSystemTray(true);
		expect(mGui.getToSystemTray()).toBe(true);
	});

	test('setShowControlPanel()', () => {
		var mGui = ModelGui();
		mGui.setShowControlPanel(false);
		expect(mGui.getShowControlPanel()).toBe(false);
	});
});