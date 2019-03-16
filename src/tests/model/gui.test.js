import Gui from "../../model/gui.js";

describe('Gui', () => {

	test('init', () => {
		var gui = Gui(1, 2, 30, 40, true);
		expect(gui.getX()).toBe(1);
		expect(gui.getY()).toBe(2);
		expect(gui.getWidth()).toBe(30);
		expect(gui.getHeight()).toBe(40);
		expect(gui.getIsExternal()).toBe(true);
	});
});